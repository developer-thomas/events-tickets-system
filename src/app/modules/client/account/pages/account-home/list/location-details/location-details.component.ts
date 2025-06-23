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
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { LocationComponent } from './tabs/location/location.component';

@Component({
  selector: 'app-location-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTabsModule, 
    RouterModule, 
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

  ngOnInit(): void {
    this.locationId = this.route.snapshot.paramMap.get("id");
    this.getLocationById();
  }

  getLocationById() {
    if(!this.locationId) {
      return
    }

    this.accountHomeService.getLocationById(this.locationId).subscribe({
      next: (res) => {
        console.log('res', res)
        this.locationData.set(res.result);
        this.locationAddressData.set(res.result.addressLocation);
        this.getUserLocation(res.result.addressLocation.lat, res.result.addressLocation.lng)
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
  getUserLocation(eventLat: number, eventLng: number) {
    const userLat = Number(localStorage.getItem('userLat'));
    const userLng = Number(localStorage.getItem('userLng'));

    console.log(eventLat, eventLng)

    console.log('eventlat,', eventLat)
    // Verifica se lat/lng são válidos
    if (!userLat || !userLng) {
      return 
    }

    const distance = haversineDistance(
      userLat,
      userLng,
      eventLat,
      eventLng
    )

    this.locationDistance.set(distance)
  }
}
