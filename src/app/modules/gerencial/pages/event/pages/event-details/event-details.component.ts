import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { EventDetailsGenericComponent } from '../../../../../shared/components/event-details/event-details.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatSlideToggleModule, 
    EventDetailsGenericComponent  
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  
  eventId!: string | number;

  ngOnInit(): void {
    const eventId = this.activatedRoute.snapshot.paramMap.get('id');
    if(eventId) {
      this.eventId = eventId;
    }
  }

  deleteEvent(id: number): void {
    console.log("Delete event:", id)
  }

  editEvent(id: number): void {
    this.router.navigate(['/gerencial/evento/editar', id]);
  }

  changeEventStatus(id: any): void {
    console.log(id)
  }
}
