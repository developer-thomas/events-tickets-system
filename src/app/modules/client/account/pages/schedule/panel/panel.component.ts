import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  hasEvents: boolean
  eventTypes?: string[]
  isSelected?: boolean
}

interface WeekDay {
  dayNum: number
  dayName: string
  dayAbbr: string
  isSelected?: boolean
}

interface ScheduleEvent {
  id: number
  title: string
  location: string
  distance?: string
  date?: string
  time?: string
  quantity?: number
  status?: string
  price?: string
  timeSlot: string
  canBuy?: boolean
}

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {
  currentMonth = "Fevereiro"
  daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]

  calendarDays: CalendarDay[] = []

  weekDays: WeekDay[] = [
    { dayNum: 14, dayName: "Domingo", dayAbbr: "DOM" },
    { dayNum: 15, dayName: "Segunda", dayAbbr: "SEG" },
    { dayNum: 16, dayName: "Terça", dayAbbr: "TER", isSelected: true },
    { dayNum: 17, dayName: "Quarta", dayAbbr: "QUA" },
    { dayNum: 18, dayName: "Quinta", dayAbbr: "QUI" },
    { dayNum: 19, dayName: "Sexta", dayAbbr: "SEX" },
    { dayNum: 20, dayName: "Sábado", dayAbbr: "SAB" },
  ]

  timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  events: ScheduleEvent[] = [
    {
      id: 1,
      title: "Título do evento",
      location: "Nome do local",
      distance: "5 km de você",
      timeSlot: "10:00",
      canBuy: true,
    },
    {
      id: 2,
      title: "Título do evento",
      date: "00/00/00",
      time: "00:00",
      quantity: 5,
      status: "Em aberto",
      price: "R$ 00,00",
      location: "",
      timeSlot: "13:00",
    },
  ]

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.generateCalendarDays()
  }

  generateCalendarDays(): void {
    // This is a simplified version - in a real app, you would calculate the actual calendar days
    this.calendarDays = [
      { date: 1, isCurrentMonth: true, hasEvents: false },
      { date: 2, isCurrentMonth: true, hasEvents: false },
      { date: 3, isCurrentMonth: true, hasEvents: false },
      { date: 4, isCurrentMonth: true, hasEvents: false },
      { date: 5, isCurrentMonth: true, hasEvents: false },
      { date: 6, isCurrentMonth: true, hasEvents: false },
      { date: 7, isCurrentMonth: true, hasEvents: false },
      { date: 8, isCurrentMonth: true, hasEvents: false },
      { date: 9, isCurrentMonth: true, hasEvents: false },
      { date: 10, isCurrentMonth: true, hasEvents: false },
      { date: 11, isCurrentMonth: true, hasEvents: false },
      { date: 12, isCurrentMonth: true, hasEvents: false },
      { date: 13, isCurrentMonth: true, hasEvents: false },
      { date: 14, isCurrentMonth: true, hasEvents: false },
      { date: 15, isCurrentMonth: true, hasEvents: false },
      { date: 16, isCurrentMonth: true, hasEvents: true, isSelected: true },
      { date: 17, isCurrentMonth: true, hasEvents: true, eventTypes: ["primary"] },
      { date: 18, isCurrentMonth: true, hasEvents: true, eventTypes: ["secondary"] },
      { date: 19, isCurrentMonth: true, hasEvents: true, eventTypes: ["tertiary"] },
      { date: 20, isCurrentMonth: true, hasEvents: false },
      { date: 21, isCurrentMonth: true, hasEvents: false },
      { date: 22, isCurrentMonth: true, hasEvents: false },
      { date: 23, isCurrentMonth: true, hasEvents: false },
      { date: 24, isCurrentMonth: true, hasEvents: false },
      { date: 25, isCurrentMonth: true, hasEvents: false },
      { date: 26, isCurrentMonth: true, hasEvents: false },
      { date: 27, isCurrentMonth: true, hasEvents: false },
      { date: 28, isCurrentMonth: true, hasEvents: false },
    ]
  }

  previousMonth(): void {
    // Implement previous month logic
    console.log("Navigate to previous month")
  }

  nextMonth(): void {
    // Implement next month logic
    console.log("Navigate to next month")
  }

  selectDay(day: CalendarDay): void {
    this.calendarDays.forEach((d) => (d.isSelected = false))
    day.isSelected = true
    // Update the weekly view based on the selected day
  }

  buyTicket(eventId: number): void {
    console.log("Buy ticket for event:", eventId)
    // Navigate to ticket purchase page
    // this.router.navigate(['/event', eventId, 'buy']);
  }

  viewEvent(eventId: number): void {
    console.log("View event:", eventId)
    // Navigate to event details page
    // this.router.navigate(['/event', eventId]);
  }

  getEventForTimeSlot(timeSlot: string): ScheduleEvent | undefined {
    return this.events.find((event) => event.timeSlot === timeSlot)
  }
}
