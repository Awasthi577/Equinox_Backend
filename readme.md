# News Aggregation & Timeline Clustering Pipeline 

This document explains the architecture, flow, and AI-powered logic behind our news aggregation system. It's detailed enough that everyone can read and understand how and why each component works.

## Overview

scraping news from three sources:

- Websites (via RSS feeds)

- YouTube (via YouTube RSS)

- Twitter (via Nitter)

### Each news item (called an article) is processed to:

- Detect if it's part of an existing news timeline.

- Categorize it into a subject like Politics, Business, etc.

- Store it in DB + vector DB (Pinecone).

## Entry Point: index.ts
---

Responsibilities

- Delay for 5s (to allow vector DB to initialize).

- Scrape from the 3 sources.

---

Save scraped articles to:

- articles.json (Website)

- yt-articles.json (YouTube)

- twitter-articles.json (Twitter)

- Call processNewsFromFile() for each file.

## Processing Flow (in embed.ts)

```processNewsFromFile(jsonFilePath)```

- Iterates through each article.
- Reads JSON file containing articles.
- Calls processArticle(article).

# Inside processArticle(article)

Step-by-Step

1. Similarity Search (Vector DB)

We create a queryText = title + content, then call Pinecone:

```const topNewsResults = await index.searchRecords(...)```

We then extract their MiniNews from the DB using:

```await getMiniNewsById(id)```

2. Relationship Detection (LLM)

We use an LLM to compare the current article (processingNews) against similar ones (newsArticleInDB) using:

```await getBestMatch({ processingNews, newsArticleInDB });```

The output is a strictly formatted JSON object:

```
{
  "matchType": "same-event" | "timeline" | "unrelated",
  "id": "<miniNewsId or none>",
  "title": "<title>"
}
```

MatchType definitions:

- same-event: The same exact real-world incident (e.g., a specific press release, arrest, or court judgment).

- timeline: Different events from the same broader story (e.g., a reaction to a speech, an update on an ongoing situation).

- unrelated: No strong narrative connection between the articles.

## Category Classification

We then classify the article's subject matter by calling:

```await getCategory({ title, content });```

This returns a category like Politics, Crime, Business, or "Others". It uses an LLM with a structured prompt to pick the index of the best matching category from a predefined array. It returns -1 if the article doesn't fit any category.

## Store to DB
Finally, we save the article to our database by calling:

```await handleArticle(article, category, matchType, relatedId);```

This function saves the article differently based on its matchType:

1. same-event ➔ Merges the new source/link into an existing article.

2. timeline ➔ Creates a new MiniNews entry but connects it to the existing story via newsId.

3. unrelated ➔ Creates a new root timeline for a new story.

## Update Pinecone

We add the new article's vector embedding to our vector database so future articles can be matched against it.

```
index.upsertRecords([{ id: miniNewsId, chunk_text: queryText }])
```
## AI: getBestMatch()

- Purpose

Given the current article and the top 10 most similar articles from the vector DB, this function decides if the new article is the same event, part of a timeline, or unrelated.

- Input to LLM

1. processingNews: The title, content, and publication date of the article being processed.

2. newsArticleInDB: The list of the top 10 most similar articles retrieved from the database.

## Prompt Summary

The LLM is instructed to:

- Read the main news article and the 10 candidate articles.

- Choose the candidate with the strongest narrative connection.

Respond with a strict JSON format:

```
{
  "matchType": "same-event" | "timeline" | "unrelated",
  "id": "...",
  "title": "..."
}
```
If no meaningful match is found, it returns: { "matchType": "unrelated", "id": "none", "title": "" }

# Output Parsing

- We sanitize and parse the raw string output from the LLM to ensure we get a valid, structured JSON object.

## AI: getCategory()

- Purpose
To classify an article into one of our predefined categories using an LLM.

- Input
A JSON object containing the article's text and the list of possible categories.

```
{
  "processingNews": {
    "title": "India launches new UPI policy...",
    "content": "The central bank announced today..."
  },
  "categoryArray": ["Politics", "Business", "Crime", "Education", ...]
}
```

## LLM Prompt

The prompt asks the LLM to:

- Judge the article's core subject matter.

- Avoid being misled by tangential keywords.

- Return only the index (number) of the correct category from the categoryArray.

- If the LLM returns -1 or an invalid index, we set the category to "Others" as a fallback.

## DB Logic: handleArticle()

- This function manages how articles are written to the database based on the matchType determined by the AI.

To understand the database schema, have a look at prisma/schema.prisma.

## Unrelated Article

- A new News root entry is created to represent a new story/timeline.

- A new MiniNews entry is created for this article and linked to the new News root.

## Timeline Match

- The newsId from the related MiniNews is used to find the existing News root.

- A new MiniNews entry is created for this article and linked to that existing News root.

## Same Event

- The article is merged into an existing MiniNews entry.

- The new link and source are pushed into the arrays of the existing entry.

This process avoids creating duplicate entries for the same event reported by different sources.

## Final Outcome

- Every news article processed by the pipeline ends up in one of three states:

- As the first entry in a brand new timeline.

- As a child update within an existing timeline.

As a duplicate link merged into an existing article.

We store this structured data in our primary database and upsert the article's vector into Pinecone, creating a self-improving semantic news graph.
