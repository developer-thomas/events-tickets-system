import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
  // home admin
  {
    path: 'admin',
    loadChildren: () => import('./modules/home/home.routes').then(m => m.routes),
  },
  // Paneis Admin
  {
    path: 'gerencial',
    loadChildren: () => import('./modules/gerencial/gerencial.routes').then(m => m.routes),
  },
  {
    // home client
    path: '',
    loadChildren: () => import('./modules/client/client.routes').then(m => m.routes),
  }
];
