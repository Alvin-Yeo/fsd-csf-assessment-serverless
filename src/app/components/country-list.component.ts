import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Country } from '../model';
import { NewsService } from '../news.service';
import { BaseComponent } from './base.component';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent extends BaseComponent implements OnInit {

  private apiKey = '';
  
  countryList: Country[] = [];

  constructor(
    router: Router,
    private service: NewsService
  ) {
    super(router)
  }

  ngOnInit(): void {
    this.checkApiKey();
  }

  async checkApiKey() {
    this.apiKey = await this.service.getApiKey();

    if(this.apiKey) {
      console.info('Api key found. Retrieving country list...');
      this.countryList = await this.service.getCountryList();
      // console.log('Country list: ', this.countryList);
    } else {
      console.info('Api key not found. Redirecting to Api Key Settings page...');
      this.navigateToApiSettings();
    }
  }

  onSettings() {
    this.navigateToApiSettings();
  }
}
