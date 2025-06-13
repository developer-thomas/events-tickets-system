import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FavoritesService } from '../favorites.service';
import { StorageService } from '../../../../../../core/auth/storage.service';
import { ToastrService } from 'ngx-toastr';

interface Category {
  id: string
  name: string
  icon: string
  isActive?: boolean
}

export interface FavoriteEvent {
  id: number;
  name: string;
  description: string;
  eventLocation: string;
  isFavorite: boolean;
  image: string;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private favoritesService = inject(FavoritesService);
  private router = inject(Router)
  private storageService = inject(StorageService);
  private toastr = inject(ToastrService);

  userId!: any;
  favoriteEvents = signal<FavoriteEvent[]>([]);

  searchQuery = ""
  selectedCategory = "all"

  categories: Category[] = [
    { id: "all", name: "Todos", icon: "assets/map-icons/jm-icon.png" },
    { id: "theater", name: "Teatro", icon: "assets/map-icons/arena-icon.png" },
    { id: "music", name: "Música", icon: "assets/map-icons/arte-icon.png" },
    { id: "dance", name: "Dança", icon: "assets/map-icons/corpo-icon.png" },
    { id: "art", name: "Arte", icon: "assets/map-icons/rio-icon.png" },
  ]

  ngOnInit(): void {
    this.getUserId();
    this.getFavorites();
  }

  getFavorites() {
    this.favoritesService.getFavorites(this.userId).subscribe({
      next: (res) => {
        console.log('aaa', res)
        this.favoriteEvents.set(res);
      }
    })
  }

  getUserId() {
    const userId = Number(this.storageService.getItem('userId'));

    if(userId) {
      this.userId = Number(userId);
    }
  }

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
    const eventId = event.id;
    const userId = this.userId;
    
    this.favoritesService.favoriteAnEvent({ eventId, userId }).subscribe({
      next: (_) => {
        this.toastr.success("Evento removido dos favoritos")
        this.getFavorites();
      }, error: (err) => {
        this.toastr.error("Erro ao remover evento", err)
      }
    })
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
