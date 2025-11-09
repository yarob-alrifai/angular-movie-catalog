import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'app-movie-filter',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-filter.html',
  styleUrl: './movie-filter.scss',
})
export class MovieFilter {
  private readonly querySignal = signal('');
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  @Output() readonly search = new EventEmitter<string>();

  protected readonly searchForm = this.formBuilder.nonNullable.group({
    query: this.querySignal(),
  });

  constructor() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged((previous, current) => previous.query === current.query),
        tap(({ query }) => {
          this.emitQuery(query ?? '');
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected get query(): string {
    return this.querySignal();
  }

  protected onSearch(): void {
    this.emitQuery(this.searchForm.value.query ?? '', true);
  }

  protected clear(): void {
    this.searchForm.setValue({ query: '' });
  }

  private emitQuery(next: string, force = false): void {
    const nextValue = next ?? '';
    const trimmedNext = nextValue.trim();

    const currentValue = this.querySignal();

    if (!force && !trimmedNext && !currentValue.trim()) {
      return;
    }

    this.querySignal.set(nextValue);

    if (force || nextValue !== currentValue) {
      this.search.emit(nextValue);
    }
  }
}
