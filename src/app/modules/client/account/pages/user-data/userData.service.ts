import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateAddress } from './models/CreateAddress.interface';

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

  getUserAddress(userId: number): Observable<any> {
    return this.http.get<any>(`${this.api}/address/by/user/${userId}`);
  }

}
