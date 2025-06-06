import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TicketsService } from '../../../tickets.service';
import { EventDetailsGenericComponent } from '../../../../../../../shared/components/event-details/event-details.component';


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
  selector: 'app-event-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, EventDetailsGenericComponent],
  templateUrl: './event-view.component.html',
  styleUrl: './event-view.component.scss'
})
export class EventViewComponent  {
  private ticketService = inject(TicketsService);

  @Input() ticket!: Ticket
  @Input() eventId: any;
  // Placeholder event details - in a real app, these would come from a service

  eventDetails = {
    location: "Nome do local",
    address: "Endereço do local, Cidade - Estado",
    description:
      "Descrição detalhada do evento. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.",
    organizer: "Nome do organizador",
    contactEmail: "contato@organizador.com",
    contactPhone: "(00) 00000-0000",
  }

 

}
