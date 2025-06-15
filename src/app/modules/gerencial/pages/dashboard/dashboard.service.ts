import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData } from './models/Dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly api = environment.api;
  private http = inject(HttpClient);

  getDashboard(): Observable<DashboardData>{
    return this.http.get<DashboardData>(`${this.api}/dashboard`);
  }

}
