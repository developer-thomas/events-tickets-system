import { Component } from '@angular/core';
import { EventDetailsComponent } from '../../event/pages/event-details/event-details.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { TicketQrCodesComponent } from './ticket-qr-codes/ticket-qr-codes.component';

interface TicketDetails {
  id: number
  title: string
  date: string
  time: string
  quantity: number
  status: string
  price: string
}

@Component({
  selector: 'app-tickets-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    PageHeaderComponent,
    TicketQrCodesComponent,
    EventDetailsComponent,
  ],
  templateUrl: './tickets-details.component.html',
  styleUrl: './tickets-details.component.scss'
})
export class TicketsDetailsComponent {
  selectedTabIndex = 0

  ticketDetails: TicketDetails = {
    id: 1,
    title: "Título do evento",
    date: "00/00/00",
    time: "00:00",
    quantity: 5,
    status: "Em aberto",
    price: "R$ 00,00",
  }

  constructor() {}

  ngOnInit(): void {}

  selectTab(index: number): void {
    this.selectedTabIndex = index
  }
}
