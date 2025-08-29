import { NewsService } from "../../services/news"

const queries = {

    getSpecificNews: async (_: any, { date, category, lim, offset }:
        {
            date: string,
            category: string,
            lim: number,
            offset: number
        }, context: any) => {
        const allNews = await NewsService.getSpecificNews(context, date, category, lim, offset);
        return allNews;
    },

    getNewsById: async (_: any, { miniNewsId }:
        {
            miniNewsId: string
        }, context: any) => {
        const allNews = await NewsService.getNewsById(context, miniNewsId);
        return allNews;
    },

    getNews: async (_: any, { query, lim, offset }:
        {
            query: string,
            lim: number,
            offset: number
        }, context: any) => {
        const allNews = await NewsService.getAllNews(context, query, lim, offset);
        return allNews
    },
    getNewsByCategory: async (_: any, { query, category, lim, offset }:
        {
            query: string,
            category: string,
            lim: number,
            offset: number
        }, context: any) => {
        const allNewsByCategory = await NewsService.getNewsByCategory(context, query, category, lim, offset);

        return allNewsByCategory;
    },
    getNewsOfSameParent: async (_: any, { query, parentNewsId, lim, offset }:
        {
            query: string,
            parentNewsId: string,
            lim: number,
            offset: number
        }, context: any) => {
        const newsOfSameParent = await NewsService.getNewsOfSameParent(context, query, parentNewsId, lim, offset)
        return newsOfSameParent;
    }
}

export const resolvers = { queries }