import { newsDataForAi } from "../constant.js";

export const getUserPrompt = (
  processingNews: newsDataForAi,
  newsArticleInDB: newsDataForAi[]
) => {
  return `
You are given a \"processingNews\" article and an array of previously stored articles called \"newsArticleInDB\".

Your job is to compare the \"processingNews\" article with each article in \"newsArticleInDB\" and determine the **single most related article**, if any.

There are three types of relationships you may identify:

1. \"same-event\": The articles are about the exact same real-world event or announcement, even if the wording is different or sources vary. These are duplicates in substance.

2. \"timeline\": The article is clearly part of the same ongoing story — a cause, consequence, background, follow-up, or reaction. They are not duplicates, but form a narrative chain.

3. \"unrelated\": The article has no strong connection to any real-world event or story referenced in the processingNews article.

---

🧠 Rules:
- Only consider **event-based, factual connections**.
- Choose the **single most relevant match**, based on depth of connection and proximity in story.
- If two options qualify, prefer \"same-event\" over \"timeline\".
- evacuation, protests, sanctions, political statements, or military action in response to the same event chain should be treated as \"timeline\"
- Consider pubDate: If one article follows shortly after another and discusses its outcome, classify as \"timeline\".
- Articles with the same pubDate and overlapping core content are likely \"same-event\".

---

📤 Output Format:
Return **only JSON** with this exact structure:

If a related article is found:
{
  "matchType": "same-event" | "timeline",
  "id": "<matching_article_id>",
  "title": "<matching_article_title>"
}

If no related article is found:
{
  "matchType": "unrelated",
  "id": -1,
  "title": ""
}

---

Do not return code, markdown, explanations, thoughts, or steps. Only valid JSON as shown above.

Input:
{
  "processingNews": ${JSON.stringify(processingNews, null, 2)},
  "newsArticleInDB": ${JSON.stringify(newsArticleInDB, null, 2)}
}
`;
};
