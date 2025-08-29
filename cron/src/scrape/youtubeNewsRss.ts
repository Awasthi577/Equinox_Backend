import Parser from 'rss-parser';
import { writeFile } from 'fs/promises';
import dotenv from 'dotenv';
import { ytChannelIdMap, ytChannels, ytLimitFromEachSource } from '../constant.js';
import { isToday } from '../util/isToday.js';

dotenv.config();
const mode = process.env.MODE || "development";

const parser = new Parser({
    customFields: {
        item: [
            ['media:group', 'mediaGroup'],
            ['yt:videoId', 'videoId'],
            ['yt:channelId', 'channelId'],
        ],
        feed: []
    }
});


const ytRssFeeds = Object.entries(ytChannelIdMap).map(([_, channelId]) => {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
})

const allLinks: string[] = []

export const scrapeYouTubeNews = async () => {
    const allVideos: any[] = [];
    let index = -1;
    for (const feedUrl of ytRssFeeds) {
        index++;
        try {
            const feed = await parser.parseURL(feedUrl);
            let limit = ytLimitFromEachSource;
            for (const entry of feed.items) {
                if (limit <= 0) break;

                let link = entry.link || `https://www.youtube.com/watch?v=${(entry as any).videoId}`
                if (allLinks.includes(link)) continue;
                const group = (entry as any).mediaGroup;

                const published = entry.pubDate;
                if (!published || !isToday(published)) continue;

                let content = group?.['media:description'][0] || ''

                if (content) content = content.split('http')[0].trim();
                if (content) content = content.split('#')[0].trim();
                if (content) content = content.split('\n')[0].trim();
                if (content) content = content.split('    ')[0].trim();

                const statistics = group?.['media:community']?.[0]?.['media:statistics']?.[0]?.$;
                const views = parseInt(statistics?.views || '0');


                const article = {
                    title: entry.title || '',
                    content,
                    imageUrl: group?.['media:thumbnail']?.[0]?.$?.url || '',
                    link,
                    pubDate: published,
                    source: ytChannels[index] || 'Unknown Source',
                    youtube: true,
                    twitter: false,
                    views
                };

                if (article.title && article.link && article.source && article.content && article.imageUrl) {
                    allVideos.push(article);
                    allLinks.push(link);
                    limit--;
                }

            }
        } catch (err) {
            console.error(`Failed to fetch from ${feedUrl}:`, err);
        }
    }

    console.log(`Parsed ${allVideos.length} YouTube videos.`);
    const writePath = mode === "development" ? 'yt-articles.json' : './cron/yt-articles.json';
    await writeFile(writePath, JSON.stringify(allVideos, null, 2));
    console.log("Successfully wrote yt-articles.json");

    allLinks.length = 0;
};

