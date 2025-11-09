import { Routes } from '@angular/router';

import { Movies } from './features/movies/components/movies';

export const routes: Routes = [
  {
    path: '',
    component: Movies,
  },

  {
    path: '**',
    redirectTo: '',
  },
];
