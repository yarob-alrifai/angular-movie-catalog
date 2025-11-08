import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-movie-item',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './movie-item.html',
  styleUrl: './movie-item.scss',
})
export class MovieItem {
  @Input({ required: true }) movie!: Movie;
}
