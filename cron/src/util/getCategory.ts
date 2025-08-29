import { GoogleGenAI } from "@google/genai";
import { categoryNames, newsDataForCategory } from '../constant.js';
import dotenv from 'dotenv';
import { getUserPromptForCategory } from '../prompts/promptForCategory.js';
import {
    categoryPromptCnt,
    newsInDBCnt,
    procssingNewsCnt,
    relatedArticlesPromptCnt,
} from '../embed.js';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
    throw new Error('No GEMINI_API_KEY provided in environment variables.');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function getCategory(processingNews: newsDataForCategory): Promise<string> {

    let userPrompt = getUserPromptForCategory(processingNews)
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite-preview-06-17",
            contents: userPrompt,
        });

        let raw = response.text || "";
        console.log('Raw response from AI:', raw);

        raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');

        const match = raw.trim().match(/-?\d+/);
        const index = match ? Number(match[0]) : -2;

        if (!Number.isInteger(index)) {
            console.warn("Not an integer. Returning 'Others'");
            return 'Others';
        }

        if (index === -1) {
            return 'Others';
        }

        if (index < 0 || index >= categoryNames.length) {
            console.warn("Index out of bounds. Returning 'Others'");
            return 'Others';
        }

        return categoryNames[index];
    } catch (error) {
        console.error('Error during AI processing:', error);
        console.log(`\n[+] Processing articles cnt: ${procssingNewsCnt}`);
        console.log(`\n[+] News in DB cnt: ${newsInDBCnt}`);
        console.log(`\n[+] Related articles prompt cnt: ${relatedArticlesPromptCnt}`);
        console.log(`\n[+] Category prompt cnt: ${categoryPromptCnt}`);

        process.exit(1);
    }
}









