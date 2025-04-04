import { Routes } from '@angular/router';
import { BannersListComponent } from './banners-list/banners-list.component';
import { NewBannerComponent } from './new-banner/new-banner.component';


export const routes: Routes = [
  {
    path: '',
    component: BannersListComponent,
  },
  {
    path: 'cadastrar',
    component: NewBannerComponent,
  },
];
