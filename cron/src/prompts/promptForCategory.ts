import { categoryNames, newsDataForCategory } from "../constant.js";

export const getUserPromptForCategory = (processingNews: newsDataForCategory) => {
  const indexedCategoryArray = categoryNames
    .map((name, i) => `  ${i}: "${name}"`)
    .join(',\n');

  return `
You are an intelligent and precise news classification model.

You are given:
- A **news article** ("processingNews") with a **title** and **content**.
- A list of predefined categories in "categoryArray", each with its **0-based index**.

Your task:
- Analyze the **main topic** and **core subject** of the article.
- Select the **most relevant category** by returning its index.

---

### Indexing Rules:
- Index must be **0-based** (first = 0, second = 1, etc.).
- Do NOT return 1-based index.
- If the article does NOT clearly fit any category, return **-1**.

---

### Classification Instructions:
- Do NOT match based on keywords alone. Understand **context**.
- Do NOT guess. If unsure, return -1.
- Only return a valid index if you are clearly confident the article fits a category.

For example:
- “Last rites by CM” → likely **Politics**, not **Religion**.
- “Elon Musk talking politics” → **Politics**, not **Business**.
- “A criminal case involving a monk” → **Crime**, not **Religion**.

---

### Category List:
[
${indexedCategoryArray}
]

---

### Final Response Instructions:
You MUST respond with **only a single integer on one line**.
No category name. No explanation. No labels. No formatting.

**Valid answers:**
\`0\`  
\`-1\`  
\`7\`

❗️If you are NOT confident about the match, return **-1**.  
This is important. Do NOT guess.

---

Input:
{
  "processingNews": ${JSON.stringify(processingNews, null, 2)},
  "categoryArray": [
${indexedCategoryArray}
  ]
}
`;
};
