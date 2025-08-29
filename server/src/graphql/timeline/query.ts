export const query = `
    getTimeLine: JSON!
    getTimeLineOfYear(year: Int!): JSON!
    getTimeLineOfMonth(month: String!): JSON!
    getTimeLineOfDay(date: String!): JSON!
`
