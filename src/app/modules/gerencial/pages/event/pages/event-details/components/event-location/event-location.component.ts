import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { EventAddress } from '../../../../models/GetEventById.interface';

export interface EventLocationData {
  address: string
  mapImage: string
}

@Component({
  selector: 'app-event-location',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './event-location.component.html',
  styleUrl: './event-location.component.scss'
})
export class EventLocationComponent implements AfterViewInit{
  @Input() locationData!: EventAddress | any;
  addressRedirection: string = '';
  // Coordenadas fornecidas
  center: any = { lat: -22.0117949, lng: -47.8907329 }

  zoom = 15;

  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };

  markerPosition = this.center;

  ngAfterViewInit(): void {
    const { lat, lng } = this.locationData;
    this.center = { lat, lng };
    this.markerPosition = { lat, lng };
    this.addressRedirection = `https://www.google.com/maps?q=${lat},${lng}`;
  }
}
