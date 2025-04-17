import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

interface Sponsor {
  name: string
  category: string
  description: string
  image?: string
}

interface ScheduleItem {
  date: string
  day: string
  time: string
  description: string
}

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  eventId: string | null = null
  isFavorite = false

  event = {
    id: 1,
    title: "Título do evento",
    location: "Nome do local",
    price: "R$ 1500,00",
    dateRange: "17-22 de mar",
    image: "assets/images/event-details.png",
    description:
      "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    sponsorLogo: "assets/images/imf-brasil.png",
    address: "Avenida Salvador, Bairro, cidade",
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
      category: "Membro desde 2019",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to",
    },
    {
      name: "Nome do parceiro",
      category: "Membro desde 2019",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to",
    },
    {
      name: "Nome do parceiro",
      category: "Membro desde 2019",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to",
    },
  ]

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get("id")
    console.log("Event ID:", this.eventId)
    // In a real app, you would fetch the event data based on the ID
  }

  goBack(): void {
    window.history.back()
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite
  }

  shareEvent(): void {
    console.log("Sharing event:", this.event.id)
  }

  buyTicket(): void {
    this.router.navigate(['client/inicio/cart']);
  }
}
