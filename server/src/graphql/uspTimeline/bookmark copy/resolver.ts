import { USPTimelineService } from "../../../services/uspTimeLine";

const queries = {
    fetchTimeline: async (_: any, { limit, offset }: { limit: number, offset: number }, context: any) => {
        return await USPTimelineService.getUSPTimeLine(context, limit, offset)
    }
}


const mutations = {
    createTimeline: async (_: any, { miniNewsId }: { miniNewsId: string }, context: any) => {
        await USPTimelineService.createTimeline(context, miniNewsId)
        return "created timeline with id " + miniNewsId + " successfully!";
    },
    deleteTimeline: async (_: any, { miniNewsId }: { miniNewsId: string }, context: any) => {
        await USPTimelineService.deleteTimeline(context, miniNewsId)
        return "deleted timeline with id " + miniNewsId + " successfully!";
    },
    deleteAllTimeline: async(_: any, __:any, context: any) => {
        await USPTimelineService.deleteAllTimeline(context)
        return "deleted all the timelines of the user!";
    }
}

export const resolvers = { queries, mutations }