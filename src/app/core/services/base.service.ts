import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export type Response<T> = {
  data: T[];
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
  page: number;
};
@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  protected readonly BASE_URL: string = '';
  protected readonly paginateParam: any;
  constructor(protected http: HttpClient) {}

  findAll(search?: string, page?: number, limit?: number): Observable<Response<T>> {
    let params: HttpParams = new HttpParams();

    if(search) params = params.append('name', search);
    if(this.paginateParam) params = params.append('paginate', this.paginateParam);
    if(limit) params = params.append('limit', limit);
    if(page) params = params.append('page', page);

    return this.http.get<Response<T>>(`${environment.api}/${this.BASE_URL}`, {
      params,
    });
  }

  create(body: T): Observable<T> {
    return this.http.post<T>(`${environment.api}/${this.BASE_URL}`, body);
  }

  findById(id: number | string): Observable<T> {
    return this.http.get<T>(`${environment.api}/${this.BASE_URL}/${id}`);
  }

  delete(id: number): Observable<T> {
    return this.http.delete<T>(`${environment.api}/${this.BASE_URL}/${id}`);
  }

  update(id: number, body: Partial<T>): Observable<T> {
    return this.http.put<T>(
      `${environment.api}/${this.BASE_URL}/${id}`,
      body
    );
  }

  updatePatch(id: number | string, body: Partial<T>): Observable<T> {
    return this.http.patch<T>(
      `${environment.api}/${this.BASE_URL}/${id}`,
      body
    );
  }
}
