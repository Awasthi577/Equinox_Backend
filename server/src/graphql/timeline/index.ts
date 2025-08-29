import {query} from './query';
import {resolver} from './resolver';
import { typeDefs } from './typedefs'

export const timelineInfo = {
    queries: query,
    resolvers: resolver,
    typeDefs
};