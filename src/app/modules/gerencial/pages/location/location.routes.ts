import { Routes } from '@angular/router';
import { LocationListComponent } from './pages/location-list/location-list.component';
import { LocationDetailsComponent } from './pages/location-details/location-details.component';
import { NewEventComponent } from './pages/new-event/new-event.component';

export const routes: Routes = [
  {
    path: '',
    component: LocationListComponent,
  },
  {
    path: 'cadastrar',
    component: NewEventComponent
  },
  {
    path: ':id',
    component: LocationDetailsComponent
  }
  
  
];
