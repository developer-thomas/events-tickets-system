import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface TicketQrCode {
  id: number
  title: string
  code: string
  status: string
}

@Component({
  selector: 'app-ticket-qr-codes',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './ticket-qr-codes.component.html',
  styleUrl: './ticket-qr-codes.component.scss'
})
export class TicketQrCodesComponent {
  tickets: TicketQrCode[] = [
    {
      id: 1,
      title: "Ingresso 1",
      code: "1035016380321",
      status: "Em aberto",
    },
    {
      id: 2,
      title: "Ingresso 1",
      code: "1035016380321",
      status: "Em aberto",
    },
  ]

  constructor() {}

  ngOnInit(): void {}

  viewTicket(ticketId: number): void {
    console.log("View ticket:", ticketId)
  }

  downloadTicket(ticketId: number): void {
    console.log("Download ticket:", ticketId)
  }
}
