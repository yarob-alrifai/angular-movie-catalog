import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MovieService } from './core/services/movie.service';
import { MOVIE_SERVICE_INTERFACE } from './core/services/movie-service.interface';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    MovieService,
    { provide: MOVIE_SERVICE_INTERFACE, useExisting: MovieService },
  ],
};
