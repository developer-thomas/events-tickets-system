import { Routes } from '@angular/router';
import { AdminComponent } from './gerencial.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clientes', loadChildren: () => import('./pages/users/users.routes').then((m) => m.routes) },
      { path: 'local', loadChildren: () => import('./pages/location/location.routes').then((m) => m.routes) },
      { path: 'evento', loadChildren: () => import('./pages/event/event.routes').then((m) => m.routes) },
      { path: 'banners', loadChildren: () => import('./pages/banners/banners.routes').then((m) => m.routes) },
      { path: 'categorias', loadChildren: () => import('./pages/categories/categories.routes').then((m) => m.routes) },
      { path: 'ingressos', loadChildren: () => import('./pages/tickets/tickets.routes').then((m) => m.routes) },
      { path: 'cupons', loadChildren: () => import('./pages/coupons/coupons.routes').then((m) => m.routes) },
      { path: 'financeiro', loadChildren: () => import('./pages/financial/financial.routes').then((m) => m.routes) },
      { path: 'acessos', loadChildren: () => import('./pages/config/config.routes').then((m) => m.routes) },
    ],
  },
];
