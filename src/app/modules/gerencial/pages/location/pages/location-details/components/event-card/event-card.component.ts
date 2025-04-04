import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
  @Input() event!: any;

  @Output() delete = new EventEmitter<number>()
  @Output() edit = new EventEmitter<number>()
  @Output() toggleActive = new EventEmitter<{ id: number; active: boolean }>()

  onDelete(): void {
    this.delete.emit(this.event.id)
  }

  onEdit(): void {
    this.edit.emit(this.event.id)
  }

  onToggle(event: any): void {
    this.toggleActive.emit({
      id: this.event.id,
      active: event.checked,
    })
  }
}
