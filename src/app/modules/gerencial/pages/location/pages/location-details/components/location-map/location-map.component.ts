import { AfterViewInit, ChangeDetectorRef, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GetOneLocationAddress } from '../../../../models/GetLocationById.interface';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './location-map.component.html',
  styleUrl: './location-map.component.scss'
})
export class LocationMapComponent implements OnChanges{
  private cdRef = inject(ChangeDetectorRef);
  @Input() address: GetOneLocationAddress | any;

  addressRedirection: string = 'https://www.google.com';

  center: any = { lat: 48.858370, lng: 2.294481 }
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };

  markerPosition = this.center;

  ngOnChanges(): void {
    const { lat, lng } = this.address;

    this.center = { lat, lng };
    this.markerPosition = { lat, lng };
    this.addressRedirection = `https://www.google.com/maps?q=${lat},${lng}`;

    this.cdRef.detectChanges();
  }

}
