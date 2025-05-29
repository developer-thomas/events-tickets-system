import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GetOneTicket } from '../../../event/models/GetEventById.interface';

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
  @Input() ticketData!: GetOneTicket | undefined;

  constructor() {}

  ngOnInit(): void {}

  viewTicket(ticketId: number): void {
    console.log("View ticket:", ticketId)
  }

  downloadTicket(ticketId: number): void {
    console.log("Download ticket:", ticketId)
  }
}
