import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { ClientFooterComponent } from '../client-footer/client-footer.component';

export interface ISidenavRoute {
  label: string;
  route: string;
  icon: string;
  permission?: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  imports: [
    RouterModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    CommonModule,
    ClientHeaderComponent,
    ClientFooterComponent
  ],
})
export class SidenavComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);

  @Input() routes: ISidenavRoute[] = [];
  @Input() useLogo: boolean = true;

  // Custom breakpoint para 599px
  isMobile$ = this.breakpointObserver.observe('(max-width: 640px)').pipe(
    map(result => result.matches),
    shareReplay(),
  );

  logout() {
    this.router.navigate(['/']);
  }
}
