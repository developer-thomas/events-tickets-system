import { Component } from '@angular/core';
import { ISidenavRoute, SidenavComponent } from '../shared/components/sidenav/sidenav.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: '<app-sidenav [routes]="routes"></app-sidenav>',
  imports: [
    SidenavComponent,
  ],
})
export class AdminComponent {
  routes: ISidenavRoute[] = [
    { label: 'dashboard', route: 'dashboard', icon: 'tv' },
    { label: 'usuários', route: 'clientes', icon: 'group' },
    { label: 'local', route: 'local', icon: 'apartment' },
    { label: 'evento', route: 'evento', icon: 'local_activity' },
    // { label: 'banners', route: 'banners', icon: 'ad_units' },
    { label: 'categorias', route: 'categorias', icon: 'toc' },
    { label: 'ingressos', route: 'ingressos', icon: 'receipt_long' },
    // { label: 'cupons', route: 'cupons', icon: 'article' },
    { label: 'financeiro', route: 'financeiro', icon: 'signal_cellular_alt' },
    { label: 'acessos', route: 'acessos', icon: 'settings' },
  ];
}
