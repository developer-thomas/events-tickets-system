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
  selectedCategory = "all"

  categories: Category[] = [
    { id: "all", name: "Todos", icon: "assets/map-icons/jm-icon.png" },
    { id: "theater", name: "Teatro", icon: "assets/map-icons/arena-icon.png" },
    { id: "music", name: "Música", icon: "assets/map-icons/arte-icon.png" },
    { id: "dance", name: "Dança", icon: "assets/map-icons/corpo-icon.png" },
    { id: "art", name: "Arte", icon: "assets/map-icons/rio-icon.png" },
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
    this.selectedCategory = category.id;

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
