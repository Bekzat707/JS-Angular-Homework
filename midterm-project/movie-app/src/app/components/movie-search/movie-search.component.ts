import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {
  query = '';
  category = 'All';
  movies: any[] = [];
  filteredMovies: any[] = [];
  topMovies: any[] = [];
  page = 1;
  hasMore = false;
  loading = false;

  searchSubject = new Subject<string>();

  categories = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance'];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => this.movieService.searchMovies(query, 1))
    ).subscribe((res: any) => {
      this.movies = res.Search || [];
      this.filteredMovies = [...this.movies];
      this.hasMore = !!res.totalResults && this.page * 10 < +res.totalResults;
      this.loading = false;
    });

    this.fetchTopMovies();
  }

  fetchTopMovies() {
    const popularTitles = ['Inception', 'Interstellar', 'Joker', 'The Dark Knight', 'Avatar'];
    Promise.all(popularTitles.map(title => this.movieService.searchMovies(title, 1).toPromise()))
      .then(results => {
        this.topMovies = results
          .map(r => r?.Search?.[0])
          .filter(Boolean);
      });
  }

  search() {
    if (!this.query.trim()) return;
    this.loading = true;
    this.page = 1;
    this.searchSubject.next(this.query);
  }

  selectCategory(cat: string) {
    this.category = cat;
    this.page = 1;
    this.loading = true;

    if (cat === 'All') {
      this.fetchMovies(this.query);
    } else {
      this.fetchMovies(cat);
    }
  }

  filterClient(term: string) {
    const lower = term.toLowerCase();
    this.filteredMovies = this.movies.filter(m =>
      (m.Title + m.Year).toLowerCase().includes(lower)
    );
  }

  nextPage() {
    if (!this.hasMore) return;
    this.page++;
    this.fetchMovies(this.query);
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchMovies(this.query);
    }
  }

  fetchMovies(term: string) {
    this.loading = true;
    this.movieService.searchMovies(term, this.page).subscribe((res: any) => {
      this.movies = res.Search || [];
      this.filteredMovies = [...this.movies];
      this.hasMore = !!res.totalResults && this.page * 10 < +res.totalResults;
      this.loading = false;
    });
  }
}