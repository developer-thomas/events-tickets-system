import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
  selector: 'app-cards-view',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './cards-view.component.html',
  styleUrl: './cards-view.component.scss'
})
export class CardsViewComponent {
  @Input() events: any[] = []

  onDeleteEvent(id: number): void {
    console.log("Delete event:", id)
    // Implement delete logic
  }

  onEditEvent(id: number): void {
    console.log("Edit event:", id)
    // Implement edit logic
  }

  onToggleEvent(data: { id: number; active: boolean }): void {
    console.log("Toggle event:", data)
    // Implement toggle logic
  }
}
