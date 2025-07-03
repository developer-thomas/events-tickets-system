import { Routes } from '@angular/router';
import { SucessComponent } from './sucess/sucess.component';
import { ErrorComponent } from './error/error.component';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import { ConfirmEmailCodeComponent } from './confirm-email-code.component';

export const routes: Routes = [
  {
    path: 'sucess',
    component: SucessComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: ':code',
    component: ConfirmEmailCodeComponent
  },
];
