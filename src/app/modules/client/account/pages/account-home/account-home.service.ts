import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocationListResponse, UserLocation } from './models/GetAllLocations.interface';
import { ApiResponse } from './models/GetOneLocations.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountHomeService {
  private readonly api = environment.api;
  private http = inject(HttpClient);
  /**
   * Método para obter todos os locais
   * @returns Retorna todos os locais
   */
  getAll(): Observable<LocationListResponse> {
    return this.http.get<LocationListResponse>(`${this.api}/places`)
  }

  /**
   * 
   * @param locationId ID do local
   * @returns Retorna um local pelo ID
   */
  getLocationById(locationId: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.api}/places/${locationId}`);
  }

  /**
   * Obtem a localização do usuário através do navegador
   */
  getUserLocation(): Observable<UserLocation> {
    return new Observable(observer => {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latLng: UserLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            observer.next(latLng);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocalização não suportada neste navegador.');
      }
    });
  }

}
