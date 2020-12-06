import { Router } from '@angular/router';

export class BaseComponent {

    constructor(
        private router: Router
    ) {}

    navigate(path: string[]) {
        this.router.navigate(path);
    }

    navigateToCountryList() {
        this.navigate(['/']);
    }

    navigateToApiSettings() {
        this.navigate(['/', 'api-settings']);
    }

    navigateToNewsArticles(country: string) {
        this.navigate(['/', 'news-articles', country]);
    }
}