import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAllTickets } from '../../../../core/models/tickets/GetAllTickets.interface';
import { GetOneTicket } from '../event/models/GetEventById.interface';
import { BaseResponse } from '../../../../core/models/base/base-response';

export interface GetAllTicketsParams {
  page?: number;
  size?: number;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private readonly api = environment.api;
  private http = inject(HttpClient);

  /**
   * Método para pegar todos os tickets (paginação no servidor)
   */
  getAllTickets(params?: GetAllTicketsParams): Observable<BaseResponse<GetAllTickets>> {
    let httpParams = new HttpParams();
    if (params?.page != null) httpParams = httpParams.set('page', params.page.toString());
    if (params?.size != null) httpParams = httpParams.set('size', params.size.toString());
    if (params?.search != null && params.search.trim() !== '') httpParams = httpParams.set('search', params.search.trim());
    return this.http.get<BaseResponse<GetAllTickets>>(`${this.api}/admin/tickets`, { params: httpParams });
  }

  /**
   * Método para pegar ingresso pelo ID
   * @param ticketId ID do ingresso
   */
  getOneTicket(ticketId: any): Observable<GetOneTicket> {
    return this.http.get<GetOneTicket>(`${this.api}/admin/ticket/detail/${ticketId}`);
  }
  

}
