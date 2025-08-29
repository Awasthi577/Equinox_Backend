import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import { MatchType, ResultJson } from '../constant.js';
import { categoryPromptCnt, newsInDBCnt, procssingNewsCnt, relatedArticlesPromptCnt } from '../embed.js';
import { getUserPrompt } from '../prompts/promptForTimeline.js';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
    throw new Error('No GEMINI_API_KEY provided in environment variables.');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function getBestMatch({ processingNews, newsArticleInDB }: {
    processingNews: { id: string; title: string; content: string; pubDate: string };
    newsArticleInDB: { id: string; title: string; content: string; pubDate: string }[];
}): Promise<ResultJson> {

    const returnData: ResultJson = {
        matchType: MatchType.UNRELATED,
        id: 'none'
    };

    if (!processingNews || !newsArticleInDB || newsArticleInDB.length === 0) {
        return returnData;
    }
    const userPrompt = getUserPrompt(processingNews, newsArticleInDB);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite-preview-06-17",
            contents: userPrompt,
        });

        const raw = response.text || "";
        console.log("Raw response from AI:", raw);
        const cleaned = raw
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/\s*```$/, '');
        try {
            const parsed: ResultJson = JSON.parse(cleaned);
            if (
                !Object.values(MatchType).includes(parsed.matchType) ||
                typeof parsed.id !== 'string'
            ) {
                return returnData;
            }
            return parsed;
        } catch (err) {
            console.log("JSON parse error:", err);
            return returnData;
        }

    } catch (error) {
        console.log("Error during AI processing:", error);
        console.log("Error during AI processing:", error);
        console.log(`\n[+] procesing articles cnt ${procssingNewsCnt} `);
        console.log(`\n[+] news in DB cnt ${newsInDBCnt} `);
        console.log(`\n[+] related articles prompt cnt ${relatedArticlesPromptCnt} `);
        console.log(`\n[+] category prompt cnt ${categoryPromptCnt} `);
        process.exit(1);
    }
}




