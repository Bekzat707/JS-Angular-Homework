import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private apiKey = 'd222a276'; // OMDb API key
  private apiUrl = `https://www.omdbapi.com/?apikey=${this.apiKey}`;

  constructor(private http: HttpClient) {}

  getMovies(query: string = 'batman'): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}&s=${query}`).pipe(
      map(res => res.Search || [])
    );
  }

  getMovieById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}&i=${id}&plot=full`);
  }
}