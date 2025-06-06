import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnChanges } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent implements OnChanges {
  private cdRef = inject(ChangeDetectorRef);

  @Input() placeLatLng!: any;

  addressRedirection!: string;

  center: any = { lat: 48.858370, lng: 2.294481 }
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  markerPosition = this.center;

  ngOnChanges(): void {
    const { lat ,lng } = this.placeLatLng;

    this.center = { lat, lng };

    this.markerPosition = { lat, lng };

    this.addressRedirection = `https://www.google.com/maps?q=${lat},${lng}`;

    this.cdRef.detectChanges();
  } 
}
