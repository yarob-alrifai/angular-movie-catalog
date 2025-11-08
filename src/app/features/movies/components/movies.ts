import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { Movie } from '../../../core/models/movie.model';
import { MOVIE_SERVICE_INTERFACE } from '../../../core/services/movie-service.interface';
import { MoviesList } from './movies-list/movies-list';
import { MovieFilter } from './movie-filter/movie-filter';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies',
  imports: [CommonModule, MovieFilter, MoviesList],
  templateUrl: './movies.html',
  styleUrl: './movies.scss',
})
export class Movies {
  private readonly movieService = inject(MOVIE_SERVICE_INTERFACE);

  protected readonly searchTerm = signal('');
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly moviesQuery = toSignal(
    toObservable(this.searchTerm).pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading.set(true);
        this.errorMessage.set(null);
      }),
      switchMap((query) => {
        const trimmed = query.trim();

        const request$ = trimmed
          ? this.movieService.searchMovies(trimmed)
          : this.movieService.getMovies();

        return request$.pipe(
          catchError(() => {
            this.errorMessage.set('تعذّر تحميل قائمة الأفلام. حاول مجدداً لاحقاً.');
            return of<Movie[]>([]);
          })
        );
      }),
      tap(() => {
        this.isLoading.set(false);
      })
    ),
    { initialValue: [] as Movie[] }
  );

  protected readonly movies = computed(() => this.moviesQuery());

  protected readonly filteredMovies = computed(() => this.movies());

  protected readonly genres = computed(() => {
    const unique = new Set<string>();

    this.movies().forEach((movie) => unique.add(movie.genre));

    return Array.from(unique);
  });

  onSearch(query: string): void {
    this.searchTerm.set(query);
  }
}
