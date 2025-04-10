import { AccountComponent } from './account.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio'},
      { path: 'inicio', loadChildren: () => import('./pages/account-home/account-home.routes').then(m => m.routes) },
      { path: 'ingressos', loadChildren: () => import('./pages/tickets/tickets.routes').then(m => m.routes) },
      { path: 'minha-agenda', loadChildren: () => import('./pages/schedule/schedule.routes').then(m => m.routes) },
      { path: 'favoritos', loadChildren: () => import('./pages/favorites/favorites.routes').then(m => m.routes) },
      { path: 'ajuda', loadChildren: () => import('./pages/help/help.routes').then(m => m.routes) },
      { path: 'meus-dados', loadChildren: () => import('./pages/user-data/user-data.routes').then(m => m.routes) },
    ]
  },
  
];