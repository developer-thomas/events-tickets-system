import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { GetAllClients } from '../../../../core/models/users/GetAllClients.interface';
import { GetClientResponse } from '../../../../core/models/users/GetOneClient.interface';
import { GetUserTicket } from '../../../../core/models/users/GetUserTickets.interface';
import { GetUserFinancial } from '../../../../core/models/users/GetUserFinancial.interface';
import { BaseResponse } from '../../../../core/models/base/base-response';

export interface GetClientsParams {
  page?: number;
  size?: number;
  search?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private readonly api = environment.api;
  private http = inject(HttpClient);

  getClients(params?: GetClientsParams): Observable<BaseResponse<GetAllClients>> {
    let httpParams = new HttpParams();
    if (params?.page != null) httpParams = httpParams.set('page', params.page.toString());
    if (params?.size != null) httpParams = httpParams.set('size', params.size.toString());
    if (params?.search != null && params.search.trim() !== '') httpParams = httpParams.set('search', params.search.trim());
    return this.http.get<BaseResponse<GetAllClients>>(`${this.api}/users`, { params: httpParams });
  }

  getClientById(id: number):Observable<GetClientResponse> {
    return this.http.get<GetClientResponse>(`${this.api}/users/client/${id}`);
  }

  getUserTickets(userId: any):Observable<GetUserTicket[]> {
    let params = new HttpParams().set('userId', userId);
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
