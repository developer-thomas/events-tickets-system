import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FilterTableComponent } from '../../../../../../shared/components/filter-table/filter-table.component';
import { EventsComponent } from './tabs/events/events.component';
import { AccountHomeService } from '../../account-home.service';
import { GetOneLocation } from '../../models/GetOneLocations.interface';
import { haversineDistance } from '../../../../../../shared/utils/haversineDistance';
import { AddressLocation } from '../../models/GetAllLocations.interface';
import { Observable } from 'rxjs';
import { LocationComponent } from './tabs/location/location.component';

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
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTabsModule, 
    RouterModule, 
    FilterTableComponent, 
    EventsComponent,
    LocationComponent
  ],
  templateUrl: './location-details.component.html',
  styleUrl: './location-details.component.scss'
})
export class LocationDetailsComponent implements OnInit{
  private route = inject(ActivatedRoute); 
  private accountHomeService = inject(AccountHomeService);

  locationId: string | null = null
  activeTab = 0

  locationData = signal<GetOneLocation | null>(null);
  locationAddressData = signal<AddressLocation | null>(null);
  locationDistance = signal<any | null>(null);

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

  eventTypes = ["Tipo do evento", "Tipo do evento", "Tipo do evento"]

  ngOnInit(): void {
    this.locationId = this.route.snapshot.paramMap.get("id");
  
    this.getLocationById()
  }

  getLocationById() {
    if(!this.locationId) {
      return
    }

    this.accountHomeService.getLocationById(this.locationId).subscribe({
      next: (res) => {
        this.locationData.set(res.result);
        this.locationDistance.set(res.result.addressLocation);

      }
    })
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

  onFavoriteToggle(event: any): void {
    event.isFavorite = !event.isFavorite
    console.log("Toggled favorite for event:", event.id, "New state:", event.isFavorite)
  }

  // MEXER AQUI
  // PRECISO FAZER A COMPARAÇÃO ENTRE AS DISTÂNCIAS
  getUserLocation(lat: number, lng: number): Observable<number> {
    return new Observable(observer => {
      this.accountHomeService.getUserLocation().subscribe({
        next: (res) => {
          const distance = haversineDistance(res.lat, res.lng, lat, lng);
          observer.next(distance);
          observer.complete();
        },
        error: (error) => {
          console.error('Error getting user location:', error);
          observer.next(0);
          observer.complete();
        }
      });
    });
  }
}
