export const typedefs = `#news
    type MiniNews {
        id: ID!
        links: [String!]!
        title: String!
        content: String
        pubDate: String
        sources: [String!]!
        imageUrl: String
        newsId: String!
        category: String
        isBookmarked: Boolean
        score: Float!
        youtube: Boolean
        ytViews: Int
    }

    type News {
        childNews: [MiniNews!]!
        id: ID!
    }
`

