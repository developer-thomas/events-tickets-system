import { Component, Input, OnChanges, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { GetAllLocation, UserLocation } from '../../models/GetAllLocations.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, RouterModule],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss'
})
export class MapViewComponent implements OnChanges{
  @Input() userLocation!: UserLocation | null;
  @Input() placeLatLng!: any;
  @Input() locations!: GetAllLocation[];

  // CAPTURA O PRÓPRIO MAPA
  @ViewChild(GoogleMap) map!: GoogleMap;
  // CAPTURA O POPUP DO LOCAL CLICADO
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  selectedMarker: any;

  @ViewChildren(MapMarker) mapMarkers!: QueryList<MapMarker>;
  
  center: google.maps.LatLngLiteral = { lat: 48.858370, lng: 2.294481 };
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };

  // MARCADOR DA POSIÇÃO DO USUÁRIO
  markerPosition = this.center;

  // DEFINE MARCADORES PERSONALIZADOS
  customMarkers: {
    position: google.maps.LatLngLiteral;
    title: string;
    coverUrl: string;
    iconUrl: string;
    icon: google.maps.Icon;
  }[] = [];
  

  // CONTROLA AS FUNCIONALIDADES QUE DEVEM APARECER NO MAPA
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: false, 
    fullscreenControl: false, 
    streetViewControl: false, 
    zoomControl: true 
  };

  ngOnChanges(): void {
    const bounds = new google.maps.LatLngBounds();
  
    if (this.userLocation) {
      this.center = {
        lat: this.userLocation.lat,
        lng: this.userLocation.lng
      };
      this.markerPosition = this.center;
      bounds.extend(this.center);
    }
  
    // Limpa os marcadores
    this.customMarkers = [];
  
    if (this.locations?.length) {
      this.customMarkers = this.locations.map((location) => {
        const pos = {
          lat: location.addressLocation.lat,
          lng: location.addressLocation.lng
        };
        bounds.extend(pos);
        return {
          id: location.id,
          position: pos,
          title: location.name,
          coverUrl: location.fileCoverUrl,
          iconUrl: location.categories?.[0]?.imageIconUrl ?? '',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(40, 40)
          }
        };
      });
    }
  
    // Só aplica fitBounds se houver locais além da posição do usuário
    setTimeout(() => {
      if (this.map && this.customMarkers.length > 0) {
        this.map.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
        });
      }
    }, 200);
  }
  
  openInfo(marker: typeof this.customMarkers[number], index: number) {
    this.selectedMarker = marker;

    // Ignora o primeiro marcador (usuário)
    const allMarkers = this.mapMarkers.toArray();
    const ref = allMarkers[index + 1]; // +1 porque o primeiro é do usuário
    this.infoWindow.open(ref);
  }
  

  onFilter(event: any) {}

}
