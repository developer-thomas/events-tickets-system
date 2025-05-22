import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GetOneEvent } from '../../../../models/GetEventById.interface';

export interface ScheduleItem {
  date: string
  day: string
  time: string
  description: string
}

@Component({
  selector: 'app-event-schedule',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './event-schedule.component.html',
  styleUrl: './event-schedule.component.scss'
})
export class EventScheduleComponent {
  @Input() scheduleItems!: GetOneEvent | undefined | any;
}
