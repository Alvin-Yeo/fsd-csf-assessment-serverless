import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { CountryListComponent } from './components/country-list.component';
import { ApiSettingsComponent } from './components/api-settings.component';
import { NewsArticlesComponent } from './components/news-articles.component';
import { NewsDatabase } from './news.database';
import { NewsService } from './news.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const ROUTES: Routes = [
  { path: '', component: CountryListComponent },
  { path: 'api-settings', component: ApiSettingsComponent },
  { path: 'news-articles/:country', component: NewsArticlesComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    CountryListComponent,
    ApiSettingsComponent,
    NewsArticlesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    NewsDatabase,
    NewsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
