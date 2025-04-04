import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';

export const routes: Routes = [
  {
    path: '',
    component: CategoriesListComponent,
  },
  
];
