import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { GetAllCategories } from './models/GetAllCategories.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetOneCategory } from './models/GetOneCategory.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private readonly api = environment.api;
  private http = inject(HttpClient);

  getAll(): Observable<GetAllCategories[]> {
    return this.http.get<GetAllCategories[]>(`${this.api}/categories`);
  }

  create(formData: any): Observable<any> {
    return this.http.post<any>(`${this.api}/categories`, formData);
  }

  delete(categoryId: any): Observable<any> {
    return this.http.delete(`${this.api}/categories/${categoryId}`);
  }

  updateCategory(categoryId: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.api}/categories/${categoryId}`, data);
  }

  getOneCategory(categoryId: number): Observable<GetOneCategory> {
    return this.http.get<GetOneCategory>(`${this.api}/categories/${categoryId}`);
  }
}
