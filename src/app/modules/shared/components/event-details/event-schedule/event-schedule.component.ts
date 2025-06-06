import { Component, Input } from '@angular/core';
import { TimelineEvent } from '../models/GetEventById.interface';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-schedule',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './event-schedule.component.html',
  styleUrl: './event-schedule.component.scss'
})
export class EventScheduleComponent {
  @Input() scheduleItems!: TimelineEvent[];

  getFormattedDate(date: string | null | undefined): string {
    return date || new Date().toISOString();
  }
}
