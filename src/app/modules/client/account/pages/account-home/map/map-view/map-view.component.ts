import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { UserLocation } from '../../models/GetAllLocations.interface';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss'
})
export class MapViewComponent implements OnChanges{
  private cdRef = inject(ChangeDetectorRef);

  @Input() userLocation!: UserLocation | null;
  @Input() placeLatLng!: any;

  center: any = { lat: 48.858370, lng: 2.294481 }
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  markerPosition = this.center;

  ngOnChanges(): void {
    console.log('userlocation', this.userLocation)
    if(this.userLocation) {
        this.center = {
          lat: this.userLocation?.lat,
          lng: this.userLocation?.lng
        };

        this.markerPosition = this.center;

        this.cdRef.detectChanges();


    } else {
      console.warn('Geolocalização não suportada neste navegador.')
    }
  } 

}
