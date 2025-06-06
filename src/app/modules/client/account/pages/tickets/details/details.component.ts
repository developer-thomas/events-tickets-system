import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketsService } from '../tickets.service';
import { EventViewComponent } from './tabs/event-view/event-view.component';
import { QrCodesViewComponent } from './tabs/qr-codes-view/qr-codes-view.component';
import { GetTicketByIdResponse } from '../models/GetTicketById.interface';

interface Ticket {
  id: number
  title: string
  date: string
  time: string
  quantity: number
  status: string
  price: string
  qrCodes: {
    id: number
    label: string
    code: string
    status: string
  }[]
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    QrCodesViewComponent,
    EventViewComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketsService = inject(TicketsService);

  ticketId: string | null = null;

  selectedTabIndex = 0

  ticketData = signal<GetTicketByIdResponse | null>(null);

  ticket: Ticket = {
    id: 1,
    title: "Título do evento",
    date: "00/00/00",
    time: "00:00",
    quantity: 5,
    status: "Em aberto",
    price: "R$ 00,00",
    qrCodes: [
      {
        id: 1,
        label: "Ingresso 1",
        code: "1035016380321",
        status: "Em aberto",
      },
      {
        id: 2,
        label: "Ingresso 1",
        code: "1035016380321",
        status: "Em aberto",
      },
    ],
  }

  ngOnInit(): void {
    const ticketId = this.activatedRoute.snapshot.paramMap.get("id");

    if (ticketId) {
      this.ticketId = ticketId;
      this.getTicketById(ticketId);
    }
  }

  goBack(): void {
    this.router.navigate(["/client/ingressos"])
  }

  selectTab(index: number): void {
    this.selectedTabIndex = index
  }

  getTicketById(ticketId: any) {
    this.ticketsService.getTicketById(ticketId).subscribe({
      next: (res) => { 
        
        const data = {
          ...res,
          status: this.translateTicketStatus(res.status)
        }
        this.ticketData.set(data)
      }
    })
  }

  translateTicketStatus(statusName: string) {
    if (statusName === 'VALID') return 'Válido';
    if (statusName === 'USED') return 'Usado';
    if (statusName === 'INVALID') return 'Inválido';
    return statusName;
  }
}
