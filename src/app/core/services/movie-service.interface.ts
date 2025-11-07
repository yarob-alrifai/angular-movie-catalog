import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { Movie } from '../models/movie.model';

export interface MovieServiceInterface {
  getMovies(): Observable<Movie[]>;
  getMovieById(id: number): Observable<Movie | undefined>;
  searchMovies(query: string): Observable<Movie[]>;
}

export const MOVIE_SERVICE_INTERFACE = new InjectionToken<MovieServiceInterface>(
  'MOVIE_SERVICE_INTERFACE'
);
