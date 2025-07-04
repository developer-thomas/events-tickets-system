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
import { GetAllLocation, LocationListResponse, UserLocation } from '../models/GetAllLocations.interface';
import { CategoriesService } from '../../../../../gerencial/pages/categories/categories.service';
import { GetAllCategories } from '../../../../../gerencial/pages/categories/models/GetAllCategories.interface';
import { LoggedUser } from '../../../../../shared/models/LoggedUser.interrface';
import { UserService } from '../../../../../../core/auth/user.service';
import { StorageService } from '../../../../../../core/auth/storage.service';

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
  private userService = inject(UserService);
  private storageService = inject(StorageService);

  viewMode: "map" | "list" = "map"
  selectedCategory = 0;
    
  categories = signal<GetAllCategories[]>([]);
  locationsData = signal<GetAllLocation[]>([]);
  allLocations = signal<GetAllLocation[]>([]);
  userLocation = signal<UserLocation | null>(null);
  loggedUser = signal<LoggedUser | null>(null);

  ngOnInit(): void {
    this.getAllLocations();
    this.getUserLocation();
    this.getAllCategories();

    if(localStorage.getItem('userId')) {
    this.getLoggedUser();
    }
  }

  toggleView(): void {
    this.viewMode = this.viewMode === "map" ? "list" : "map"
  }

  getAllLocations() {
    this.accountHomeService.getAll().subscribe({
      next: (res: LocationListResponse) => {
        this.allLocations.set(res.result);
        this.locationsData.set(res.result);
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

  getLoggedUser() {
    this.userService.getLoggedUser().subscribe({
      next: (user) => this.loggedUser.set(user),
      error: () => this.loggedUser.set(null)
    });
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

  applyFilters(filters: {
    types: number[],
    location: string | null,
    dates: number[],
    month: number,
    year: number
  }) {
    const allLocations = this.accountHomeService.getCachedLocations();
    
    // Processa filtros de categoria e data
    let filtered = this.filterByCategoryAndDate(allLocations, filters);
    
    // Aplica filtro de proximidade se selecionado
    if (filters.location) {
      filtered = this.filterByProximity(filtered, filters.location);
    }
    
    this.locationsData.set(filtered);
  }

  private filterByCategoryAndDate(locations: GetAllLocation[], filters: {
    types: number[],
    dates: number[],
    month: number,
    year: number
  }): GetAllLocation[] {
    const selectedDates = this.getSelectedDates(filters.dates, filters.month, filters.year);
    
    return locations.filter((location) => {
      // Filtro por categoria
      const matchesCategory = filters.types.length === 0 ||
        location.categories?.some(cat => filters.types.includes(cat.id));
      
      // Filtro por data
      const matchingEvents = location.event?.filter((event) => {
        const eventDateISO = new Date(event.eventDate).toISOString().split('T')[0];
        const matchesDate = filters.dates.length === 0 || selectedDates.includes(eventDateISO);
        return matchesDate && matchesCategory;
      });
      
      return matchingEvents?.length > 0;
    });
  }

  private filterByProximity(locations: GetAllLocation[], locationType: string): GetAllLocation[] {
    const referenceCoords = this.getReferenceCoordinates(locationType);
    
    if (!referenceCoords || locations.length === 0) {
      return locations;
    }

    // Encontra o local mais próximo
    let minDistance = Infinity;
    let closest: GetAllLocation | null = null;
    
    locations.forEach(loc => {
      const distance = this.calculateDistance(
        referenceCoords.lat,
        referenceCoords.lng,
        loc.addressLocation.lat,
        loc.addressLocation.lng
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closest = loc;
      }
    });

    // Retorna o local mais próximo (com raio de 3000km)
    const maxDistance = 3000;
    return minDistance <= maxDistance && closest ? [closest] : locations;
  }

  private getReferenceCoordinates(locationType: string): { lat: number, lng: number } | null {
    const user = this.loggedUser();
    
    switch (locationType) {
      case 'home':
        const home = user?.addresses?.find(a => a.type === 'Home');
        return home ? { lat: home.lat, lng: home.lng } : null;
        
      case 'work':
        const work = user?.addresses?.find(a => a.type === 'Job');
        return work ? { lat: work.lat, lng: work.lng } : null;
        
      case 'current':
        const userLat = localStorage.getItem('userLat');
        const userLng = localStorage.getItem('userLng');
        return userLat && userLng ? 
          { lat: parseFloat(userLat), lng: parseFloat(userLng) } : null;
        
      default:
        return null;
    }
  }

  private getSelectedDates(dates: number[], month: number, year: number): string[] {
    return dates.map((day) => {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      return `${year}-${monthStr}-${dayStr}`;
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (value: number): number => (value * Math.PI) / 180;
    const R = 6371; // Raio da Terra em km
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return Number((R * c).toFixed(2));
  }

  onSearchChange(searchTerm: string): void {
    const term = searchTerm.trim().toLowerCase();
    
    if (!term) {
      this.locationsData.set(this.allLocations());
      return;
    }
    
    const filtered = this.allLocations().filter(location =>
      location.name.toLowerCase().includes(term)
    );
    
    this.locationsData.set(filtered);
  }
}
