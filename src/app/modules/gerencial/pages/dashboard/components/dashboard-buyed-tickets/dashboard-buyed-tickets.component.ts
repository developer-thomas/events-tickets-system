import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-buyed-tickets',
  standalone: true,
  templateUrl: './dashboard-buyed-tickets.component.html',
  styleUrl: './dashboard-buyed-tickets.component.scss',
  imports: [
    MatCardModule,
    MatIconModule,
  ],
})
export class DashboardBuyedTicketsComponent {

}
