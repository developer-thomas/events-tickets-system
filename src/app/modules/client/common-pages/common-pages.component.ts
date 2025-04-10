import { Component } from '@angular/core';
import { ClientHeaderComponent } from '../../shared/components/client-header/client-header.component';
import { ClientFooterComponent } from '../../shared/components/client-footer/client-footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-common-pages',
  standalone: true,
  imports: [ClientHeaderComponent, ClientFooterComponent, RouterModule],
  template: `
    <app-client-header></app-client-header>
    <router-outlet></router-outlet>
    <app-client-footer></app-client-footer>
  `,
})
export class CommonPagesComponent {

}
