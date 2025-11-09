import { Observable } from 'rxjs';

import { Movie } from '../models/movie.model';
import { InjectionToken, Signal } from '@angular/core';

export interface MovieServiceInterface {
  readonly movies: Signal<Movie[]>;
  readonly moviesLoading: Signal<boolean>;
  readonly moviesErrorMessage: Signal<string | null>;
  readonly movieDetails: Signal<Movie | undefined>;
  readonly movieDetailsLoading: Signal<boolean>;
  readonly movieDetailsErrorMessage: Signal<string | null>;
  searchMovies(query: string): void;
  selectMovie(id: number | null): void;
}

export const MOVIE_SERVICE_INTERFACE = new InjectionToken<MovieServiceInterface>(
  'MOVIE_SERVICE_INTERFACE'
);
