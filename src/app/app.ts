import { Component, HostBinding } from '@angular/core';
// import { Movies } from './features/movies/components/movies';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @HostBinding('class.light-theme')
  protected isLightTheme = false;

  toggleTheme(): void {
    this.isLightTheme = !this.isLightTheme;
  }

  get themeToggleLabel(): string {
    return this.isLightTheme ? 'Switch to dark mode' : 'Switch to light mode';
  }
}
