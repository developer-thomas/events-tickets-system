import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface favoriteStatus {
  status: 'removed' | 'added';
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private readonly api = environment.api;
  private http = inject(HttpClient);

  getFavorites(userId: any): Observable<any> {
    return this.http.get<any>(`${this.api}/favorites/by/user/${userId}`)
  }

  favoriteAnEvent(data: { eventId: number, userId: number }): Observable<favoriteStatus> {
    return this.http.post<favoriteStatus>(`${this.api}/favorites/favorite/toggle`, data)
  }

}
