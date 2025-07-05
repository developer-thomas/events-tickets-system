import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ScheduleService } from '../schedule.service';
import { forkJoin } from 'rxjs';
import { AccountHomeService } from '../../account-home/account-home.service';
import { CartRequest } from '../../account-home/models/AddToCart.interface';
import { ToastrService } from 'ngx-toastr';

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  eventTypes: Array<"favorite" | "purchased">
}

interface WeekDay {
  date: Date
  dayNumber: string
  dayName: string
}

interface ScheduleEvent {
  id: number
  title: string
  date: string // YYYY-MM-DD
  timeSlot: string // HH:mm
  location?: string
  price?: string
  distance?: number
  eventDate?: string
  quantity?: number
  isFavorite: boolean
  isPurchased: boolean
  canBuy: boolean
}

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent implements OnInit {
  private scheduleService = inject(ScheduleService);
  private router = inject(Router);
  private accountHomeService = inject(AccountHomeService);
  private toastr = inject(ToastrService);

  daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]
  monthNamesPortuguese = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  dayNamesPortuguese = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]

  timeSlots = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ]
  rawEvents: ScheduleEvent[] = []

  currentYear!: number
  currentMonth!: number // zero-based
  selectedDate!: Date

  calendarDays: CalendarDay[] = []
  eventsByTime: { [time: string]: ScheduleEvent[] } = {}

  ngOnInit(): void {
    const today = new Date()
    this.currentYear = today.getFullYear()
    this.currentMonth = today.getMonth()
    this.selectedDate = today

    this.loadAllEvents()
  }

  loadAllEvents(): void {
    forkJoin({
      allEvents: this.scheduleService.getAllEvents(),
      user: this.scheduleService.getFavoritesByUser(),
      tickets: this.scheduleService.userTickets(),
    }).subscribe({
      next: ({ allEvents, user, tickets }) => {
        console.log("API Response:", { allEvents, user, tickets })

        const favoriteIds = new Set(user.favorites?.map((f) => f.eventId) || [])
        const purchasedIds = new Set(tickets.data?.map((t) => t.eventId) || [])

        this.rawEvents = []

        for (const event of allEvents.result || []) {
          // Verificar se o evento tem timeline
          if (!event.timelineEvent || event.timelineEvent.length === 0) {
            // Se não tem timeline, criar um evento baseado na data do evento
            const eventDate = new Date(event.eventDate)
            const dateStr = eventDate.toISOString().split("T")[0]

            this.rawEvents.push({
              id: event.id,
              title: event.name,
              date: dateStr,
              timeSlot: "09:00",
              location: event.eventLocation?.name || "Local não informado",
              price: `R$ ${Number.parseFloat(event.value).toFixed(2).replace(".", ",")}`,
              distance: this.calculateDistance(event.eventLocation?.addressLocation),
              eventDate: this.formatEventDate(eventDate),
              quantity: event.numberOfTickets,
              isFavorite: favoriteIds.has(event.id),
              isPurchased: purchasedIds.has(event.id),
              canBuy: !purchasedIds.has(event.id) && event.numberOfTickets > 0,
            })
          } else {
            // Se tem timeline, processar cada item
            for (const timeline of event.timelineEvent) {
              if (!timeline.date) continue

              const timelineDate = new Date(timeline.date)
              const dateStr = timelineDate.toISOString().split("T")[0]

              // Garantir que o horário está no formato correto
              let timeSlot = "09:00"
              if (timeline.hourInit) {
                timeSlot = timeline.hourInit.slice(0, 5)
              }

              this.rawEvents.push({
                id: event.id,
                title: event.name,
                date: dateStr,
                timeSlot: timeSlot,
                location: event.eventLocation?.name || "Local não informado",
                price: `R$ ${Number.parseFloat(event.value).toFixed(2).replace(".", ",")}`,
                distance: this.calculateDistance(event.eventLocation?.addressLocation),
                eventDate: this.formatEventDate(timelineDate, timeline.hourInit),
                quantity: event.numberOfTickets,
                isFavorite: favoriteIds.has(event.id),
                isPurchased: purchasedIds.has(event.id),
                canBuy: !purchasedIds.has(event.id) && event.numberOfTickets > 0,
              })
            }
          }
        }

        console.log("Processed events:", this.rawEvents)

        this.loadCalendar()
        this.refreshEvents()
      },
      error: (err) => {
        console.error("Erro ao carregar dados do calendário:", err)
      },
    })
  }

  calculateDistance(addressLocation: any): number {
    // Implementar cálculo de distância real baseado na localização do usuário
    // Por enquanto, retornar um valor aleatório entre 1 e 10
    return Math.floor(Math.random() * 10) + 1
  }

  formatEventDate(date: Date, time?: string): string {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear().toString().slice(-2)
    const timeStr = time ? time.slice(0, 5) : "00:00"

    return `${day}/${month}/${year} | ${timeStr}`
  }

  getMonthNameInPortuguese(monthIndex: number): string {
    return this.monthNamesPortuguese[monthIndex]
  }

  getWeekDays(): WeekDay[] {
    const weekDays: WeekDay[] = []
    const startOfWeek = new Date(this.selectedDate)

    // Encontrar o início da semana (domingo)
    const dayOfWeek = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek)

    for (let i = 1; i < 7; i++) {
      // Pular domingo, mostrar apenas seg-sab
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)

      weekDays.push({
        date: day,
        dayNumber: day.getDate().toString(),
        dayName: this.dayNamesPortuguese[day.getDay()],
      })
    }

    return weekDays
  }

  isSelectedWeekDay(index: number): boolean {
    if (index === -1) return false // "Semana" não é selecionável

    const weekDays = this.getWeekDays()
    if (index >= weekDays.length) return false

    const weekDay = weekDays[index]
    return weekDay.date.toDateString() === this.selectedDate.toDateString()
  }

  selectWeekDay(date: Date): void {
    this.selectedDate = new Date(date)
    this.currentYear = date.getFullYear()
    this.currentMonth = date.getMonth()
    this.loadCalendar()
    this.refreshEvents()
  }

  loadCalendar() {
    const first = new Date(this.currentYear, this.currentMonth, 1)
    const last = new Date(this.currentYear, this.currentMonth + 1, 0)
    const firstWeekDay = first.getDay()
    const daysInMonth = last.getDate()

    this.calendarDays = []

    // Preenchimento anterior
    for (let i = 0; i < firstWeekDay; i++) {
      this.calendarDays.push({
        date: 0,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        eventTypes: [],
      })
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(this.currentYear, this.currentMonth, d)
      const isToday = dt.toDateString() === new Date().toDateString()
      const isSelected = dt.toDateString() === this.selectedDate.toDateString()
      const eventTypes = this.getEventTypesForDate(dt)
      this.calendarDays.push({
        date: d,
        isCurrentMonth: true,
        isToday,
        isSelected,
        eventTypes,
      })
    }
  }

  getEventTypesForDate(d: Date): Array<"favorite" | "purchased"> {
    const dateStr = d.toISOString().split("T")[0]
    const eventsForDate = this.rawEvents.filter((e) => e.date === dateStr)

    const types: Array<"favorite" | "purchased"> = []

    if (eventsForDate.some((e) => e.isFavorite)) {
      types.push("favorite")
    }

    if (eventsForDate.some((e) => e.isPurchased)) {
      types.push("purchased")
    }

    return types
  }

  selectDay(day: CalendarDay) {
    if (!day.isCurrentMonth) return

    this.calendarDays.forEach((d) => (d.isSelected = false))
    day.isSelected = true
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day.date)
    this.refreshEvents()
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11
      this.currentYear--
    } else {
      this.currentMonth--
    }
    this.loadCalendar()
    this.refreshEvents()
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0
      this.currentYear++
    } else {
      this.currentMonth++
    }
    this.loadCalendar()
    this.refreshEvents()
  }

  refreshEvents() {
    const selStr = this.selectedDate.toISOString().split("T")[0]
    const eventsForDay = this.rawEvents.filter((e) => e.date === selStr)

    // Coletar todos os horários únicos dos eventos do dia
    const allTimeSlots = new Set<string>()

    // Adicionar os horários padrão
    this.timeSlots.forEach((slot) => allTimeSlots.add(slot))

    // Adicionar horários dos eventos que não estão na lista padrão
    eventsForDay.forEach((event) => {
      allTimeSlots.add(event.timeSlot)
    })

    // Converter para array e ordenar
    const sortedTimeSlots = Array.from(allTimeSlots).sort((a, b) => {
      const timeA = a.split(":").map(Number)
      const timeB = b.split(":").map(Number)
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
    })

    // Atualizar a lista de time slots dinamicamente
    this.timeSlots = sortedTimeSlots

    // Inicializar todos os time slots
    this.eventsByTime = {}
    this.timeSlots.forEach((ts) => {
      this.eventsByTime[ts] = []
    })

    // Adicionar eventos aos time slots correspondentes
    eventsForDay.forEach((event) => {
      if (this.eventsByTime[event.timeSlot]) {
        this.eventsByTime[event.timeSlot].push(event)
      } else {
        this.eventsByTime[event.timeSlot] = [event]
      }
    })

    console.log("Time slots for selected day:", this.timeSlots)
    console.log("Events by time:", this.eventsByTime)
  }

  getEventStatusText(event: ScheduleEvent): string {
    if (event.isPurchased) return "Comprado"
    if (event.isFavorite) return "Favorito"
    return "Em aberto"
  }

  buyTicket(ticket: any) {
    const payload: CartRequest = {
      item: {
        eventId: ticket.id,
        quantity: 1,
        value: ticket.value
      }
    }

    this.accountHomeService.addItemsToCart(payload).subscribe({
      next: (_) => {
        this.toastr.success("Ingresso adicionado ao carrinho");
        this.router.navigate(['client/inicio']);
      }
    })
  }

  hasEventsAtTime(time: string): boolean {
    return this.eventsByTime[time] && this.eventsByTime[time].length > 0
  }

  getTotalEventsForDay(): number {
    return Object.values(this.eventsByTime).reduce((total, events) => total + events.length, 0)
  }
}
