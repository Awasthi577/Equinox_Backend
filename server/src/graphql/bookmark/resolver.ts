import { BookmarkService } from "../../services/bookmark"

const queries = {
    getBookmarks: async (_: any, { limit, offset }: { limit: number, offset: number }, context: any) => {
        return await BookmarkService.getBookmarks(context, limit, offset)
    }
}


const mutations = {
    createBookmark: async (_: any, { miniNewsId }: { miniNewsId: string }, context: any) => {
        await BookmarkService.createBookmarks(context, miniNewsId)
        return "created bookmark with id " + miniNewsId + " successfully!";
    },
    deleteBookmark: async (_: any, { miniNewsId }: { miniNewsId: string }, context: any) => {
        await BookmarkService.deleteBookmark(context, miniNewsId)
        return "deleted bookmark with id " + miniNewsId + " successfully!";
    },
    deleteAllBookmarks: async(_: any, __:any, context: any) => {
        await BookmarkService.deleteAllBookmarks(context)
        return "deleted all the bookmarks of the user!";
    }
}

export const resolvers = { queries, mutations }