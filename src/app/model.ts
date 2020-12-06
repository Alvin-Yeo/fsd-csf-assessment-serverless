export interface ApiKey {
    id: string;
    apiKey: string;
}

export interface Country {
    cc: string;
    name: string;
    flag: string;
}

export interface Article {
    publishedAt: string;
    country: string;
    saved: Boolean;
    retrievedAt: number;
    source: string;
    author: string;
    title: string;
    desc: string;
    url: string;
    imageURL: string;
    content: string;
}