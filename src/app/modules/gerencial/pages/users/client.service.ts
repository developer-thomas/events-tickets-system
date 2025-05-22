import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Pagination } from '../../../shared/models/pagination.model';
import { Observable } from 'rxjs';
import { GetAllClients } from './models/GetAllClients.interface';
import { GetOneClient } from './models/GetOneClient.interface';

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

    return this.http.get<GetAllClients[]>(`${environment.api}/users`, { params });
  }

  getClientById(id: string):Observable<GetOneClient> {
    return this.http.get<GetOneClient>(`${this.api}/users/client/${id}`);
  }

  save(data: any) {
    return this.http.post(`${environment.api}/users`, data);
  }

  changeStatus(id: string) {
    return this.http.patch<ClientResponse>(`${environment.api}/users/${id}/status`, {});
  }

  updateClient(id: string, client: any): Observable<ClientResponse> {
    return this.http.patch<ClientResponse>(`${environment.api}/users/${id}`, client)
  }

  deleteClient(id: any): void {
    this.http.delete(`${environment.api}/users/${id}`)
  }
}

export type ClientResponse = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  birthdate: string;
  document: string;
  phone: string;
  avatar: string | null;
  canAccess: boolean;
  payment: string;
  addresses: ClientAddressDto[];
}

export type ClientAddressDto = {
  id: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
}
