import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketsService } from '../tickets.service';
import { GetAllUserTickets } from '../models/GetAllUserTickets.interface';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ticketsService = inject(TicketsService);

  ticketsData = signal<GetAllUserTickets[]>([]);

  ngOnInit(): void {
    this.getUserTickets()
  }

  getUserTickets() {
    this.ticketsService.getUserTickets().subscribe({
      next: (res) => {
        const data = res.data.map((ticket) => ({
          ...ticket,
          status: this.translateTicketStatus(ticket.status),
        }))
        this.ticketsData.set(data)
      }
    })
  }

  navigateToTicketDetail(ticketId: number): void {
    this.router.navigate([ticketId], { relativeTo: this.route})
  }

  translateTicketStatus(statusName: string) {
    if (statusName === 'VALID') return 'Válido';
    if (statusName === 'USED') return 'Usado';
    if (statusName === 'INVALID') return 'Inválido';
    return statusName;
  }
}
