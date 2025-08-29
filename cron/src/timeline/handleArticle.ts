import { Article, MatchType } from "../constant.js";
import { PrismaClient } from "@prisma/client";
import { setLongDescription } from "../util/updateLongDescription.js";
import { TwitterNewsAddedInDB, WebsiteNewsAddedInDB, YoutubeNewsAddedInDB } from "../util/logsForDebugging.js";

const prisma = new PrismaClient();

const createMiniNews = async (article: Article, category: string, newsId: string) => {
    const miniNews = await prisma.miniNews.create({
        data: {
            title: article.title,
            content: article.content,
            links: [article.link],
            sources: [article.source],
            pubDate: article.pubDate,
            imageUrl: article.imageUrl,
            newsId,
            category: category,
            youtube: article.youtube || false,
            twitter: article.twitter || false,
            ytViews: article.views || 0
        }
    });

    if (article.twitter) TwitterNewsAddedInDB();
    else if (article.youtube) YoutubeNewsAddedInDB();
    else WebsiteNewsAddedInDB();

    return miniNews.id
    // await setLongDescription({ id: miniNews.id, link: miniNews.links[0] });
}

const handleUnrelatedArticle = async (article: Article, category: string) => {
    console.log("Handling unrelated article:", article.title);
    // const consoleError = console.error;
    // console.error = () => { }
    try {
        const news = await prisma.news.create({ data: {} });

        const miniNewsId = await createMiniNews(article, category, news.id);
        console.log("Created unrelated article in DB with ID:", miniNewsId);
        // console.error = consoleError;
        return miniNewsId;
    } catch (error) {
        console.error("Error stroing this article in db:", error);
        // console.error = consoleError;
        return null;
    }
}

const handleTimelineArticle = async (
    article: Article, categories: string,
    relatedId: string) => {

    const consoleError = console.error;
    console.error = () => { }

    const relevantArticle = await prisma.miniNews.findFirst({
        where: { id: relatedId },
    });

    if (!relevantArticle) {
        console.warn("---Related article not found in DB, skipping child creation.");
        return null;
    }

    try {
        const miniNewsId = await createMiniNews(article, categories, relevantArticle.newsId);

        console.log("added timeline miniNewsId:", miniNewsId);
        console.error = consoleError;
        return miniNewsId;

    } catch (error) {
        console.log("Error stroing this article in db:", error);
        console.error = consoleError;
        return null;
    }
}


const handleSameEventArticle = async (
    article: Article,
    relatedId: string) => {

    const consoleError = console.error;
    console.error = () => { }

    const relevantArticle = await prisma.miniNews.findFirst({
        where: { id: relatedId },
    });

    if (!relevantArticle) {
        console.warn("---Related article not found in DB, skipping child creation.");
        return null;
    }

    try {
        const miniNews = await prisma.miniNews.update({
            where: { id: relevantArticle.id },
            data: {
                links: {
                    push: article.link,
                },
                sources: {
                    push: article.source,
                }
            }
        });


        console.log("Updated existing article with new link, all links are:", miniNews.links, "\n newsid:", miniNews.newsId);

        if (article.twitter) TwitterNewsAddedInDB();
        else if (article.youtube) YoutubeNewsAddedInDB();
        else WebsiteNewsAddedInDB();

        // await setLongDescription({ id: miniNews.id, link: miniNews.links[0] });
        console.error = consoleError;
        return miniNews.id;

    } catch (error) {
        console.log("Error stroing this article in db:", error);
        console.error = consoleError;
        return null;
    }
}


export const handleArticle = async (article: Article, category: string, matchType: MatchType, relatedId: string) => {
    switch (matchType) {
        case MatchType.UNRELATED:
            return await handleUnrelatedArticle(article, category);
        case MatchType.TIMELINE:
            return await handleTimelineArticle(article, category, relatedId);
        case MatchType.SAME_EVENT:
            return await handleSameEventArticle(article, relatedId);
        default:
            console.warn("---Unknown match type, skipping article processing.");
            return null;

    }

}



export const getMiniNewsById = async (id: string) => {
    let miniNews = await prisma.miniNews.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            pubDate: true,
        }
    });

    if (!miniNews) {
        console.warn(`MiniNews with ID ${id} not found.`);
        return null;
    }


    return miniNews;
}