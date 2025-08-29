import { prismaClient } from "../lib/db";
import { contextMiddleware } from "./user";


export class BookmarkService {

    public static async getBookmarks(context: any, limit: number, offset: number) {

        const { id } = contextMiddleware(context);
        const bookmarks = await prismaClient.bookmark.findMany({
            where: { userId: id },
            include: {
                miniNews: true
            },
            skip: offset,
            take: limit,
        });

        const newsList = bookmarks.map(b => b.miniNews);
        return newsList;
    }

    public static async createBookmarks(context: any, miniNewsId: string) {

        const { id } = contextMiddleware(context);
        const alreadyExists = await prismaClient.bookmark.findFirst({
            where: {
                userId: id,
                miniNewsId
            }
        });

        if (alreadyExists) {
            throw new Error("User has already bookmared this news before!");
        }

        const newBookmark = await prismaClient.bookmark.create({
            data: {
                userId: id,
                miniNewsId,
            }
        });
        return newBookmark
    }

    public static async deleteBookmark(context: any, miniNewsId: string) {

        const { id } = contextMiddleware(context);
        await prismaClient.bookmark.delete({
            where: {
                userId_miniNewsId: {
                    userId: id,
                    miniNewsId
                }
            }
        });

    }

    public static async deleteAllBookmarks(context: any) {

        const { id } = contextMiddleware(context);
        await prismaClient.bookmark.deleteMany({
            where: {
                userId: id
            }
        });

    }
}
