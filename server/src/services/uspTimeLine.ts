import { prismaClient } from "../lib/db";
import { contextMiddleware } from "./user";


export class USPTimelineService {

    public static async getUSPTimeLine(context: any, limit: number, offset: number) {

        const { id } = contextMiddleware(context);
        const timeline = await prismaClient.timeline.findMany({
            where: { userId: id },
            include: {
                miniNews: true
            },
            skip: offset,
            take: limit,
        });

        const newsList = timeline.map(b => b.miniNews);
        return newsList;
    }

    public static async createTimeline(context: any, miniNewsId: string) {

        const { id } = contextMiddleware(context);

        const alreadyExists = await prismaClient.timeline.findFirst({
            where: {
                userId: id,
                miniNewsId
            }
        });
        console.log("timeline already exists: ", alreadyExists);

        if (alreadyExists) {
            throw new Error("User has already TimeLined this news before!");
        }

        const newTimeline = await prismaClient.timeline.create({
            data: {
                userId: id,
                miniNewsId,
            }
        });
        return newTimeline
    }

    public static async deleteTimeline(context: any, miniNewsId: string) {

        const { id } = contextMiddleware(context);
        await prismaClient.timeline.delete({
            where: {
                userId_miniNewsId: {
                    userId: id,
                    miniNewsId
                }
            }
        });

    }

    public static async deleteAllTimeline(context: any) {

        const { id } = contextMiddleware(context);
        await prismaClient.timeline.deleteMany({
            where: {
                userId: id
            }
        });

    }
}
