import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EventHeaderComponent, EventHeaderData } from './components/event-header/event-header.component';
import { EventLocationComponent, EventLocationData } from './components/event-location/event-location.component';
import { EventScheduleComponent } from './components/event-schedule/event-schedule.component';
import { EventSponsorsComponent } from './components/event-sponsors/event-sponsors.component';

interface ScheduleItem {
  date: string
  day: string
  time: string
  description: string
}

interface Sponsor {
  name: string
  category: string
  description: string
  image?: string
}

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSlideToggleModule, EventHeaderComponent, EventLocationComponent, EventScheduleComponent, EventSponsorsComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit{
  eventHeaderData: EventHeaderData = {
    id: 1,
    title: "Título do evento",
    location: "Nome do local",
    price: "R$ 1500,00",
    dateRange: "17-22 de mar",
    image: "assets/images/event-details.png",
    description:
      "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    active: true,
    sponsorLogo: "assets/images/imf-brasil.png",
  }

  locationData: EventLocationData = {
    address: "Avenida Salvador, Bairro, cidade",
    mapImage: "assets/images/map-event-details.png",
  }

  scheduleItems: ScheduleItem[] = [
    {
      date: "00/00/00",
      day: "Segunda",
      time: "00:00 - 00:00",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
    },
    {
      date: "00/00/00",
      day: "Segunda",
      time: "00:00 - 00:00",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been",
    },
  ]

  sponsors: Sponsor[] = [
    {
      name: "Nome do parceiro",
      category: "Categoria",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to",
    },
    {
      name: "Nome do parceiro",
      category: "Categoria",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to",
    },
    {
      name: "Nome do parceiro",
      category: "Categoria",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to",
    },
  ]

  constructor() {}

  ngOnInit(): void {}

  onDeleteEvent(id: number): void {
    console.log("Delete event:", id)
  }

  onEditEvent(id: number): void {
    console.log("Edit event:", id)
  }

  onToggleEvent(data: { id: number; active: boolean }): void {
    console.log("Toggle event:", data)
    this.eventHeaderData.active = data.active
  }
}
