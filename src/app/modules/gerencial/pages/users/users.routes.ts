import { Routes } from '@angular/router';
import { ClientsDetailComponent } from './pages/clients-detail/clients-detail.component';
import { ClientsListComponent } from './pages/clients-list/clients-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ClientsListComponent,
  },
  {
    path: ':id',
    component: ClientsDetailComponent,
  },
];
