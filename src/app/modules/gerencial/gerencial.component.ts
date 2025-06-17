import { Component, inject, OnInit } from '@angular/core';
import { ISidenavRoute, SidenavComponent } from '../shared/components/sidenav/sidenav.component';
import { UserService } from '../../core/auth/user.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: '<app-sidenav [routes]="routes"></app-sidenav>',
  imports: [
    SidenavComponent,
  ],
})
export class AdminComponent implements OnInit {
  private userService = inject(UserService);
   
  ngOnInit(): void {
    const permissions = this.userService.getPermissions(); 
    this.routes = this.allRoutes.filter(route => 
      !route.permission || permissions.includes(route.permission)
    );
  }

  allRoutes: ISidenavRoute[] = [
    { label: 'dashboard', route: 'dashboard', icon: 'tv', permission: 'DASHBOARD' },
    { label: 'usuários', route: 'clientes', icon: 'group', permission: 'USERS' },
    { label: 'local', route: 'local', icon: 'apartment', permission: 'PLACES' },
    { label: 'evento', route: 'evento', icon: 'local_activity', permission: 'EVENTS' },
    { label: 'categorias', route: 'categorias', icon: 'toc', permission: 'CATEGORIES' },
    { label: 'ingressos', route: 'ingressos', icon: 'receipt_long', permission: 'TICKETS' },
    { label: 'financeiro', route: 'financeiro', icon: 'signal_cellular_alt', permission: 'FINANCIAL' },
    { label: 'acessos', route: 'acessos', icon: 'settings', permission: 'ACCESSES' }
  ];

  routes: ISidenavRoute[] = [];
}
