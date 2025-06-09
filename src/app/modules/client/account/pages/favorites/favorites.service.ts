import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private readonly api = environment.api;
  private http = inject(HttpClient);

  getFavorites(userId: any): Observable<any> {
    return this.http.get<any>(`${this.api}/favorites/by/user/${userId}`)
  }

}
