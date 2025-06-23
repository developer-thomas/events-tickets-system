import { Routes } from '@angular/router';
import { EventListComponent } from './pages/event-list/event-list.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { NewEventComponent } from './pages/new-event/new-event.component';
import { EventEditComponent } from './pages/event-edit/event-edit.component';

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
  },
  {
    path: 'editar/:id',
    component: EventEditComponent
  }
  
];
