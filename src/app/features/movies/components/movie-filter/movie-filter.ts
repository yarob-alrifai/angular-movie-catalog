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

  protected onQueryChange(value: string | Event): void {
    const nextValue = this.getValueFromEvent(value);
    const currentValue = this.querySignal();

    if (!nextValue.trim() && !currentValue.trim()) {
      return;
    }

    this.querySignal.set(nextValue);
    this.search.emit(nextValue);
  }

  protected clear(): void {
    this.onQueryChange('');
  }

  private getValueFromEvent(value: string | Event): string {
    if (typeof value === 'string') {
      return value;
    }

    const target = value.target as HTMLInputElement | null;
    return target?.value ?? '';
  }
}
