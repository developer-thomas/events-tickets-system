import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAllUserTicketsResponse } from './models/GetAllUserTickets.interface';
import { GetTicketByIdResponse } from './models/GetTicketById.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private http = inject(HttpClient);

  private readonly api = environment.api;

  /**
   * Métodos para recuperar todos os ingressos de um usuário através do token
   * @returns Retorna todos os ingressos de um usuário logado
   */
  public getUserTickets(): Observable<GetAllUserTicketsResponse> {
    return this.http.get<GetAllUserTicketsResponse>(`${this.api}/tickets/by/user`);
  }
  
  public getTicketById(ticketId: any): Observable<GetTicketByIdResponse> {
    return this.http.get<GetTicketByIdResponse>(`${this.api}/tickets/details/${ticketId}`)
  }
}
