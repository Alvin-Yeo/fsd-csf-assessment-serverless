import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article, Country } from './model';
import { NewsDatabase } from './news.database';

@Injectable()
export class NewsService {

    private APIKEY_ID = 'newsapi.org';
    private COUNTRY_CODE_LIST = 'ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za'.replace(/ /g, ';');
    private CATEGORY = 'general';
    private PAGE_SIZE = '30';
    private ARTICLE_EXPIRY_DURATION = 5 * 60 * 1000;
    
    constructor(
        private db: NewsDatabase,
        private http: HttpClient
    ) {}

    getApiKey(): Promise<string> {
        return this.db.getApiKey(this.APIKEY_ID);
    }

    saveApiKey(apiKey: string): Promise<any> {
        return this.db.saveApiKey(this.APIKEY_ID, apiKey);
    }

    deleteApiKey(): Promise<any> {
        return this.db.deleteApiKey(this.APIKEY_ID);
    }

    async getCountryList(): Promise<Country[]> {
        let countryList = await this.db.getCountryList();

        if(countryList.length <= 0) {
            const url = 'https://restcountries.eu/rest/v2/alpha';
            const params = (new HttpParams()).set('codes', this.COUNTRY_CODE_LIST);

            const response = await this.http.get(url, { params }).toPromise() as any[];
        
            countryList = response.map(c => ({
                cc: c['alpha2Code'],
                name: c['name'],
                flag: c['flag']
            } as Country));
            
            console.info('Country list retrieved from Api successfully. Saving the list into database...');
            await this.db.saveCountryList(countryList);
            console.info('Country list saved in database successfully.');
        } 

        return countryList;
    }

    getCountry(country: string): Promise<Country> {
        return this.db.getCountry(country);
    }

    async getArticles(country: string): Promise<Article[]> {
        let articleList = await this.db.getArticles(country);

        if(articleList.length > 0) {
            const currentTimestamp = Date.now();
            const articleTimestamp = articleList[0].retrievedAt;
            
            if(currentTimestamp - articleTimestamp >= this.ARTICLE_EXPIRY_DURATION) {
                console.info('Articles have expired. Deleting articles from database...');
                this.db.deleteArticles(articleList);
                articleList.length = 0;
                console.info('Articles deleted from database successfully.');
            } else {
                console.info('Articles have not expired yet. Retrieving articles from database...');
            }
        }

        if(articleList.length <= 0) {
            const url = 'https://newsapi.org/v2/top-headlines';
            const params = (new HttpParams())
                .set('country', country)
                .set('category', this.CATEGORY)
                .set('pageSize', this.PAGE_SIZE);

            const apiKey = await this.getApiKey();
            const headers = (new HttpHeaders()).set('X-Api-Key', apiKey);

            console.info('Calling API to retrieve news articles...');
            const response = await this.http.get(url, { params, headers }).toPromise();
            
            const timestamp = Date.now();
            articleList = (response['articles'] as any[]).map(a => ({
                publishedAt: a['publishedAt'],
                country: country,
                saved: false,
                retrievedAt: timestamp,
                source: a['source']['name'],
                author: a['author'],
                title: a['title'],
                desc: a['description'],
                url: a['url'],
                imageURL: a['urlToImage'] ? a['urlToImage'] : 'assets/NoImagePlaceholder.jpg',
                content: a['content']
            } as Article));

            console.info('Articles retrieved from newsapi.org successfully. Saving the articles into database...');
            await this.db.saveArticles(articleList);
            console.info('Articles saved in database successfully.');
        }

        return articleList;
    }
}