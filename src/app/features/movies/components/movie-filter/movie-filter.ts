import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-filter.html',
  styleUrl: './movie-filter.scss',
})
export class MovieFilter {
  private readonly querySignal = signal('');

  @Output() readonly search = new EventEmitter<string>();

  protected get query(): string {
    return this.querySignal();
  }

  protected set query(value: string) {
    this.querySignal.set(value);
    this.search.emit(value);
  }

  protected clear(): void {
    this.query = '';
  }
}
