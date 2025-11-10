import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/movies/components/movies').then((m) => m.Movies),
  },

  {
    path: '**',
    redirectTo: '',
  },
];
