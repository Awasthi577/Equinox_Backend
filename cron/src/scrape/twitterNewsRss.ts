import * as cheerio from 'cheerio';
import { writeFile } from 'fs';
import puppeteer from 'puppeteer'
import { tweetLimitFromEachSource, TwitterChannels } from '../constant.js';
import { isToday } from '../util/isToday.js';
import dotenv from 'dotenv';

dotenv.config();
const mode = process.env.MODE || "development";

function cleanTwitterTitle(raw: string, maxLength = 100): string {
  let cleaned = raw
    .replace(/https?:\/\/\S+/g, '')         // Remove URLs
    .replace(/#[^\s#]+/g, '')               // Remove hashtags
    .replace(/@[^\s@]+/g, '')               // Remove mentions
    .replace(/[\n\r]+/g, ' ')               // Newlines to space
    .replace(/[“”‘’•◆→▲—–•✔️✅❌🚨🔴🔵⬇️⬆️🔥💥⚠️😱😭🤯🤬😡🤔🙄💔❤️🙏🇮🇳]/g, '') // Common emojis/symbols
    .replace(/[\u{1F300}-\u{1F6FF}]/gu, '') // Misc emoji unicode
    .replace(/[^a-zA-Z0-9\u0900-\u097F .,!?\-'"“”‘’()]/g, '') // Allow English, Hindi, common punct
    .replace(/\s{2,}/g, ' ')                // Collapse multiple spaces
    .replace(/^[.,:;'\-]+/, '')             // Trim leading junk
    .replace(/[.,:;'\-]+$/, '')             // Trim trailing junk
    .trim();

  // Capitalize if starts with lowercase
  if (/^[a-z]/.test(cleaned)) {
    cleaned = cleaned[0].toUpperCase() + cleaned.slice(1);
  }

  // Reject meaningless titles
  if (cleaned.length < 15 || /^watch$/i.test(cleaned)) {
    return '';
  }

  // Truncate
  return cleaned.length > maxLength
    ? cleaned.slice(0, maxLength).trim() + '...'
    : cleaned;
}


// function constructImageUrl(rawSrc: string
//   | null | undefined
// ): string {
//   if (!rawSrc) return "";

//   let cleanPath = rawSrc.replace(/^\/?pic\//, "");
//   return `https://nitter.net/pic/${cleanPath}`;
// }

const writePath = mode === "development" ? 'twitter-articles.json' : './cron/twitter-articles.json';

export const scrapeTweets = async () => {
  const allTweets: any[] = [];
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 ...');
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

  for (const source of TwitterChannels) {
    const url = `https://nitter.net/${source}`;
    console.log(`Scraping tweets from ${url}`);
    let takenCnt = 0;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForSelector('.timeline-item', { timeout: 10000 });
      await new Promise(res => setTimeout(res, 2000));

      const html = await page.content();
      const $ = cheerio.load(html);
      console.log("Found tweets:", $('.timeline-item').length);

      $('.timeline-item').slice(0, 10).each(async (_, el) => {

        if (takenCnt > tweetLimitFromEachSource) {
          return;
        }
        let content = $(el).find('.tweet-content.media-body').text().trim()
        content = cleanTwitterTitle(content, 100).trim()

        const time = $(el).find('.tweet-date a').attr('title') || '';

        // let imageEl = $(el).find(".card-image-container img").first()
        // if (!imageEl || imageEl.length === 0) {
        //   imageEl = $(el).find(".attachment .video-container img").first()
        // }
        // const rawSrc = imageEl.attr("src");
        // let imageUrl = constructImageUrl(rawSrc);

        const nitterHref = $(el).find('.tweet-link').attr('href') || $(el).find('.tweet-date a').attr('href');
        let twitterUrl = '';
        if (nitterHref && /^\/[a-zA-Z0-9_]+\/status\/\d+/.test(nitterHref)) {
          const cleanPath = nitterHref.split('#')[0];
          twitterUrl = `https://x.com${cleanPath}`;
        }

        if (!time || !isToday(time)) {
          return;
        }

        const cleanedStr = time.replace('·', '').replace(/\s+/g, ' ').trim();
        const tweetDate = new Date(cleanedStr);

        const tweetNews = {
          title: content,
          link: twitterUrl,
          pubDate: tweetDate,
          source,
          youtube: false,
          twitter: true,
        }

        if (!tweetNews.title || tweetNews.title.length < 15 || tweetNews.title.startsWith("Enable hls") || !tweetNews.link || !tweetDate) {
          console.log("Skipping tweet due to missing or invalid data:", tweetNews);
          return;
        }

        if (tweetNews.title && tweetNews.link && tweetNews.source) {
          allTweets.push(tweetNews);
          takenCnt++;
        }

      });
      console.log(`Finished scraping ${source}. Total tweets collected: ${allTweets.length}`);

    }
    catch (err) {
      console.error(`Failed scraping ${url}`, err);
    }
  }

  await browser.close();
  await new Promise<void>((resolve, reject) => {
    writeFile(writePath, JSON.stringify(allTweets, null, 2), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
  console.log(`Scraped ${allTweets.length} tweets\n Successfully wrote twitter-articles.json\n`);

};

