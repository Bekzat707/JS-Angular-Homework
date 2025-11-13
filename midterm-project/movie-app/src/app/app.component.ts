import { Component } from '@angular/core';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MovieSearchComponent],
  template: `<app-movie-search></app-movie-search>`,
})
export class AppComponent {}