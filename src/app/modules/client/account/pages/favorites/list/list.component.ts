import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FavoritesService } from '../favorites.service';
import { StorageService } from '../../../../../../core/auth/storage.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from '../../../../../gerencial/pages/categories/categories.service';
import { GetAllCategories } from '../../../../../gerencial/pages/categories/models/GetAllCategories.interface';

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
  date: string; // opcional, se você usar a data no front
  lat: number;
  lng: number;
  value: number;
  categories: {
    id: number;
    name: string;
    imageCoverUrl: string | null;
    imageIconUrl: string | null;
  }[];
}


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private favoritesService = inject(FavoritesService)
  private router = inject(Router)
  private storageService = inject(StorageService)
  private toastr = inject(ToastrService)
  private categoriesService = inject(CategoriesService)

  userId!: any
  allFavoriteEvents = signal<FavoriteEvent[]>([])
  searchQuery = signal("")
  selectedCategory = signal(0);

  categories = signal<GetAllCategories[]>([])

  // Computed signal para eventos filtrados
  favoriteEvents = computed(() => {
    const events = this.allFavoriteEvents();
    const query = this.searchQuery().toLowerCase().trim();
    const selectedCat = this.selectedCategory();
  
    return events.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.eventLocation.toLowerCase().includes(query);
  
      const matchesCategory =
        selectedCat === 0 || event.categories.some((cat: any) => cat.id === selectedCat);
  
      return matchesSearch && matchesCategory;
    });
  });

  ngOnInit(): void {
    this.getUserId()
    this.getFavorites()
    this.getAllCategories()
  }

  getFavorites() {
    this.favoritesService.getFavorites(this.userId).subscribe({
      next: (res) => {
        // Adicionar imagem placeholder para cada evento
        const eventsWithImages = res.map((event: any) => ({
          ...event,
        }))
        this.allFavoriteEvents.set(eventsWithImages)
      },
    })
  }

  getUserId() {
    const userId = Number(this.storageService.getItem("userId"))

    if (userId) {
      this.userId = Number(userId)
    }
  }

  getAllCategories() {
    this.categoriesService.getAll().subscribe({
      next: (res) => {
        this.categories.set(res)
      },
    })
  }

  toggleCategory(categoryId: number): void {
    this.selectedCategory.set(categoryId);
  }

  filterEvents(): void {
    // O filtro é aplicado automaticamente através do computed signal
    console.log("Filtering events with query:", this.searchQuery())
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement
    this.searchQuery.set(target.value)
  }

  toggleFavorite(event: FavoriteEvent): void {
    const eventId = event.id
    const userId = this.userId

    this.favoritesService.favoriteAnEvent({ eventId, userId }).subscribe({
      next: (_) => {
        this.toastr.success("Evento removido dos favoritos")
        this.getFavorites()
      },
      error: (err) => {
        this.toastr.error("Erro ao remover evento", err)
      },
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
