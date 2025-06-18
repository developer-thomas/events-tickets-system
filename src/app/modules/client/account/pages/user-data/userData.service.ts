import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateAddress, GetUserAddress } from './models/CreateAddress.interface';

export interface UpdateUser {
  name?: string;
  email?: string;
  password?: string;
  cpf_cnpj?: string;
  phone?: string;
  dateOfBirth?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private readonly api = environment.api;
  private http = inject(HttpClient);

  /**
   * Cadastrar endereço de usuário logado
   */
  registerAddress(data: CreateAddress): Observable<any> {
    return this.http.post<any>(`${this.api}/address`, data);
  }

  getUserAddress(userId: number): Observable<GetUserAddress[]> {
    return this.http.get<GetUserAddress[]>(`${this.api}/address/by/user/${userId}`);
  }

  updateUser(data: UpdateUser): Observable<any> {
    return this.http.patch<any>(`${this.api}/users/client`, data);
  }


}
