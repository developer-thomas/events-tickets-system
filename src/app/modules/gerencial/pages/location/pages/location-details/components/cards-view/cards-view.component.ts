import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { EventCardComponent } from '../event-card/event-card.component';
import { Router } from '@angular/router';
import { GetOneLocationEvent } from '../../../../models/GetLocationById.interface';

@Component({
  selector: 'app-cards-view',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './cards-view.component.html',
  styleUrl: './cards-view.component.scss'
})
export class CardsViewComponent {
  private router = inject(Router);
  @Input() events: GetOneLocationEvent[] | undefined= [];

  onDeleteEvent(id: number): void {
    console.log("Delete event:", id)
  }

  onEditEvent(id: number): void {
    console.log("Edit event:", id)
  }

  onToggleEvent(data: { id: number; active: boolean }): void {
    console.log("Toggle event:", data)
  }

  goToEventDetails(row: any) {
    this.router.navigate(['/gerencial/evento/', row.id])
  }
}
