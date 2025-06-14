import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { GetAllCollaborators } from './models/GetAllCollaborators.interface';
import { GetAllCollaboratorById } from './models/GetCollaboratorById.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly api = environment.api;
  private http = inject(HttpClient);

  public getAll(page: number = 1, size: number = 10, search?: string): Observable<GetAllCollaborators[]> {
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

    return this.http.get<GetAllCollaborators[]>(`${this.api}/access`, { params });
  }

  public getById(id: string) {
    return this.http.get<GetAllCollaboratorById>(`${environment.api}/admin/${id}`);
  }

  public save(data: any) {
    return this.http.post(`${environment.api}/users/collaborator`, data);
  }

  public updateStatus(id: string) {
    return this.http.patch(`${environment.api}/admin/${id}/status`, {});
  }

}


