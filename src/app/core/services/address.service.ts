import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressReponse } from '../models/address';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private http: HttpClient) {}

  getAddress(zipCode: string): Observable<AddressReponse> {
    zipCode = zipCode.replace(/\D/g, '');
    return this.http.get<AddressReponse>(
      `https://brasilapi.com.br/api/cep/v1/${zipCode}`
    );
  }
}
