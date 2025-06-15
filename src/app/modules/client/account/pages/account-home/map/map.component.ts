import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { ListComponent } from '../list/list.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { MapViewComponent } from './map-view/map-view.component';
import { AccountHomeService } from '../account-home.service';
import { GetAllLocation, UserLocation } from '../models/GetAllLocations.interface';
import { CategoriesService } from '../../../../../gerencial/pages/categories/categories.service';
import { GetAllCategories } from '../../../../../gerencial/pages/categories/models/GetAllCategories.interface';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    FilterTableComponent,
    ListComponent,
    MapViewComponent
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  private dialog = inject(MatDialog);
  private accountHomeService = inject(AccountHomeService);
  private categoriesService = inject(CategoriesService);

  viewMode: "map" | "list" = "map"
    
  selectedCategory = 0;
    
  // Armazena todas as categorias 
  categories = signal<GetAllCategories[]>([]);

  // Armazena todos os eventos que vem do backend
  locationsData = signal<GetAllLocation[]>([]);

  // Armazena os locais em cachê através do método do service
  allLocations = signal<GetAllLocation[]>([]);

  // Armazena a lat lng do usuário que entra
  userLocation = signal<UserLocation | null>(null);

  ngOnInit(): void {
    this.getAllLocations();
    this.getUserLocation();
    this.getAllCategories();
  }

  toggleView(): void {
    this.viewMode = this.viewMode === "map" ? "list" : "map"
  }

  // OBTÉM TODOS OS LOCAIS SEM PAGINAÇÃO
  getAllLocations() {
    this.accountHomeService.getAll().subscribe({
      next: (res) => {
        this.allLocations.set(res.result);
        this.locationsData.set(res.result); // inicialmente, mostra todos
      }
    })
  }
  
  // SOLICITA A LOCALIZAÇÃO DO USUÁRIO
  getUserLocation() {
    this.accountHomeService.getUserLocation().subscribe({
      next: (res) => {
        this.userLocation.set(res);
      }
    })
  }

  // PEGA TODAS AS CATEGORIAS
  getAllCategories() {
    this.categoriesService.getAll().subscribe({
      next: (res) => {
        this.categories.set(res);
      }
    })
  }

  // FILTRA PELA CATEGORIA SELECIONADA
  selectCategory(category: GetAllCategories): void {
    if (this.selectedCategory === category.id) {
      this.selectedCategory = 0;
      this.locationsData.set(this.accountHomeService.getCachedLocations());
      return;
    }
  
    this.selectedCategory = category.id;
  
    const allLocations = this.accountHomeService.getCachedLocations();
  
    const filtered = allLocations.filter(loc =>
      loc.categories?.some(cat => cat.id === category.id)
    );
  
    this.locationsData.set(filtered);
  }

  // ABRE O FILTRO DO MODAL
  onFilter(searchTerm: string): void {
    const dialogRef = this.dialog.open(FilterModalComponent, {
      width: "90%",
      maxWidth: "500px",
      maxHeight: '100vh',
      panelClass: "filter-dialog",
    })

    dialogRef.afterClosed().subscribe((filters) => {
      if (filters) {
        this.applyFilters(filters);
      }
    })
  }

  // MÉTODO PARA APLICAR O FILTRO VINDO DO MODAL
  applyFilters(filters: {
    types: number[],
    location: string | null,
    dates: number[],
    month: number,
    year: number
  }) {
    const allLocations = this.accountHomeService.getCachedLocations();
  
    // Cria array de datas no formato 'YYYY-MM-DD' baseado no filtro de dias, mês e ano
    const selectedDates = filters.dates.map((day) => {
      const monthStr = String(filters.month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      return `${filters.year}-${monthStr}-${dayStr}`;
    });
  
    const filtered = allLocations.filter((location) => {
      let matchesPlace = true;
      if (filters.location) {
        if (filters.location === 'home') {
          matchesPlace = location.name.toLowerCase().includes('casa');
        } else if (filters.location === 'work') {
          matchesPlace = location.name.toLowerCase().includes('trabalho');
        } else if (filters.location === 'current') {
          matchesPlace = true; 
        } else {
          // Caso selecione algo diferente, tenta comparar placeId
          matchesPlace = location.addressLocation?.placeId === filters.location;
        }
      }

      // Filtra eventos dentro da location
      const matchingEvents = location.event?.filter((event) => {
        const eventDateISO = new Date(event.eventDate).toISOString().split('T')[0];
  
        const matchesDate =
          filters.dates.length === 0 || selectedDates.includes(eventDateISO);
  
        const matchesCategory =
          filters.types.length === 0 ||
          event.categories?.some((cat) => filters.types.includes(cat.id));
  
        return matchesDate && matchesCategory;
      });
  
      return matchesPlace && matchingEvents?.length > 0;
    });
  
    this.locationsData.set(filtered);
  }
  
  // FILTRO DE TEXTO
  onSearchChange(searchTerm: string): void {
    const term = searchTerm.trim().toLowerCase();
  
    if (!term) {
      // Se estiver vazio, mostra todos os locais do cache
      this.locationsData.set(this.allLocations());
      return;
    }
  
    // Filtra os locais pelo nome
    const filtered = this.allLocations().filter(location =>
      location.name.toLowerCase().includes(term)
    );
  
    this.locationsData.set(filtered);
  }
}
