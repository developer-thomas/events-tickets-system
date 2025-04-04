import { Routes } from '@angular/router';
import { TicketsDetailsComponent } from './tickets-details/tickets-details.component';
import { TicketsListComponent } from './tickets-list/tickets-list.component';

export const routes: Routes = [
  {
    path: '',
    component: TicketsListComponent,
  },
  {
    path: ':id',
    component: TicketsDetailsComponent
  }
];
