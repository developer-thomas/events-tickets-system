import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';

interface Ticket {
  id: number
  title: string
  date: string
  time: string
  quantity: number
  status: string
  price: string
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, PageHeaderComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  tickets: Ticket[] = [
    {
      id: 1,
      title: "Título do evento",
      date: "00/00/00",
      time: "00:00",
      quantity: 5,
      status: "Em aberto",
      price: "R$ 00,00",
    },
    {
      id: 2,
      title: "Título do evento",
      date: "00/00/00",
      time: "00:00",
      quantity: 5,
      status: "Em aberto",
      price: "R$ 00,00",
    },
    {
      id: 3,
      title: "Título do evento",
      date: "00/00/00",
      time: "00:00",
      quantity: 5,
      status: "Em aberto",
      price: "R$ 00,00",
    },
  ]

  ngOnInit(): void {}

  navigateToTicketDetail(ticketId: number): void {
    this.router.navigate([ticketId], { relativeTo: this.route})
  }
}
