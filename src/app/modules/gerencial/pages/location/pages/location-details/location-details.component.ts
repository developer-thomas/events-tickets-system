import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { CardsViewComponent } from './components/cards-view/cards-view.component';
import { DashboardViewComponent } from './components/dashboard-view/dashboard-view.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../location.service';
import { GetOneLocation, GetOneLocationAddress, GetOneLocationResponse } from '../../models/GetLocationById.interface';
import { LocationMapComponent } from './components/location-map/location-map.component';


@Component({
  selector: 'app-location-details',
  standalone: true,
  imports: [
    PageHeaderComponent, 
    CommonModule, 
    MatIcon, 
    MatTabsModule, 
    FilterTableComponent, 
    CardsViewComponent, 
    
    LocationMapComponent
  ],
  templateUrl: './location-details.component.html',
  styleUrl: './location-details.component.scss'
})
export class LocationDetailsComponent implements OnInit {
  private router = inject(Router);
  private locationService = inject(LocationService);
  private activatedRoute = inject(ActivatedRoute);

  locationId: any;
  public role = signal<string | null>(null);

  public locationData = signal<GetOneLocation | undefined>(undefined);
  public locationAddress = signal<GetOneLocationAddress | undefined>(undefined);

  // Mock para tipos de eventos
  eventTypes = ["Tipo do evento", "Tipo do evento", "Tipo do evento"]

  // Mock para dashboard
  events = [
    {
      id: 1,
      title: "Título do evento",
      subtitle: "Título do evento",
      description:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      image: "assets/png/home-bg.jpg",
      active: true,
    },
    {
      id: 2,
      title: "Título do evento",
      subtitle: "Título do evento",
      description:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      image: "assets/png/home-bg.jpg",
      active: true,
    },
    {
      id: 3,
      title: "Título do evento",
      subtitle: "Título do evento",
      description:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
      image: "assets/png/home-bg.jpg",
      active: false,
    },
  ]

  currentView: "cards" | "dashboard" = "cards"
  selectedTab = 0

  constructor() {}

  ngOnInit(): void {
    const locationId = this.activatedRoute.snapshot.paramMap.get('id');

    if(locationId) {
      this.locationId = locationId;
      this.getLocationData();
    }
  }

  getLocationData() {
    this.locationService.getLocationById(this.locationId).subscribe({
      next: (res: GetOneLocationResponse) => {
        this.locationData.set(res.result);
        this.locationAddress.set(res.result.addressLocation);
        
        console.log('location data:', this.locationData())
      }
    })
  }

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
    this.router.navigate(['/gerencial/evento/cadastrar'])
  }

  get backgroundImage(): string {
    const url = this.locationData()?.fileCoverUrl || 'assets/image/no-image.jpg';
    return `url(${url})`;
  }

  getRole() {
    this.role.set(localStorage.getItem('role'));
  }
}
