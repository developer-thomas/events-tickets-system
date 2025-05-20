import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAllEvents } from './models/GetAllEvents.interface';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly api = environment.api;
  private http = inject(HttpClient);

  getAllEvents(page = 10, skip = 1, search?: string):Observable <GetAllEvents> {
    let params = new HttpParams()
      .set('page', page)
      .set('skip', skip)
    
    if(search) {
      params = params.set('search', search);
    }

    return this.http.get<GetAllEvents>(`${this.api}/events`, { params })
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/events/${id}`);
  }
}
