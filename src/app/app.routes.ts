import { Routes } from '@angular/router';
import { ConfirmEmailCodeComponent } from './modules/confirm-email-code/confirm-email-code.component';

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
  },
  {
    path: 'confirm',
    loadChildren: () => import('./modules/confirm-email-code/confirm-email-code.routes').then(m => m.routes)
  }
];
