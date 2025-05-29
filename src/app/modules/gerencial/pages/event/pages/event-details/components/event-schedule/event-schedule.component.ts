import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimelineEvent } from '../../../../models/GetEventById.interface';
import { CapitalizePipe } from '../../../../../../../shared/pipes/capitalize-pipe/capitalize-pipe.pipe';

@Component({
  selector: 'app-event-schedule',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './event-schedule.component.html',
  styleUrl: './event-schedule.component.scss'
})
export class EventScheduleComponent {
  @Input() scheduleItems!: TimelineEvent[];

  getFormattedDate(date: string | null | undefined): string {
    return date || new Date().toISOString();
  }
}
