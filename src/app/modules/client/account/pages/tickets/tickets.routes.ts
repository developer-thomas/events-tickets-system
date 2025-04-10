import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: ':id',
    component: DetailsComponent
  },
  
 
];
