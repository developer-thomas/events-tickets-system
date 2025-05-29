import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EventHeaderComponent } from './components/event-header/event-header.component';
import { EventLocationComponent, EventLocationData } from './components/event-location/event-location.component';
import { EventScheduleComponent } from './components/event-schedule/event-schedule.component';
import { EventSponsorsComponent } from './components/event-sponsors/event-sponsors.component';
import { EventService } from '../../event.service';
import { ActivatedRoute } from '@angular/router';
import { EventSponsor, GetOneEvent, TimelineEvent } from '../../models/GetEventById.interface';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSlideToggleModule, EventHeaderComponent, EventLocationComponent, EventScheduleComponent, EventSponsorsComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit {
  private eventService = inject(EventService);
  private activatedRoute = inject(ActivatedRoute);
  
  eventId!: string | number;
  public eventData = signal<GetOneEvent | undefined>(undefined);

  locationData: EventLocationData = {
    address: "Avenida Salvador, Bairro, cidade",
    mapImage: "assets/images/map-event-details.png",
  }

  timelineEvent = signal<TimelineEvent[]>([]);
  sponsors = signal<EventSponsor[]>([]);

  ngOnInit(): void {
    const eventId = this.activatedRoute.snapshot.paramMap.get('id');
    if(eventId) {
      this.eventId = eventId;
      this.getEventById();
    }
  }

  getEventById() {
    this.eventService.getOneEvent(this.eventId).subscribe({
      next: (res) => {
        this.eventData.set(res);
        this.timelineEvent.set(res.timelineEvent)
        this.sponsors.set(res.eventSponsor)
      }
    })
  }

  getAnEventTimeline() {

  }

  onDeleteEvent(id: number): void {
    console.log("Delete event:", id)
  }

  onEditEvent(id: number): void {
    console.log("Edit event:", id)
  }

  onToggleEvent(data: { id: number; active: boolean }): void {
    console.log("Toggle event:", data)
  }
}
