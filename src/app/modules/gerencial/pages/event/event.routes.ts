import { Routes } from '@angular/router';
import { EventListComponent } from './pages/event-list/event-list.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { NewEventComponent } from './pages/new-event/new-event.component';

export const routes: Routes = [
  {
    path: '',
    component: EventListComponent,
  },
  {
    path: 'cadastrar',
    component: NewEventComponent
  },
  {
    path: ':id',
    component: EventDetailsComponent
  }
  
];
