import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { GetAllLocation, LocationListResponse, UserLocation } from './models/GetAllLocations.interface';
import { ApiResponse } from './models/GetOneLocations.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountHomeService {
  private readonly api = environment.api;
  private http = inject(HttpClient);

  private cachedLocations: GetAllLocation[] = [];

  /**
   * Método para obter todos os locais
   * @returns Retorna todos os locais
   */
  getAll(): Observable<LocationListResponse> {
    return this.http.get<LocationListResponse>(`${this.api}/places`).pipe(
      tap((res) => {
        this.cachedLocations = res.result; // salva os locais em cache
      })
    );
  }
  /**
   * Método para armazenar o retorno da api em uma propriedade local
   * @returns Retorna os locais armazenados em cachê
   */
  getCachedLocations(): GetAllLocation[] {
    return this.cachedLocations;
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
            localStorage.setItem("userLat", latLng.lat)
            localStorage.setItem("userLng", latLng.lng)
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

  /**
   * Obtém a distância entre duas localizações
   */
  getDistance(
    origin: { userLat: string, userLng: string },
    destination: { lat: string, lng: string }
  ): Observable<number> {
    const params = new HttpParams()
      .set('origin', `${origin.userLat},${origin.userLng}`)
      .set('destination', `${destination.lat},${destination.lng}`);
  
    return this.http.get<{ distance: number }>(`${this.api}/maps/places/directions`, { params })
      .pipe(
        map(res => res.distance)
      );
  }


}
