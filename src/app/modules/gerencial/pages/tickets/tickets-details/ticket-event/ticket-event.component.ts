import { Component, inject, Input, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GetOneEvent, TimelineEvent, EventSponsor } from "../../../event/models/GetEventById.interface";
import { TicketsService } from "../../tickets.service";
import { EventDetailsGenericComponent } from "../../../../../shared/components/event-details/event-details.component";


@Component({
  selector: 'app-ticket-event',
  standalone: true,
  imports: [EventDetailsGenericComponent],
  templateUrl: './ticket-event.component.html',
  styleUrl: './ticket-event.component.scss'
})
export class TicketEventComponent {
  private activatedRoute = inject(ActivatedRoute);
  
  @Input() ticketId!: string | number;
    
  eventData = signal<GetOneEvent | undefined>(undefined);
  timelineEvent = signal<TimelineEvent[]>([]);
  sponsors = signal<EventSponsor[]>([]);

  ngOnInit(): void {
    const eventId = this.activatedRoute.snapshot.paramMap.get('id');
    if(eventId) {
      this.ticketId = eventId;
    }
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

  toggleFavorite(data: any) {
    console.log(data)
  }
}
