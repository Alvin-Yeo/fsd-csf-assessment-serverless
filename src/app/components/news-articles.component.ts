import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '../model';
import { NewsService } from '../news.service';
import { BaseComponent } from './base.component';

@Component({
  selector: 'app-news-articles',
  templateUrl: './news-articles.component.html',
  styleUrls: ['./news-articles.component.css']
})
export class NewsArticlesComponent extends BaseComponent implements OnInit {

  articleList: Article[] = [];
  countryName = '';

  constructor(
    router: Router,
    private activatedRoute: ActivatedRoute,
    private service: NewsService
  ) {
    super(router);
  }

  ngOnInit(): void {
    const cc = this.activatedRoute.snapshot.params['country'];
    this.getArticles(cc);
    this.getCountryName(cc);
  }

  async getArticles(country: string) {
    this.articleList = await this.service.getArticles(country);
  }
  
  async getCountryName(country: string) {
    this.countryName = (await this.service.getCountry(country)).name;
  }

}
