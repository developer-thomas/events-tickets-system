import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal } from '@angular/core';
import { EventLocationComponent } from './event-location/event-location.component';
import { EventScheduleComponent } from './event-schedule/event-schedule.component';
import { EventSponsorsComponent } from './event-sponsors/event-sponsors.component';
import { EventService } from '../../../gerencial/pages/event/event.service';
import { TimelineEvent } from './models/GetEventById.interface';
import { GetOneEvent, EventSponsor, EventAddress } from './models/GetEventById.interface';
import { EventHeaderComponent } from './event-header/event-header.component';

@Component({
  selector: 'app-event-details-generic',
  standalone: true,
  imports: [
    EventHeaderComponent, 
    EventLocationComponent, 
    EventScheduleComponent, 
    EventSponsorsComponent
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsGenericComponent implements OnChanges {
  private eventService = inject(EventService);
  // private activatedRoute = inject(ActivatedRoute);
  
  @Input() eventId!: string | number;
  @Input() useActionButtons = true;
  @Input() useClientButtons = false;

  // Eventos para o usuário client
  @Output() buyTicket = new EventEmitter<any>();
  @Output() favoriteEvent = new EventEmitter<any>();
  @Output() shareEvent = new EventEmitter<any>();

  // Eventos para o usuário admin
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();
  @Output() activeEvent = new EventEmitter<any>();

  public eventData = signal<GetOneEvent | undefined>(undefined);

  timelineEvent = signal<TimelineEvent[]>([]);
  sponsors = signal<EventSponsor[]>([]);
  locationData = signal<EventAddress | undefined>(undefined);

  ngOnChanges(): void {

    if(this.eventId) {
      this.getEventById();
    }
  }

  getEventById() {
    this.eventService.getOneEvent(this.eventId).subscribe({
      next: (res) => {
        console.log('detalhes do evento', res.eventLocation)
        this.eventData.set(res);
        this.timelineEvent.set(res.timelineEvent)
        this.sponsors.set(res.eventSponsor)
        this.locationData.set(res.eventLocation.addressLocation)
      }
    })
  }

  getAnEventTimeline() {

  }

  onDeleteEvent(id: number): void {
    this.deleteEvent.emit(this.eventId)
  }
  
  onEditEvent(id: number): void {
    this.editEvent.emit(this.eventId)
  }

  onToggleEvent(data: any): void {
    this.activeEvent.emit(this.eventId)
  }

  onBuyTicket() {
    this.buyTicket.emit(this.eventId)
  }

  
  onFavoriteEvent() {
    this.favoriteEvent.emit(this.eventId)
  }

  onSharedEvent() {
    this.shareEvent.emit(this.eventId)
  }
}
