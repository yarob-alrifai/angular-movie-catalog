import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { createMovie, Movie, MovieInput } from '../models/movie.model';
import { MovieServiceInterface } from './movie-service.interface';

@Injectable()
export class MovieService implements MovieServiceInterface {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/movies';

  private readonly searchQuery = signal('');
  private readonly selectedMovieId = signal<number | null>(null);

  readonly moviesLoading = signal(true);
  readonly moviesErrorMessage = signal<string | null>(null);
  readonly movieDetailsLoading = signal(false);
  readonly movieDetailsErrorMessage = signal<string | null>(null);

  private readonly movieListErrorMessageText =
    'Unable to load the movie list. Please try again later.';
  private readonly movieDetailsErrorMessageText =
    'Unable to load movie details. Please try again later.';
  private readonly movieNotFoundMessageText = 'Movie not found.';

  readonly movies = toSignal(
    toObservable(this.searchQuery).pipe(
      debounceTime(200),
      map((query) => query.trim()),
      distinctUntilChanged(),
      tap(() => {
        this.moviesLoading.set(true);
        this.moviesErrorMessage.set(null);
      }),
      switchMap((query) =>
        this.http.get<MovieInput[]>(this.baseUrl).pipe(
          map((movies) => {
            const normalizedQuery = query.toLowerCase();

            return movies
              .filter((movie) => {
                if (!normalizedQuery) {
                  return true;
                }

                const title = movie.title ?? '';
                // debugger;
                return title.toLowerCase().includes(normalizedQuery);
              })
              .map((movie) => createMovie(movie));
          }),
          catchError(() => {
            this.moviesErrorMessage.set(this.movieListErrorMessageText);

            return of<Movie[]>([]);
          }),
          finalize(() => this.moviesLoading.set(false))
        )
      )
    ),
    { initialValue: [] as Movie[] }
  );

  readonly movieDetails = toSignal(
    toObservable(this.selectedMovieId).pipe(
      distinctUntilChanged(),
      switchMap((id) => {
        if (id === null) {
          this.movieDetailsLoading.set(false);
          this.movieDetailsErrorMessage.set(null);
          return of<Movie | undefined>(undefined);
        }

        this.movieDetailsLoading.set(true);
        this.movieDetailsErrorMessage.set(null);
        // debugger;
        return this.http.get<MovieInput>(`${this.baseUrl}/${id}`).pipe(
          map((movie) => createMovie(movie)),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.movieDetailsErrorMessage.set(this.movieNotFoundMessageText);
            } else {
              this.movieDetailsErrorMessage.set(this.movieDetailsErrorMessageText);
            }

            return of<Movie | undefined>(undefined);
          }),
          finalize(() => this.movieDetailsLoading.set(false))
        );
      })
    ),
    { initialValue: undefined as Movie | undefined }
  );

  searchMovies(query: string): void {
    this.searchQuery.set(query);
  }

  selectMovie(id: number | null): void {
    this.selectedMovieId.set(id);
  }
}
