import { YoutubeService } from "../../services/youtube";

const queries = {

    getYtNewsOfSameParent: async (_: any, { query, parentNewsId, lim, offset }:
        {
            query: string,
            parentNewsId: string,
            lim: number,
            offset: number
        }, context: any) => {
        const newsOfSameParent = await YoutubeService.getYtOfSameParent(context, query, parentNewsId, lim, offset)
        return newsOfSameParent;
    }
}

export const resolvers = { queries }