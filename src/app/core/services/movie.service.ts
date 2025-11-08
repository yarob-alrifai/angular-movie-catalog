import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { createMovie, Movie, MovieInput } from '../models/movie.model';
import { MovieServiceInterface } from './movie-service.interface';

@Injectable()
export class MovieService implements MovieServiceInterface {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/movies';

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<MovieInput[]>(this.baseUrl)
      .pipe(map((movies) => movies.map((movie) => createMovie(movie))));
  }

  getMovieById(id: number): Observable<Movie | undefined> {
    return this.http.get<MovieInput>(`${this.baseUrl}/${id}`).pipe(
      map((movie) => createMovie(movie)),
      catchError(() => of(undefined))
    );
  }

  searchMovies(query: string): Observable<Movie[]> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return this.getMovies();
    }
    // debugger;

    return this.http
      .get<MovieInput[]>(this.baseUrl)
      .pipe(
        map((movies) =>
          movies
            .filter((movie) => movie.title?.toLowerCase().includes(trimmedQuery.toLowerCase()))
            .map((movie) => createMovie(movie))
        )
      );
  }
}
