import { Component, Input } from '@angular/core';
import { EventAddress } from '../models/GetEventById.interface';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-event-location',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './event-location.component.html',
  styleUrl: './event-location.component.scss'
})
export class EventLocationComponent {
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
