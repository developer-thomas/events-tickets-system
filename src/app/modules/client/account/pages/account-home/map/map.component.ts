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

  getAllLocations() {
    this.accountHomeService.getAll().subscribe({
      next: (res) => {
        this.allLocations.set(res.result);
        this.locationsData.set(res.result); // inicialmente, mostra todos
      }
    })
  }
  

  getUserLocation() {
    this.accountHomeService.getUserLocation().subscribe({
      next: (res) => {
        this.userLocation.set(res);
      }
    })
  }

  getAllCategories() {
    this.categoriesService.getAll().subscribe({
      next: (res) => {
        this.categories.set(res);
      }
    })
  }


  onFilter(searchTerm: string): void {
    const dialogRef = this.dialog.open(FilterModalComponent, {
      width: "90%",
      maxWidth: "500px",
      panelClass: "filter-dialog",
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Filtering by:", searchTerm, "with options:", result)
      }
    })
  }

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
