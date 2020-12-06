import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewsService } from '../news.service';
import { BaseComponent } from './base.component';

@Component({
  selector: 'app-api-settings',
  templateUrl: './api-settings.component.html',
  styleUrls: ['./api-settings.component.css']
})
export class ApiSettingsComponent extends BaseComponent implements OnInit {

  form: FormGroup;

  constructor(
    router: Router,
    private fb: FormBuilder,
    private service: NewsService
  ) {
    super(router);
  }

  ngOnInit(): void {
    this.createFormGroup();
    this.checkApiKey();
  }

  get apiKey(): string { 
    return this.form.get('apiKey').value 
  }

  createFormGroup(apiKey = '') {
    this.form = this.fb.group({
      apiKey: this.fb.control(apiKey, [ Validators.required ])
    });
  }

  async checkApiKey() {
    const result = await this.service.getApiKey();

    if(result) {
      this.createFormGroup(result);
      console.info('Api key retrieved from database successfully.');
    }

    return;
  }

  onBack() {
    this.navigateToCountryList();
  }

  async onDelete() {
    await this.service.deleteApiKey();
    console.info('Api key removed from database successfully.');
    this.navigateToCountryList();
  }

  async onAdd() {
    await this.service.saveApiKey(this.apiKey);
    console.info('Api key saved in database successfully.');
    this.navigateToCountryList();
  }

}
