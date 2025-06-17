import { Routes } from '@angular/router';
import { AdminComponent } from './gerencial.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { permissionGuard } from '../../core/guards/permission.guard';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [permissionGuard],
        data: { permission: 'DASHBOARD' }
      },
      {
        path: 'clientes',
        loadChildren: () => import('./pages/users/users.routes').then((m) => m.routes),
        canActivate: [permissionGuard],
        data: { permission: 'USERS' }
      },
      {
        path: 'local',
        loadChildren: () => import('./pages/location/location.routes').then((m) => m.routes),
        canActivate: [permissionGuard],
        data: { permission: 'PLACES' }
      },
      {
        path: 'evento',
        loadChildren: () => import('./pages/event/event.routes').then((m) => m.routes),
        canActivate: [permissionGuard],
        data: { permission: 'EVENTS' }
      },
      {
        path: 'banners',
        loadChildren: () => import('./pages/banners/banners.routes').then((m) => m.routes),
        canActivate: [permissionGuard],
        data: { permission: 'BANNERS' }
      },
      {
        path: 'categorias',
        loadChildren: () => import('./pages/categories/categories.routes').then((m) => m.routes),
        canActivate: [permissionGuard],
        data: { permission: 'CATEGORIES' }
      },
      {
        path: 'ingressos',
        loadChildren: () => import('./pages/tickets/tickets.routes').then((m) => m.routes),
        canActivate: [permissionGuard],
        data: { permission: 'TICKETS' }
      },
      {
        path: 'cupons',
        loadChildren: () => import('./pages/coupons/coupons.routes').then((m) => m.routes),
        canActivate: [permissionGuard],
        data: { permission: 'CUPONS' }
      },
      {
        path: 'financeiro',
        loadChildren: () => import('./pages/financial/financial.routes').then((m) => m.routes),
        canActivate: [permissionGuard],
        data: { permission: 'FINANCIAL' }
      },
      {
        path: 'acessos',
        loadChildren: () => import('./pages/config/config.routes').then((m) => m.routes),
        canActivate: [permissionGuard],
        data: { permission: 'ACCESSES' }
      },
    ],
  },
];
