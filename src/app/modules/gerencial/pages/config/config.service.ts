import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Pagination } from '../../../shared/models/pagination.model';
import { Observable } from 'rxjs';
import { GetAllCollaborators } from './models/GetAllCollaborators.interface';

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
    return this.http.get<ConfigResponse>(`${environment.api}/admin/${id}`);
  }

  public getPermissions() {
    return this.http.get<ConfigPermissionResponse[]>(`${environment.api}/admin/permissions`);
  }

  public save(data: any) {
    return this.http.post(`${environment.api}/admin`, data);
  }

  public updateStatus(id: string) {
    return this.http.patch(`${environment.api}/admin/${id}/status`, {});
  }
}

export type ConfigResponse = {
  id: string;
  email: string;
  active: boolean;
  name: string;
  cpf: string;
  permissions: string[];
}

export type ConfigPermissionResponse = {
  id: any;
  title: string;
  checked: boolean;
}
