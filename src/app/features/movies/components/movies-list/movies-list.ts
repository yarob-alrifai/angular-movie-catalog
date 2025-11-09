import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../../../../core/models/movie.model';
import { MovieItem } from '../movie-item/movie-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies-list',
  imports: [CommonModule, MovieItem],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.scss',
})
export class MoviesList {
  @Input() movies: Movie[] = [];
  @Output() viewDetails = new EventEmitter<Movie>();
}
