import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GetOneEvent } from '../../../../models/GetEventById.interface';
import { EventService } from '../../../../event.service';

export interface EventHeaderData {
  id: number
  title: string
  location: string
  price: string
  dateRange: string
  image: string
  description: string
  active: boolean
  sponsorLogo?: string
}

@Component({
  selector: 'app-event-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './event-header.component.html',
  styleUrl: './event-header.component.scss'
})
export class EventHeaderComponent implements OnChanges {
  private eventService = inject(EventService);
  
  @Input() eventId: any;
  @Input() eventData!: GetOneEvent | any;

  @Output() delete = new EventEmitter<number>()
  @Output() edit = new EventEmitter<number>()
  @Output() toggleActive = new EventEmitter<{ id: number; active: boolean }>()

  onDelete(): void {
    this.delete.emit(this.eventData.id)
  }

  onEdit(): void {
    this.edit.emit(this.eventData.id)
  }

  onToggleActive(event: any): void {
    this.toggleActive.emit({
      id: this.eventData.id,
      active: event.checked,
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('oi', this.eventData)
  }


}
