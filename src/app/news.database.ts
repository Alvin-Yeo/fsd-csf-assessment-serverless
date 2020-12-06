import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ApiKey, Article, Country } from './model';

@Injectable()
export class NewsDatabase extends Dexie {

    private apiKey: Dexie.Table<ApiKey, string>;
    private country: Dexie.Table<Country, string>;
    private article: Dexie.Table<Article, string>;

    constructor() {
        super('NewsDatabase');

        this.version(1).stores({
            apiKey: 'id',
            country: 'cc',
            article: 'publishedAt, country'
        });

        this.apiKey = this.table('apiKey');
        this.country = this.table('country');
        this.article = this.table('article');
    }

    getApiKey(id: string): Promise<string> {
        return this.apiKey.get(id)
            .then(result => {
                if(!!result)
                    return result.apiKey;
                return '';
            });
    }

    saveApiKey(id: string, apiKey: string): Promise<any> {
        return this.apiKey.put({ id, apiKey });
    }

    deleteApiKey(id: string): Promise<any> {
        return this.apiKey.delete(id);
    }

    getCountryList(): Promise<Country[]> {
        return this.country.toArray();
    }

    saveCountryList(list: Country[]): Promise<any> {
        return this.country.bulkPut(list);
    }

    getCountry(country: string): Promise<Country> {
        return this.country.get(country);
    }

    getArticles(country: string): Promise<Article[]> {
        return this.article.where('country').equalsIgnoreCase(country).toArray();
    }

    saveArticles(list: Article[]): Promise<any> {
        return this.article.bulkPut(list);
    }

    deleteArticles(list: Article[]): Promise<any> {
        return this.article.bulkDelete(list.map(a => a.publishedAt));
    }
}