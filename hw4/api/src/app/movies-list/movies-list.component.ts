import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})
export class MoviesListComponent {
  movies: any[] = [];
  isLoaded = false;

  constructor(private moviesService: MoviesService) {}

  loadMovies() {
    this.moviesService.getMovies().subscribe(data => {
      this.movies = data;
      this.isLoaded = true;
    });
  }
}