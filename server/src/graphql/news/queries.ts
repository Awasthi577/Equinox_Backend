export const queries = `
    getSpecificNews(date: String!, category: String!, lim: Int, offset: Int): [MiniNews!]!
    getNews(query: String, lim: Int, offset: Int): [MiniNews!]!
    getNewsByCategory(query:String, category: String!, lim:Int, offset:Int): [MiniNews!]!
    getNewsOfSameParent(query:String, parentNewsId: String!, lim:Int, offset:Int): [MiniNews!]!
    getNewsById(miniNewsId: String!): MiniNews!
`