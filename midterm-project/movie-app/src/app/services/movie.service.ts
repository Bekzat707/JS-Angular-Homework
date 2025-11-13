import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = 'https://www.omdbapi.com/?apikey=561db8c0&type=movie';

  constructor(private http: HttpClient) {}

  searchMovies(query: string, page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}&s=${query}&page=${page}`);
  }
}