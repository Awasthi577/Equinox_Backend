import { Readability } from "@mozilla/readability";
import { createObjectCsvWriter } from "csv-writer"
import axios from "axios";
import { JSDOM } from "jsdom";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const csvWriter = createObjectCsvWriter({
  path: './newsData.csv',
  header: [
    { id: 'title', title: 'Title' },
    { id: 'content', title: 'Content' }
  ],
  alwaysQuote: true,
});

export async function setLongDescription(miniNews: { id: string; link: string }) {
  try {
    const { data: html } = await axios.get(miniNews.link, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      }
    });

    const originalConsoleError = console.error;
    console.error = () => { };

    const dom = new JSDOM(html, { url: miniNews.link });

    console.error = originalConsoleError;

    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (article?.textContent) {

      const cleaned = article.textContent
        .replace(/(?:twitter\.com|facebook\.com|instagram\.com)[^\s]+/gi, "")
        .replace(/(First Published|Last Updated):.+?\n/gi, "")
        .replace(/\s{2,}/g, " ")


      //get bias from model endpoint using the cleaned text
      // const bias = await getBias(cleaned);

      await client.miniNews.update({
        where: { id: miniNews.id },
        data: {
          // add to bias array , push to the array not set
          bias: {
            push: "left",
          },
        }
      });

      // await csvWriter.writeRecords([records]);
      // console.log(`CSV file created with ${records.title} records.`);

    } else {
      console.warn(`No article content found at ${miniNews.link}`);
    }
  } catch (err: any) {
    console.warn(`Failed to extract ${miniNews.link}: ${err.message}`);
  }
}
