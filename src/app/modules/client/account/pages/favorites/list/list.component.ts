import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
  private categoriesService = inject(CategoriesService);

  userId!: any;
  favoriteEvents = signal<FavoriteEvent[]>([]);

  searchQuery = ""
  selectedCategory = 0;

  categories = signal<GetAllCategories[]>([]);

  ngOnInit(): void {
    this.getUserId();
    this.getFavorites();
    this.getAllCategories();
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

  getAllCategories() {
    this.categoriesService.getAll().subscribe({
      next: (res) => {
        this.categories.set(res);
      }
    })
  }

  toggleCategory(category: number): void {
    this.selectedCategory = category;

    this.filterEvents()
  }

  filterEvents(): void {
    
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
