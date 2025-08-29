import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config()
const PINECONE_INDEX_NAME = 'equinoxnews'
const PINECONE_NAMESPACE = 'news-namespace'


const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

if (!PINECONE_API_KEY) {
    console.error('Missing PINECONE_API_KEY in environment variables');
    process.exit(1);
}

const pc = new Pinecone({
    apiKey: PINECONE_API_KEY,
});

const indexExists = async (indexName: string) => {
    try {
        const indexes = await pc.listIndexes();
        if (!indexes || !indexes.indexes) return false;
        for (const index of indexes.indexes) {
            if (index.name === indexName) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error(`Error checking ${indexName} index existence:`, error);
        throw error;
    }
};


const init = async (index_name: string, namespace_name: string) => {
    try {

        const exists = await indexExists(index_name);
        console.log(`Index ${index_name} exists: ${exists}`);
        if (!exists) {
            console.log(`Creating index: ${index_name}`);
            await pc.createIndexForModel({
                name: index_name,
                cloud: 'aws',
                region: 'us-east-1',
                embed: {
                    model: 'llama-text-embed-v2',
                    fieldMap: { text: 'chunk_text' },
                },
                waitUntilReady: true,
            });
            console.log(`Index ${index_name} created successfully`);
        } else {
            console.log(`Index ${index_name} already exists`);
        }

        const finalIndex = pc.index(index_name).namespace(namespace_name);
        return finalIndex


    } catch (error) {
        console.error(`Failed to initialize Pinecone index ${index_name} :`, error);
        throw error;
    }
};


const indexPromise = init(PINECONE_INDEX_NAME, PINECONE_NAMESPACE);

export { indexPromise };