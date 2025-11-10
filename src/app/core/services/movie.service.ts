import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  defer,
  shareReplay,
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

  private readonly movieDetailsCache = new Map<number, Movie>();

  private readonly moviesResponse$ = defer(() => {
    this.moviesLoading.set(true);
    this.moviesErrorMessage.set(null);

    return this.http.get<MovieInput[]>(this.baseUrl).pipe(
      map((movies) => movies.map((movie) => createMovie(movie))),
      catchError(() => {
        this.moviesErrorMessage.set(this.movieListErrorMessageText);

        return of<Movie[]>([]);
      }),

      finalize(() => this.moviesLoading.set(false))
    );
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly allMovies = toSignal(this.moviesResponse$, {
    initialValue: [] as Movie[],
  });

  readonly movies = computed(() => {
    const normalizedQuery = this.searchQuery().trim().toLowerCase();
    const movies = this.allMovies();

    if (!normalizedQuery) {
      return movies;
    }

    return movies.filter((movie) => movie.title.toLowerCase().includes(normalizedQuery));
  });

  readonly movieDetails = toSignal(
    toObservable(this.selectedMovieId).pipe(
      distinctUntilChanged(),
      switchMap((id) => {
        if (id === null) {
          this.movieDetailsLoading.set(false);
          this.movieDetailsErrorMessage.set(null);
          return of<Movie | undefined>(undefined);
        }

        const cachedMovie = this.movieDetailsCache.get(id);
        if (cachedMovie) {
          this.movieDetailsLoading.set(false);
          this.movieDetailsErrorMessage.set(null);
          return of<Movie | undefined>(cachedMovie);
        }

        this.movieDetailsLoading.set(true);
        this.movieDetailsErrorMessage.set(null);
        // debugger;
        return this.http.get<MovieInput>(`${this.baseUrl}/${id}`).pipe(
          map((movie) => createMovie(movie)),
          tap((movie) => this.movieDetailsCache.set(id, movie)),

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
