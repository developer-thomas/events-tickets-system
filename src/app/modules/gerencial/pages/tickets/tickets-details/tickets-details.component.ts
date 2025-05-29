import { Component, inject, OnInit, signal } from '@angular/core';
import { EventDetailsComponent } from '../../event/pages/event-details/event-details.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { TicketQrCodesComponent } from './ticket-qr-codes/ticket-qr-codes.component';
import { ActivatedRoute } from '@angular/router';
import { TicketsService } from '../tickets.service';
import { GetOneTicket } from '../../event/models/GetEventById.interface';
import { TicketEventComponent } from './ticket-event/ticket-event.component';

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
    TicketEventComponent
  ],
  templateUrl: './tickets-details.component.html',
  styleUrl: './tickets-details.component.scss'
})
export class TicketsDetailsComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private ticketService = inject(TicketsService);

  public tickeData = signal<GetOneTicket | undefined>(undefined);

  public ticketId!: number;
  selectedTabIndex = 0

  constructor() {}

  ngOnInit(): void {
    const ticketId = this.activatedRoute.snapshot.paramMap.get('id');

    if(ticketId) {
      this.ticketId = parseInt(ticketId);
    }
    
    this.getTicketById();
  }

  getTicketById() {
    if(this.ticketId) {
      this.ticketService.getOneTicket(this.ticketId).subscribe({
        next: (res) => {
          console.log('ticket', res);
          this.tickeData.set(res);
        }
      })
    }
  }

  selectTab(index: number): void {
    this.selectedTabIndex = index
  }
}
