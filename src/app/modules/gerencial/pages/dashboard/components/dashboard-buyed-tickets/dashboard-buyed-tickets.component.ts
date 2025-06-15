import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TicketsSold } from '../../models/Dashboard.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-buyed-tickets',
  standalone: true,
  templateUrl: './dashboard-buyed-tickets.component.html',
  styleUrl: './dashboard-buyed-tickets.component.scss',
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule
  ],
})
export class DashboardBuyedTicketsComponent {

  @Input({required: true}) boughtTickets!: TicketsSold;
}
