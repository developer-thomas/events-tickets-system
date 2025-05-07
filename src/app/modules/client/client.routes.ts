import { Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { SigninComponent } from './home/signin/signin.component';
import { ForgotPasswordComponent } from './home/forgot-password/forgot-password.component';
import { SignUpComponent } from './home/sign-up/sign-up.component';
import { AboutComponent } from './common-pages/about/about.component';
import { UseTermsComponent } from './common-pages/use-terms/use-terms.component';
import { PrivacyPolicyComponent } from './common-pages/privacy-policy/privacy-policy.component';
import { CommonPagesComponent } from './common-pages/common-pages.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'client',
    pathMatch: 'full'
  },  
  {
      path: 'login',
      component: ClientComponent,
      children: [
        { path: '', component: SigninComponent },
        { path: 'forgot-password', component: ForgotPasswordComponent },
      ],
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'client',
    loadChildren: () => import('./account/account.routes').then(m => m.routes),
  },
  {
    path: 'common',
    component: CommonPagesComponent,
    children: [
      {
        path: 'sobre',
        component: AboutComponent
      },
      {
        path: 'termos-de-uso',
        component: UseTermsComponent
      },
      {
        path: 'politica-de-privacidade',
        component: PrivacyPolicyComponent
      },
    ]
  },
];
