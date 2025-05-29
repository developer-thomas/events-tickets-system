import { Component, inject, Input, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EventHeaderComponent } from "../../../event/pages/event-details/components/event-header/event-header.component";
import { EventLocationComponent, EventLocationData } from "../../../event/pages/event-details/components/event-location/event-location.component";
import { EventScheduleComponent } from "../../../event/pages/event-details/components/event-schedule/event-schedule.component";
import { EventSponsorsComponent } from "../../../event/pages/event-details/components/event-sponsors/event-sponsors.component";
import { GetOneEvent, TimelineEvent, EventSponsor } from "../../../event/models/GetEventById.interface";
import { TicketsService } from "../../tickets.service";


@Component({
  selector: 'app-ticket-event',
  standalone: true,
  imports: [
    EventHeaderComponent, 
    EventLocationComponent, 
    EventScheduleComponent, 
    EventSponsorsComponent],
  templateUrl: './ticket-event.component.html',
  styleUrl: './ticket-event.component.scss'
})
export class TicketEventComponent {
  private ticketService = inject(TicketsService);
  private activatedRoute = inject(ActivatedRoute);
  
  @Input() ticketId!: string | number;
  

  locationData: EventLocationData = {
    address: "Avenida Salvador, Bairro, cidade",
    mapImage: "assets/images/map-event-details.png",
  }
  
  eventData = signal<GetOneEvent | undefined>(undefined);
  timelineEvent = signal<TimelineEvent[]>([]);
  sponsors = signal<EventSponsor[]>([]);

  ngOnInit(): void {
    const eventId = this.activatedRoute.snapshot.paramMap.get('id');
    if(eventId) {
      this.ticketId = eventId;
      this.getEventById();
    }
  }

  getEventById() {
    this.ticketService.getOneTicket(this.ticketId).subscribe({
      next: (res) => {
        this.eventData.set(res.event)
        this.timelineEvent.set(res.event.timelineEvent)
        this.sponsors.set(res.event.eventSponsor)
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
