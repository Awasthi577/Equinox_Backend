
# News Aggregation & Timeline Clustering Pipeline (Docs for Devs)

This document explains the **architecture**, **flow**, and **AI-powered logic** behind our **news aggregation system**. It's detailed enough that everyone can read and understand how and why each component works.

---

## Overview

We are scraping news from **three sources**:

* **Websites** (via RSS feeds)
* **YouTube** (via YouTube RSS)
* **Twitter** (via Nitter)

Each news item (called an `article`) is processed to:

1. Detect if it's part of an existing news timeline.
2. Categorize it into a subject like Politics, Business, etc.
3. Store it in our DB + vector DB (Pinecone).

---

## Entry Point: `index.ts`

### Responsibilities:

1. Delay for 5s (to allow vector DB to initialize).
2. Scrape from 3 sources.
3. Save scraped articles to:

   * `articles.json` (Website)
   * `yt-articles.json` (YouTube)
   * `twitter-articles.json` (Twitter)
4. Call `processNewsFromFile()` for each file.

---

## Processing Flow (in `embed.ts`)

```ts
processNewsFromFile(jsonFilePath)
```

1. **Reads JSON file** containing articles.
2. Iterates through each article.
3. Calls `processArticle(article)`.

---

## Inside `processArticle(article)`

### Step-by-Step

#### 1. Similarity Search (Vector DB)

We create a `queryText = title + content`, then call Pinecone:

```ts
const topNewsResults = await index.searchRecords(...)
```

This gives us `top 10` most similar articles using semantic vector similarity.

We then extract their MiniNews from the DB using:

```ts
await getMiniNewsById(id)
```

#### 2. Relationship Detection (LLM)

We use an LLM to compare the current article (`processingNews`) against similar ones (`newsArticleInDB`) using:

```ts
await getBestMatch({ processingNews, newsArticleInDB });
```

### Output JSON (very important):

```json
{
  "matchType": "same-event" | "timeline" | "unrelated",
  "id": "<miniNewsId or none>",
  "title": "<title>"
}
```

### MatchType definitions:

* **same-event**: Same exact real-world incident (press release, arrest, judgment).
* **timeline**: Different events from the same broader story (reaction, update).
* **unrelated**: No strong narrative connection.

#### 3. Category Classification

We then call:

```ts
await getCategory({ title, content });
```

Which returns a category like `Politics`, `Crime`, `Business`, or "Others" based on this prompt:

> Uses LLM with structured prompt to pick one best matching category index from a category array. Returns `-1` if it doesn't fit any.

#### 4. ✉️ Store to DB

Finally, we call:

```ts
await handleArticle(article, category, matchType, relatedId);
```

Which saves the article differently based on matchType:

* `same-event` ➔ Merges into existing article.
* `timeline` ➔ Creates a new MiniNews entry but connects it via `newsId`.
* `unrelated` ➔ Creates new root timeline.

#### 5. 🔗 Update Pinecone

```ts
index.upsertRecords([{ id: miniNewsId, chunk_text: queryText }])
```

Adds the article into our vector DB so future articles can match it.

---

## 🪡 AI: `getBestMatch()`

### Purpose:

Given the current article and the top 10 similar articles from vector DB, decide if it's the **same event**, **part of a timeline**, or **unrelated**.

### Input to LLM:

* `processingNews`: Title, content, pubDate
* `newsArticleInDB`: Top 10 most similar articles

### Prompt Summary:

The LLM:

* Reads the main news + other candidates
* Chooses the strongest connection
* Responds with strict JSON format:

```json
{
  "matchType": "same-event" | "timeline" | "unrelated",
  "id": "...", // miniNewsId
  "title": "..." // matching article
}
```

> If it doesn't find any real match, it returns: `{ matchType: "unrelated", id: "none", title: "" }`

### Output Parsing:

* We sanitize and parse raw string from LLM to get this structured JSON.

---

## AI: `getCategory()`

### Purpose:

Classify the article into one of our predefined categories using LLM.

### Input:

```json
{
  "processingNews": {
    "title": "India launches new UPI policy...",
    "content": "The central bank announced today..."
  },
  "categoryArray": ["Politics", "Business", "Crime", "Education", ...]
}
```

### LLM Prompt:

* Judge the article's **core subject**.
* Avoid being misled by keywords.
* Return only the **index (number)** of the correct category.

If it returns -1, we fallback to:

```ts
category = "Others"
```

---

## DB Logic: `handleArticle()`

Based on matchType:

### 1. Unrelated Article:

* Create a new `News` root.
* Add new `MiniNews` under it.

### 2. Timeline Match:

* Use `newsId` from related MiniNews.
* Add new MiniNews under it.

### 3. Same Event:

* Merge article into existing MiniNews:

  * Push new  `li`*`nk`*
  * Push new `source`
  * Avoid duplication

---


## To understand how we are handling articles in db. 
* have a look at prisma/schema.prisma 

## Final Outcome

Every news article ends up either:

* As a **new thread** of timeline.
* As a **child update** of an old one.
* As a **duplicate link** of an existing article.

We **store it in the database** and also **upsert into Pinecone**, creating a self-improving semantic news graph.

---

