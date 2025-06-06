import { Component, Input } from '@angular/core';
import { EventSponsor } from '../models/GetEventById.interface';

@Component({
  selector: 'app-event-sponsors',
  standalone: true,
  imports: [],
  templateUrl: './event-sponsors.component.html',
  styleUrl: './event-sponsors.component.scss'
})
export class EventSponsorsComponent {
  @Input() sponsors: EventSponsor[] = [];
}
