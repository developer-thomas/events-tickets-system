import { Component, Input } from '@angular/core';

export interface Sponsor {
  name: string
  category: string
  description: string
  image?: string
}

@Component({
  selector: 'app-event-sponsors',
  standalone: true,
  imports: [],
  templateUrl: './event-sponsors.component.html',
  styleUrl: './event-sponsors.component.scss'
})
export class EventSponsorsComponent {
  @Input() sponsors: Sponsor[] = []
}
