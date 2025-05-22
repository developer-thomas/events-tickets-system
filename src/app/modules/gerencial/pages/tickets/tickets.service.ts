import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAllTickets } from './models/GetAllTickets.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private readonly api = environment.api;
  private http = inject(HttpClient);

  /**
   * Método para pegar todos os tickets
   * @returns 
   */
  getAllTickets():Observable<GetAllTickets[]> {
    return this.http.get<GetAllTickets[]>(`${this.api}/tickets`);
  }

  


}
