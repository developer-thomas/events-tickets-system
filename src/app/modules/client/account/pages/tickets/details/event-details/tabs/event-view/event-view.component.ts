import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EventDetailsComponent } from '../../../../../account-home/list/location-details/event-details/event-details.component'
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
  imports: [CommonModule, MatIconModule, EventDetailsComponent],
  templateUrl: './event-view.component.html',
  styleUrl: './event-view.component.scss'
})
export class EventViewComponent {
  @Input() ticket!: Ticket

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
