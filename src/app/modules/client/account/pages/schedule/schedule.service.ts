import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetTicketsByUser } from './models/GetTicketsByUser.interface';

interface LoggedUser {
  id: number;
  favorites: {
    eventId: number;
  }[]
}

export interface Category {
  id: number
  name: string
}

export interface AddressLocation {
  lat: number
  lng: number
  placeId: string
}

export interface EventLocation {
  id: number
  name: string
  description: string
  addressLocation: AddressLocation
}

export interface TimelineEvent {
  id?: number
  title?: string
  description?: string
  date?: Date
  hourInit: string;
}

export interface EventsResult {
  id: number
  name: string
  description: string
  value: string
  eventDate: string
  fileUrl: string | null
  numberOfTickets: number
  active: boolean
  categories: Category[]
  timelineEvent: TimelineEvent[]
  eventLocation: EventLocation
  isFavorite: boolean
}

export interface GetAllEvents {
  status: number
  result: EventsResult[]
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private http = inject(HttpClient);
  private readonly api = environment.api;

  getAllEvents(): Observable<GetAllEvents> {
    return this.http.get<GetAllEvents>(`${this.api}/events`)
  }

  getFavoritesByUser(): Observable<LoggedUser> {
    return this.http.get<LoggedUser>(`${this.api}/auth/me`)
  }

  userTickets(): Observable<GetTicketsByUser> {
    return this.http.get<GetTicketsByUser>(`${this.api}/tickets/by/user`)
  }

}
