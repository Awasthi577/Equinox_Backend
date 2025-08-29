import { prismaClient } from "../lib/db";
import { contextMiddleware } from "./user";

export class YoutubeService {

    public static async getYtOfSameParent(context: any, query: string, parentNewsId: string, limit: number, offset: number) {

        let initialNews = null;
        console.log("fetching youtube content with query:", query, "parentNewsId:", parentNewsId, "limit:", limit, "offset:", offset);
        let id = null;
        try {
            const { id: userid } = contextMiddleware(context);
            id = userid;
        } catch (error) {
            console.log("fetching youtube content without logging in!")
        }

        if (query?.trim() === "") {
            initialNews = await prismaClient.miniNews.findMany({
                orderBy: {
                    pubDate: 'desc',
                },
                where: {
                    youtube: true,
                    newsId: parentNewsId
                },
                skip: offset,
                take: limit,
            });
        }
        else {
            initialNews = await prismaClient.$queryRawUnsafe(
                `
            SELECT id, title, content, score, youtube, category, "newsId", "pubDate", link, source, "imageUrl"
            FROM "MiniNews"
            WHERE "newsId" = $2
            AND youtube = true
            AND search_vector @@ plainto_tsquery('english', $1)
            ORDER BY ts_rank(search_vector, plainto_tsquery('english', $1)) DESC
            LIMIT $3 OFFSET $4;
            `,
                query,
                parentNewsId,
                limit,
                offset
            );
        }

        if (!initialNews) throw new Error("error in fetching Ytnews!")
        if (id) {
            const userBookmarkedData = await prismaClient.bookmark.findMany({
                where: { userId: id }
            })
            initialNews = (initialNews as { id: string }[]).map((news: { id: string }) => {
                const isBookmarked = userBookmarkedData.some((bookmark: { miniNewsId: string }) => bookmark.miniNewsId === news.id);
                return {
                    ...news,
                    isBookmarked
                }
            })
        }
        return initialNews
    }

    public static async getXOfSameParent(context: any, query: string, parentNewsId: string, limit: number, offset: number) {

        let initialNews = null;
        console.log("fetching X content with query:", query, "parentNewsId:", parentNewsId, "limit:", limit, "offset:", offset);
        let id = null;
        try {
            const { id: userid } = contextMiddleware(context);
            id = userid;
        } catch (error) {
            console.log("fetching X content without logging in!")
        }

        if (query?.trim() === "") {
            initialNews = await prismaClient.miniNews.findMany({
                orderBy: {
                    pubDate: 'desc',
                },
                where: {
                    twitter: true,
                    newsId: parentNewsId
                },
                skip: offset,
                take: limit,
            });
        }
        else {
            initialNews = await prismaClient.$queryRawUnsafe(
                `
            SELECT id, title, content, score, youtube, category, "newsId", "pubDate", link, source, "imageUrl"
            FROM "MiniNews"
            WHERE "newsId" = $2
            AND twitter = true
            AND search_vector @@ plainto_tsquery('english', $1)
            ORDER BY ts_rank(search_vector, plainto_tsquery('english', $1)) DESC
            LIMIT $3 OFFSET $4;
            `,
                query,
                parentNewsId,
                limit,
                offset
            );
        }

        if (!initialNews) throw new Error("error in fetching Xnews!")
        if (id) {
            const userBookmarkedData = await prismaClient.bookmark.findMany({
                where: { userId: id }
            })
            initialNews = (initialNews as { id: string }[]).map((news: { id: string }) => {
                const isBookmarked = userBookmarkedData.some((bookmark: { miniNewsId: string }) => bookmark.miniNewsId === news.id);
                return {
                    ...news,
                    isBookmarked
                }
            })
        }
        return initialNews
    }
}
