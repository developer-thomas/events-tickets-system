import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { GetAllClients } from './models/GetAllClients.interface';
import { GetClientResponse } from './models/GetOneClient.interface';
import { GetUserTicket } from './models/GetUserTickets.interface';
import { GetUserFinancial } from './models/GetUserFinancial.interface';

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

  getClientById(id: number):Observable<GetClientResponse> {
    return this.http.get<GetClientResponse>(`${this.api}/users/client/${id}`);
  }

  getUserTickets(userId: any):Observable<GetUserTicket[]> {
    let params = new HttpParams().set(userId, 'userId');
    return this.http.get<GetUserTicket[]>(`${this.api}/admin/tickets`, { params })
  }

  changeStatus(userId: number) {
    return this.http.post<any>(`${environment.api}/users/toggle/status/${userId}`, {});
  }

  deleteClient(id: any): void {
    this.http.delete(`${environment.api}/users/${id}`)
  }

  getEventById(id: any): Observable<any> {
    return this.http.get<any>(`${this.api}/events/${id}`);
  }

  getUserFinancial(userId: number): Observable<GetUserFinancial[]> {
    return this.http.get<GetUserFinancial[]>(`${this.api}/admin/user/${userId}/financial`);
  }

}
