import Parser from 'rss-parser';
import { writeFile } from 'fs/promises';
import dotenv from 'dotenv';
import { isToday } from '../util/isToday.js';
import { websiteRssFeeds, websiteSourceMapForBetterName, ytLimitFromEachSource } from '../constant.js';

dotenv.config()
const mode = process.env.MODE || "development";

const parser = new Parser({
    customFields: {
        item: [
            ['media:thumbnail', 'mediaThumbnail'],
            ['media:content', 'mediaContent'],
            ['enclosure', 'enclosure'],
        ]
    }
});

function extractTitle(title: string) {
    return websiteSourceMapForBetterName[title] || title;
}

function extractImageUrl(item: any) {
    if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
    if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
    if (item.enclosure?.url) return item.enclosure.url;
    return "";
}

export const scrapeWebsitNews = async () => {
    let count = 0
    const allArticles = [];
    for (let feedNumber = 0; feedNumber < websiteRssFeeds.length; feedNumber++) {
        const feedUrl = websiteRssFeeds[feedNumber];
        try {
            const feed = await parser.parseURL(feedUrl);

            if (!feed.title) continue;
            let articleTaken = 0;
            for (const item of feed.items) {
                if (item.pubDate && isToday(item.pubDate)) {
                    const article = {
                        title: item.title,
                        link: item.link,
                        pubDate: item.pubDate,
                        content: item.contentSnippet || '',
                        source: extractTitle(feed.title),
                        imageUrl: extractImageUrl(item),
                        youtube: false,
                        twitter: false

                    };
                    if (article.title && article.link && article.source && article.content && article.imageUrl) {
                        allArticles.push(article);
                        count++;
                        articleTaken++;
                    }
                    if (articleTaken >= ytLimitFromEachSource) break;
                }
            }
            if (articleTaken > 0) console.log(`fetched ${articleTaken} articles from ${extractTitle(feed.title)}".`);
        } catch (err) {
            console.error(`Failed to fetch ${feedUrl}:`, err);
        }
    }

    console.log(`fetched ${count} articles".`);
    const writePath = mode === "development" ? 'articles.json' : "./cron/articles.json";
    await writeFile(writePath, JSON.stringify(allArticles, null, 2))
    console.log("Successfully wrote articles.json");
}




