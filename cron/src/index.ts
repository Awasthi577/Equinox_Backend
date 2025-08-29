import { scrapeWebsitNews } from "./scrape/websiteNewsRss.js"
import { processNewsFromFile } from "./embed.js";
import dotenv from 'dotenv';
import { scrapeYouTubeNews } from "./scrape/youtubeNewsRss.js";
import { scrapeTweets } from "./scrape/twitterNewsRss.js";
import { finalLog } from "./util/logsForDebugging.js";


dotenv.config()
const init = async () => {
    console.log("setting index in vector DB...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    await scrapeWebsitNews();
    await scrapeYouTubeNews();
    await scrapeTweets();
    // await processNewsFromFile("all_articles.json");
    await processNewsFromFile("articles.json");
    console.log("Finished articles.json");

    await processNewsFromFile("yt-articles.json");
    console.log("Finished yt-articles.json");

    await processNewsFromFile("twitter-articles.json");
    console.log("Finished twitter-articles.json");

    finalLog()
}

init().then(() => {
    console.log("Cron job completed successfully.");
}).catch((error) => {
    console.error("Error during cron job execution:", error);
});