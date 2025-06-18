import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { EventService } from '../../../../gerencial/pages/event/event.service';
import { GetOneEvent } from '../models/GetEventById.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-header',
  standalone: true,
  imports: [MatIconModule, MatSlideToggle, CommonModule],
  templateUrl: './event-header.component.html',
  styleUrl: './event-header.component.scss'
})
export class EventHeaderComponent {
  private eventService = inject(EventService);
  
  @Input() eventId: any;
  @Input({ required: true }) eventData!: GetOneEvent | any;
  @Input() useActionButtons: boolean = true;
  @Input() useClientButtons: boolean = false;
  @Input() isFavorite: boolean = false;
  // Ações do usuário admin
  @Output() delete = new EventEmitter<number>()
  @Output() edit = new EventEmitter<number>()
  @Output() toggleActive = new EventEmitter<{ id: number; active: boolean }>()

  // Ações do usuário client
  @Output() shareEvent = new EventEmitter<any>();
  @Output() favoriteEvent = new EventEmitter<any>();
  @Output() buyTicket = new EventEmitter<any>();

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

  onShareEvent() {
    this.shareEvent.emit(this.eventId);
  }

  onToggleFavorite() {
    this.isFavorite = !this.isFavorite;
    this.favoriteEvent.emit(this.eventId);
  }

  onBuyTicket() {
    this.buyTicket.emit(this.eventData);
  }


}
