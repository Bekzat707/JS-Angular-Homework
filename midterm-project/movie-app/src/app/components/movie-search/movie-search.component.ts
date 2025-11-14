import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MoviesService } from '../../services/movie.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, firstValueFrom } from 'rxjs';

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

  constructor(private moviesService: MoviesService) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => this.moviesService.getMovies(query)) // ✅ дұрыс қызмет шақыру
    ).subscribe((res: any[]) => {
      this.movies = res || [];
      this.filteredMovies = [...this.movies];
      this.loading = false;
      this.hasMore = this.movies.length >= 10;
    });

    this.fetchTopMovies();
  }

  async fetchTopMovies() {
    const popularTitles = ['Inception', 'Interstellar', 'Joker', 'The Dark Knight', 'Avatar'];
    const results = await Promise.all(
      popularTitles.map(title => firstValueFrom(this.moviesService.getMovies(title)))
    );
    this.topMovies = results.map(r => r[0]).filter(Boolean); // тек бірінші фильм
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
    this.moviesService.getMovies(term).subscribe((res: any[]) => {
      this.movies = res || [];
      this.filteredMovies = [...this.movies];
      this.hasMore = this.movies.length >= 10;
      this.loading = false;
    });
  }
}