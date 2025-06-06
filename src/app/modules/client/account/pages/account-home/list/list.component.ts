import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { GetAllLocation, UserLocation } from '../models/GetAllLocations.interface';
import { haversineDistance } from '../../../../../shared/utils/haversineDistance';
import { estimateTravelTime } from '../../../../../shared/utils/estimateTravelTime' 

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnChanges {
  @Input() selectedCategory = "all"

  @Input() locations: GetAllLocation[] = [];
  @Input() userLocation!: UserLocation | null;

  @Output() backToMapView = new EventEmitter();

  locationWithDistanceAndTime = signal<GetAllLocation[]>([]);

  // Categorias virão dinamicamente de /categories
  categories = [
    { color: "#cc3131", icon: "local_movies" },
    { color: "#ffcc00", icon: "music_note" },
    { color: "#209db3", icon: "theater_comedy" },
    { color: "#4728a2", icon: "palette" },
    { color: "#a148bf", icon: "celebration" },
  ]

  constructor(private router: Router) {}

  ngOnChanges(): void {
    const locationWithDistance = this.locations.map(local => {
      const distance = haversineDistance(
        this.userLocation?.lat,
        this.userLocation?.lng,
        local.addressLocation.lat,
        local.addressLocation.lng
      );

      const estimatedTime = estimateTravelTime(distance);

      return {
        ...local,
        distanceKm: distance,
        estimatedTime
      }
    
    });

    this.locationWithDistanceAndTime.set(locationWithDistance);
    console.log(this.locationWithDistanceAndTime())
  }

  onFilter(searchTerm: string): void {
    console.log("Filtering by:", searchTerm)
  }

  goBack(): void {
    this.backToMapView.emit();
    console.log('back')
  }

  navigateToLocationDetail(locationId: number): void {
    this.router.navigate(["/client/inicio/location", locationId])
  }
}
