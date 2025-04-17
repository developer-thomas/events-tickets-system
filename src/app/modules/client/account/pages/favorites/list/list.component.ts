import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface Category {
  id: string
  name: string
  icon: string
  color: string
  isActive?: boolean
}

interface FavoriteEvent {
  id: number
  title: string
  location: string
  description: string
  image: string
  isFavorite: boolean
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  searchQuery = ""
  private router = inject(Router)
  categories: Category[] = [
    { id: "jazz", name: "Jazz", icon: "🎷", color: "#a4b3ed", isActive: true },
    { id: "theater", name: "Teatro", icon: "🎭", color: "#ebae13" },
    { id: "art", name: "Arte", icon: "🎨", color: "#209db3" },
    { id: "circus", name: "Circo", icon: "🎪", color: "#ff6633" },
    { id: "festival", name: "Festival", icon: "🎉", color: "#9dcf52" },
  ]

  favoriteEvents: FavoriteEvent[] = [
    {
      id: 1,
      title: "Título do evento",
      location: "Nome do local",
      description:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      image: "//images/event-placeholder.jpg",
      isFavorite: true,
    },
    {
      id: 2,
      title: "Título do evento",
      location: "Nome do local",
      description:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      image: "assets/images/event-placeholder.jpg",
      isFavorite: true,
    },
    {
      id: 3,
      title: "Título do evento",
      location: "Nome do local",
      description:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      image: "assets/images/event-placeholder.jpg",
      isFavorite: true,
    },
    {
      id: 4,
      title: "Título do evento",
      location: "Nome do local",
      description:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      image: "assets/images/event-placeholder.jpg",
      isFavorite: true,
    },
    {
      id: 5,
      title: "Título do evento",
      location: "Nome do local",
      description:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      image: "assets/images/event-placeholder.jpg",
      isFavorite: true,
    },
    {
      id: 6,
      title: "Título do evento",
      location: "Nome do local",
      description:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      image: "assets/images/event-placeholder.jpg",
      isFavorite: true,
    },
  ]

  ngOnInit(): void {}

  toggleCategory(category: Category): void {
    this.categories.forEach((c) => {
      if (c.id === category.id) {
        c.isActive = !c.isActive
      }
    })
    this.filterEvents()
  }

  filterEvents(): void {
    console.log("Filtering events with search:", this.searchQuery)
    console.log(
      "Active categories:",
      this.categories.filter((c) => c.isActive).map((c) => c.name),
    )
  }

  toggleFavorite(event: FavoriteEvent): void {
    event.isFavorite = !event.isFavorite
    if (!event.isFavorite) {
      setTimeout(() => {
        this.favoriteEvents = this.favoriteEvents.filter((e) => e.id !== event.id)
      }, 300)
    }
  }

  buyTicket(eventId: number): void {
    console.log("Buy ticket for event:", eventId)
  }

  viewEventDetails(eventId: number): void {
    console.log("View event details:", eventId)
  }

  openFilters(): void {
    console.log("Open advanced filters")
  }
}
