import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
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

  protected readonly isLoading = this.movieService.movieDetailsLoading;
  protected readonly errorMessage = this.movieService.movieDetailsErrorMessage;
  protected readonly movie = this.movieService.movieDetails;

  open(movieId: number): void {
    this.movieService.selectMovie(movieId);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.movieService.selectMovie(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }
}
