export const tweetLimitFromEachSource = 10;
export const ytLimitFromEachSource = 15;
export const websiteLimitFromEachSource = 10;

export enum MatchType {
    UNRELATED = "unrelated",
    TIMELINE = "timeline",
    SAME_EVENT = "same-event"
}

export interface ResultJson {
    matchType: MatchType;
    id: string;
}

export interface newsDataForCategory {
    title: string;
    content: string;
}

export interface newsDataForAi {
    id: string;
    title: string;
    content: string;
    pubDate: string
}

export interface Article {
    category?: string;
    link: string;
    title: string;
    content?: string;
    source: string;
    pubDate: Date;
    imageUrl?: string;
    youtube?: boolean;
    views?: number;
    twitter?: boolean;
}
export const systemPromptForCategory = "You are a highly reliable and context-aware news classification model"
export const systemPrompt = "You are a highly capable news intelligence model. Your job is to identify and group semantically and contextually related news articles based on real-world event similarity. Only return raw JSON."

export const DELAY_MS = 10000;
export const SIMILARITY_THRESHOLD = 0.15;

export const websiteRssFeeds = [
    "https://www.thehindu.com/news/national/feeder/default.rss",
    "https://indianexpress.com/section/india/feed/",
    "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    'https://feeds.feedburner.com/ndtvnews-top-stories',
    "https://www.firstpost.com/commonfeeds/v1/mfp/rss/india.xml",
    "https://www.dnaindia.com/feeds/india.xml",
    "https://prod-qt-images.s3.amazonaws.com/production/thequint/feed.xml",
    "https://feeds.feedburner.com/ScrollinArticles.rss",
    "https://www.storifynews.com/feed/",
    "https://www.amarujala.com/rss/breaking-news.xml",
    "https://www.abcrnews.com/feed/",
    "https://www.dailyexcelsior.com/feed/",
    "https://www.indiavision.com/feed/",
    "https://www.opindia.com/feed/",
    "https://www.indiatvnews.com/rssnews/topstory.xml",
    "https://www.news18.com/commonfeeds/v1/eng/rss/india.xml"
];

export const websiteSourceMapForBetterName: Record<string, string> = {
    "Times of India": "Times of India",
    "India | The Indian Express": "The Indian Express",
    "India Latest News: Top National Headlines Today & Breaking News | The Hindu": "The Hindu",
    "NDTV News Search Records Found 1000": "NDTV",
    "Firstpost Latest News": "Firstpost",
    "The Quint": "The Quint",
    "India News": "DNA",
    "Scroll.in": "Scroll",
    "Storify News": "Storify",
    "Latest And Breaking Hindi News Headlines, News In Hindi | अमर उजाला हिंदी न्यूज़ | - Amar Ujala": "Amar Ujala",
    "AbcrNews": "AbcrNews",
    "The Times of Bengal": "The Times of Bengal",
    "Agra News, India News": "Agra News",
    "Northlines": "Northlines",
    "Chandigarh Metro": "Chandigarh Metro",
    "Telangana Today": "Telangana Today",
    "Daily Excelsior": "Daily Excelsior",
    "IndiaVision India News & Information": "IndiaVision",
    "OpIndia": "OpIndia",
    "Digpu News": "Digpu News",
    "Odisha News, Odisha Latest news, Odisha Daily – OrissaPOST": "OrissaPOST",
    "Vindhya First": "Vindhya First",
    "Techgenyz": "Techgenyz",
    "IndiaTV: Google News Feed": "IndiaTV",
    "India News in news18.com, India Latest News, India News": "News18"
};

export const ytChannelIdMap = {
    "BBC India": "UCF4QKhPMP1JybbkIJzIayww",
    "Aaj Tak": "UCt4t-jeY85JegMlZ-E5UWtA",
    "ABP News": "UCRWFSbif-RFENbBrSiez1DA",
    "India TV": "UCttspZesZIDEwwpVIgoZtWQ",
    "ZEE News": "UCIvaYmXn910QMdemBG3v1pQ",
    "News18 India": "UCPP3etACgdUWvizcES1dJ8Q",
    "The Lallantop": "UCx8Z14PpntdaxCt2hakbQLQ",
    "Jamuna TV Plus": "UCDj9HHrRUzlsTuPQN0PHxjw",
    "NDTV": "UCZFMm1mMw0F81Z37aaEzTUA",
    "The Hindu": "UC3njZ48-FDxLleBYaP0SZIg",
    "WION": "UC_gUM8rL-Lrg6O3adPW9K1g",
    "Al Jazeera English": "UCNye-wNBqNL5ZzHSJj3l8Bg",
    "DW News": "UCknLrEdhRCp1aegoMqRaCZg",
    "Reuters": "UChqUTb7kYRX8-EiaN3XFrSQ",
    "CNN": "UCupvZG-5ko_eiXAupbDfxWw",
    "Republic TV": "UCwqusr8YDwM‑3mEYTDeJHzw",
    "Firstpost": "UCz8QaiQxApLq8sLNcszYyJw",
    "The Quint": "UCSaf-7p3J_N-02p7jHzm5tA",
    "Scroll.in": "UCl8zB2LZOiLLV0jYUMpTEgA",
}

export const ytChannels = [
    "BBC India",
    "Aaj Tak",
    "ABP News",
    "India TV",
    "ZEE News",
    "News18 India",
    "The Lallantop",
    "Jamuna TV Plus",
    "NDTV",
    "The Hindu",
    "WION",
    "Al Jazeera English",
    "DW News",
    "Reuters",
    "CNN",
    "Republic TV",
    "Firstpost",
    "The Quint",
    "Scroll.in"
];

export const TwitterChannels = [
    "Republic_Bharat",
    "ndtv",
    "the_hindu",
    "WIONews",
    "JamunaTV",
    "storifynews",
    "CNNnews18",
    "AmarUjalaNews",
    "dna",
    "firstpost",
    "timesofindia",
    "IndianExpress",
    "aajtak",
    "bbc",
    "dwnews",
    "reuters",
    "cnn",
    "ABPNews",
    "IndiaTV",
    "ZeeNews",
    "News18India",
    "TheLallantop",
];

export const categoryNames = [
    "Sports",
    "Politics",
    "Government",
    "Business",
    "Health",
    "Science",
    "Technology",
    "Crime",
    "Entertainment",
    "Environment",
    "Education",
    "Military",
    "Religion",
    "Startup"
];


console.log("website rss feeds:", websiteRssFeeds.length);
console.log("youtube channels:", ytChannels.length);
console.log("twitter channels:", TwitterChannels.length);
