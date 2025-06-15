import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { GetAllLocation, UserLocation } from '../../models/GetAllLocations.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss'
})
export class MapViewComponent implements OnChanges{
  @Input() userLocation!: UserLocation | null;
  @Input() placeLatLng!: any;
  @Input() locations!: GetAllLocation[];

  @ViewChild(GoogleMap) map!: GoogleMap;

  center: google.maps.LatLngLiteral = { lat: 48.858370, lng: 2.294481 };
  zoom = 1;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };

  markerPosition = this.center;
  customMarkers: {
    position: google.maps.LatLngLiteral;
    title: string;
    icon: google.maps.Icon;
  }[] = [];

  mapOptions: google.maps.MapOptions = {
    mapTypeControl: false, 
    fullscreenControl: false, 
    streetViewControl: false, 
    zoomControl: true 
  };

  ngOnChanges(): void {
    // Recalcular marcadores
    const bounds = new google.maps.LatLngBounds();

    // Localização do usuário
    if (this.userLocation) {
      this.center = {
        lat: this.userLocation.lat,
        lng: this.userLocation.lng
      };
      this.markerPosition = this.center;
      bounds.extend(this.center);
    }

    // Marcadores dos locais
    if (this.locations?.length) {
      this.customMarkers = this.locations.map((location) => {
        const pos = {
          lat: location.addressLocation.lat,
          lng: location.addressLocation.lng
        };
        bounds.extend(pos);
        return {
          position: pos,
          title: location.name,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(40, 40)
          }
        };
      });
    }

    // Atualiza o viewport do mapa com os bounds
    setTimeout(() => {
      if (this.map && bounds) {
        this.map.fitBounds(bounds);
      }
    }, 200); // delay pequeno para garantir que o mapa já esteja renderizado
  }

  onFilter(event: any) {}

}
