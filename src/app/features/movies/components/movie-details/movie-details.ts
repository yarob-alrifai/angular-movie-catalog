import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';

import { Movie } from '../../../../core/models/movie.model';
import { MOVIE_SERVICE_INTERFACE } from '../../../../core/services/movie-service.interface';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
  host: {
    '[class.open]': 'isOpen()',
  },
})
export class MovieDetails {
  private readonly movieService = inject(MOVIE_SERVICE_INTERFACE);

  protected readonly isOpen = signal(false);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly selectedMovieId = signal<number | null>(null);

  private readonly movieQuery = toSignal(
    toObservable(this.selectedMovieId).pipe(
      switchMap((id) => {
        if (!id) {
          this.isLoading.set(false);
          this.errorMessage.set(null);
          return of<Movie | undefined>(undefined);
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);

        return this.movieService.getMovieById(id).pipe(
          tap((movie) => {
            if (!movie) {
              this.errorMessage.set('Movie not found.');
            }
          }),
          catchError(() => {
            this.errorMessage.set('Unable to load movie details. Please try again later.');
            return of<Movie | undefined>(undefined);
          }),
          finalize(() => this.isLoading.set(false))
        );
      })
    ),
    { initialValue: undefined as Movie | undefined }
  );

  protected readonly movie = computed(() => this.movieQuery());

  open(movieId: number): void {
    this.selectedMovieId.set(movieId);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.selectedMovieId.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }
}
