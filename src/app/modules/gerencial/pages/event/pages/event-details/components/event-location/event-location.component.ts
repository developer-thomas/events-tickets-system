import { Component, Input } from '@angular/core';

export interface EventLocationData {
  address: string
  mapImage: string
}

@Component({
  selector: 'app-event-location',
  standalone: true,
  imports: [],
  templateUrl: './event-location.component.html',
  styleUrl: './event-location.component.scss'
})
export class EventLocationComponent {
  @Input() locationData!: any;
}
