import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { QrCodesViewComponent } from './event-details/tabs/qr-codes-view/qr-codes-view.component';
import { EventViewComponent } from './event-details/tabs/event-view/event-view.component';

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
    PageHeaderComponent,
    QrCodesViewComponent,
    EventViewComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  ticketId: string | null = null
  selectedTabIndex = 0

  // Placeholder data - this would be fetched from a service in a real app
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get("id")
    console.log("Ticket ID:", this.ticketId)
    // In a real app, you would fetch the ticket data based on the ID
  }

  goBack(): void {
    this.router.navigate(["/client/ingressos"])
  }

  selectTab(index: number): void {
    this.selectedTabIndex = index
  }
}
