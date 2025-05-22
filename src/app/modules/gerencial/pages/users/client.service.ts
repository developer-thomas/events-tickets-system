import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Pagination } from '../../../shared/models/pagination.model';
import { Observable } from 'rxjs';
import { GetAllClients } from './models/GetAllClients.interface';
import { GetClientResponse } from './models/GetOneClient.interface';
import { GetUserTicket } from './models/GetUserTickets.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private readonly api = environment.api;
  private http = inject(HttpClient);

  getClients(page?: number, size?: number, search?: string): Observable<GetAllClients[]> {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page);
    }
    if (size) {
      params = params.append('size', size);
    }
    if (search) {
      params = params.append('search', search);
    }

    return this.http.get<GetAllClients[]>(`${this.api}/users`, { params });
  }

  getClientById(id: string):Observable<GetClientResponse> {
    return this.http.get<GetClientResponse>(`${this.api}/users/client/${id}`);
  }

  getUserTickets(userId: any):Observable<GetUserTicket[]> {
    let params = new HttpParams().set(userId, 'userId');
    return this.http.get<GetUserTicket[]>(`${this.api}/admin/tickets`, { params })
  }


  // save(data: any) {
  //   return this.http.post(`${environment.api}/users`, data);
  // }

  // changeStatus(id: string) {
  //   return this.http.patch<ClientResponse>(`${environment.api}/users/${id}/status`, {});
  // }

  // updateClient(id: string, client: any): Observable<ClientResponse> {
  //   return this.http.patch<ClientResponse>(`${environment.api}/users/${id}`, client)
  // }

  deleteClient(id: any): void {
    this.http.delete(`${environment.api}/users/${id}`)
  }

  getEventById(id: any): Observable<any> {
    return this.http.get<any>(`${this.api}/events/${id}`);
  }


}
