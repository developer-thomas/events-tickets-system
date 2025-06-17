import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { GetAllCategories } from './models/GetAllCategories.interface';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private readonly api = environment.api;
  private http = inject(HttpClient);

  getAll(page = 10, skip = 1, search?: string): Observable<GetAllCategories[]> {
    let params = new HttpParams()
    .set('page', page)
    .set('skip', skip)
  
  if(search) {
    params = params.set('search', search);
  }
  
    return this.http.get<GetAllCategories[]>(`${this.api}/categories`, { params });
  }

  create(formData: any): Observable<any> {
    return this.http.post<any>(`${this.api}/categories`, formData);
  }

  delete(categoryId: any): Observable<any> {
    return this.http.delete(`${this.api}/categories/${categoryId}`);
  }
}
