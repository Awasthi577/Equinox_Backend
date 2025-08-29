import { PubSub } from "graphql-subscriptions";
const pubsub = new PubSub();

export const NEWLY_ADDED_NEWS = 'newly_added_news';

const Subscription = {
    newlyAddedNews: {
        subscribe: (_: any, __: any) => {
            return pubsub.asyncIterableIterator(NEWLY_ADDED_NEWS);
        }
    }
}

const mutation = {
    notifyAddedNews: () => {
        pubsub.publish(NEWLY_ADDED_NEWS, {
            newlyAddedNews: "We have more news added to our website, check it out!"
        })
        return "notifed client successfully"
    }
}

export const resolvers = { Subscription, mutation }