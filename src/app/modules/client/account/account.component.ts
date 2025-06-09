import { Component, inject, OnInit } from '@angular/core';
import { ISidenavRoute, SidenavComponent } from '../../shared/components/sidenav/sidenav.component'
import { RouterModule } from '@angular/router';
import { ClientHeaderComponent } from '../../shared/components/client-header/client-header.component';
import { ClientFooterComponent } from '../../shared/components/client-footer/client-footer.component';
import { StorageService } from '../../../core/auth/storage.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [SidenavComponent, RouterModule, ClientHeaderComponent, ClientFooterComponent],
  template: `
  <app-client-header ></app-client-header>
  <app-sidenav [routes]="routes" [useLogo]="false"></app-sidenav>
  <app-client-footer></app-client-footer>
  `,
})
export class AccountComponent implements OnInit {
  public storageService = inject(StorageService);
  private isLogged!: boolean;

  routes: ISidenavRoute[] = [
    { label: 'inicio', route: 'inicio', icon: 'tv' },
    // { label: 'ingressos', route: 'ingressos', icon: 'receipt_long' },
    // { label: 'favoritos', route: 'favoritos', icon: 'favorite' },
    // { label: 'meus pedidos', route: 'meus-pedidos', icon: 'person' },
    // { label: 'minha agenda', route: 'minha-agenda', icon: 'calendar_month' },
    { label: 'ajuda', route: 'ajuda', icon: 'help' }, 
  ];

  ngOnInit(): void {
    this.isLoggedIn();
  }

  isLoggedIn() {
    const token = this.storageService.getToken();

    if(token) {
      this.routes.push(
        { label: 'ingressos', route: 'ingressos', icon: 'receipt_long'},
        { label: 'favoritos', route: 'favoritos', icon: 'favorite'},
        { label: 'minha agenda', route: 'minha-agenda', icon: 'calendar_month'},
      )
    }
  }

}
