import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterTableComponent } from '../../../../../../../../shared/components/filter-table/filter-table.component';
import { GetOneLocationEvent } from '../../../../models/GetOneLocations.interface'

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FilterTableComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() events: GetOneLocationEvent[] | undefined = []
  @Input() eventTypes: string[] = []

  @Output() filterChange = new EventEmitter<string>()
  @Output() favoriteToggle = new EventEmitter<Event>()

  onFilter(searchTerm: string): void {
    this.filterChange.emit(searchTerm)
  }

  toggleFavorite(event: any): void {
    // this.favoriteToggle.emit(event)
    console.log(event)
  }

  navigateToEventDetail(eventId: number): void {
    this.router.navigate(['event', eventId], { relativeTo: this.route });

  }
}
