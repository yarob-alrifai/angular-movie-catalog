import { Component } from '@angular/core';
import { Movies } from './features/movies/components/movies';

@Component({
  selector: 'app-root',
  imports: [Movies],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
