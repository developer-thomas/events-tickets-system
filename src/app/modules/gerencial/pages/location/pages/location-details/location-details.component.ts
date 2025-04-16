import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { CardsViewComponent } from './components/cards-view/cards-view.component';
import { DashboardViewComponent } from './components/dashboard-view/dashboard-view.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-location-details',
  standalone: true,
  imports: [PageHeaderComponent, CommonModule, MatIcon, MatSlideToggle, MatTabsModule, FilterTableComponent, CardsViewComponent, DashboardViewComponent],
  templateUrl: './location-details.component.html',
  styleUrl: './location-details.component.scss'
})
export class LocationDetailsComponent {
  private router = inject(Router);
  locationName = "NOME DO LOCAL"
  locationDescription =
    "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard"

  categories = [
    { color: "#cc3131", icon: "local_movies" },
    { color: "#ffcc00", icon: "music_note" },
    { color: "#209db3", icon: "theater_comedy" },
    { color: "#4728a2", icon: "palette" },
    { color: "#a148bf", icon: "celebration" },
  ]

  eventTypes = ["Tipo do evento", "Tipo do evento", "Tipo do evento"]

  events = [
    {
      id: 1,
      title: "Título do evento",
      subtitle: "Título do evento",
      description:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      image: "/assets/png/home-bg.jpg",
      active: true,
    },
    {
      id: 2,
      title: "Título do evento",
      subtitle: "Título do evento",
      description:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      image: "/assets/png/home-bg.jpg",
      active: true,
    },
    {
      id: 3,
      title: "Título do evento",
      subtitle: "Título do evento",
      description:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      image: "/assets/png/home-bg.jpg",
      active: false,
    },
  ]

  currentView: "cards" | "dashboard" = "cards"
  selectedTab = 0

  constructor() {}

  ngOnInit(): void {}

  selectTab(index: number): void {
    this.selectedTab = index
  }

  onFilter(searchTerm: string): void {
    console.log("Filtering by:", searchTerm)
    // Implement filtering logic here
  }

  switchView(view: "cards" | "dashboard"): void {
    this.currentView = view
  }

  createNewEvent(): void {
    console.log("Creating new event")
    this.router.navigate(['/gerencial/local/cadastrar'])
  }
}
