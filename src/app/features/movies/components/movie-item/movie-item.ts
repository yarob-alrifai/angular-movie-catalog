import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../../../../core/models/movie.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-item',
  imports: [CommonModule, DecimalPipe, RouterLink],
  templateUrl: './movie-item.html',
  styleUrl: './movie-item.scss',
})
export class MovieItem {
  @Input({ required: true }) movie!: Movie;
  @Output() viewDetails = new EventEmitter<Movie>();

  onViewDetails(): void {
    this.viewDetails.emit(this.movie);
  }
}
