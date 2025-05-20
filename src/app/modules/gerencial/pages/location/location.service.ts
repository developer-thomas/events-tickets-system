import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { GetAllLocations } from './models/GetAllLocations.interface';
import { GetCategoriesNames } from './models/GetCategories.interface';
import { CreateRepresentante } from './models/CreateRepresentante.interface';
import { CreateLocation } from './models/CreateLocation.interface'
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private readonly api = environment.api;
  private http = inject(HttpClient);

  getAllLocations(page = 10, skip = 1, search?: string):Observable <GetAllLocations> {
    let params = new HttpParams()
      .set('page', page)
      .set('skip', skip)
    
    if(search) {
      params = params.set('search', search);
    }

    return this.http.get<GetAllLocations>(`${environment.api}/places`, { params })
  }

  /**
   * Método para pegar as categorias e listar na criação de um local
   */

  getCategoriesNames():Observable<GetCategoriesNames[]> {
    return this.http.get<GetCategoriesNames[]>(`${this.api}/categories`).pipe(
      map((res) => {
        return res.map((cat) => ({
          id: cat.id,
          name: cat.name
        }))
      })
    )
  }

  /**
   * Método do primeiro step para criação de local, multipart form data
   */

  createLocation(data: CreateLocation): Observable<any> {
    return this.http.post<any>(`${this.api}/places`, data)
  }

  /**
   * Método do segundo step para criar um representante e associá-lo a um local
   */
  createRepresentante(data: CreateRepresentante): Observable<any> {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      cpf_cnpj: data.cpf_cnpj,
      placeId: data.placeId,
      phone: data.phone,
    }
    return this.http.post<CreateRepresentante>(`${this.api}/users/representative`, payload)
  }
}
