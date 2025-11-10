import { Component, computed, inject, ViewChild } from '@angular/core';

import { Movie } from '../../../core/models/movie.model';
import { MOVIE_SERVICE_INTERFACE } from '../../../core/services/movie-service.interface';
import { MoviesList } from './movies-list/movies-list';
import { MovieFilter } from './movie-filter/movie-filter';
import { CommonModule } from '@angular/common';
import { MovieDetails } from './movie-details/movie-details';

@Component({
  selector: 'app-movies',
  imports: [CommonModule, MovieFilter, MoviesList, MovieDetails],
  templateUrl: './movies.html',
  styleUrl: './movies.scss',
})
export class Movies {
  private readonly movieService = inject(MOVIE_SERVICE_INTERFACE);
  @ViewChild(MovieDetails) private readonly movieDetails?: MovieDetails;

  protected readonly isLoading = this.movieService.moviesLoading;
  protected readonly errorMessage = this.movieService.moviesErrorMessage;

  protected readonly movies = this.movieService.movies;

  protected readonly filteredMovies = computed(() => this.movies());

  retryLoadingMovies(): void {
    this.movieService.reloadMovies();
  }

  onSearch(query: string): void {
    this.movieService.searchMovies(query);
  }

  openMovieDetails(movie: Movie): void {
    this.movieDetails?.open(movie.id);
  }
}
