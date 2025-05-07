import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FilterTableComponent } from '../../../../../../shared/components/filter-table/filter-table.component';
import { EventsComponent } from './tabs/events/events.component';

interface Event {
  id: number
  title: string
  image: string
  category: string
  description: string
  isFavorite: boolean
}

@Component({
  selector: 'app-location-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTabsModule, RouterModule, FilterTableComponent, EventsComponent],
  templateUrl: './location-details.component.html',
  styleUrl: './location-details.component.scss'
})
export class LocationDetailsComponent implements OnInit{
  private route = inject(ActivatedRoute);

  locationId: string | null = null
  activeTab = 0

  categories = [
    { color: "#cc3131", icon: "local_movies" },
    { color: "#ffcc00", icon: "music_note" },
    { color: "#209db3", icon: "theater_comedy" },
    { color: "#4728a2", icon: "palette" },
    { color: "#a148bf", icon: "celebration" },
  ]

  location = {
    id: 1,
    name: "NOME DO LOCAL",
    distance: 30,
    image: "assets/images/location-placeholder.svg",
    description:
      "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
    categories: ["theater", "music", "dance", "art", "cinema"],
  }

  events: Event[] = [
    {
      id: 1,
      title: "Título do evento",
      image: "assets/images/event-placeholder.jpg",
      category: "theater",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      isFavorite: false,
    },
    {
      id: 2,
      title: "Título do evento",
      image: "assets/images/event-placeholder.jpg",
      category: "theater",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      isFavorite: false,
    },
    {
      id: 3,
      title: "Título do evento",
      image: "assets/images/event-placeholder.jpg",
      category: "theater",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      isFavorite: false,
    },
    {
      id: 4,
      title: "Título do evento",
      image: "assets/images/event-placeholder.jpg",
      category: "theater",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      isFavorite: false,
    },
    {
      id: 5,
      title: "Título do evento",
      image: "assets/images/event-placeholder.jpg",
      category: "theater",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      isFavorite: false,
    },
    {
      id: 6,
      title: "Título do evento",
      image: "assets/images/event-placeholder.jpg",
      category: "theater",
      description:
        "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      isFavorite: false,
    },
  ]

  eventTypes = ["Tipo do evento", "Tipo do evento", "Tipo do evento"]

  ngOnInit(): void {
    this.locationId = this.route.snapshot.paramMap.get("id")
    console.log("Location ID:", this.locationId)
  }

  goBack(): void {
    window.history.back()
  }

  selectTab(tabIndex: number): void {
    this.activeTab = tabIndex
  }

  onFilterChange(searchTerm: string): void {
    console.log("Filtering by:", searchTerm)
  }

  onFavoriteToggle(event: Event): void {
    event.isFavorite = !event.isFavorite
    console.log("Toggled favorite for event:", event.id, "New state:", event.isFavorite)
  }
}
