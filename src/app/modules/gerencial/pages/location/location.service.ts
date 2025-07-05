import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AllLocations, GetAllLocations } from './models/GetAllLocations.interface';
import { GetCategoriesNames } from './models/GetCategories.interface';
import { CreateRepresentante } from './models/CreateRepresentante.interface';
import { CreateLocation } from './models/CreateLocation.interface'
import { GetOneLocationResponse } from './models/GetLocationById.interface';
import { GetRepresentativeByIdResponse } from './models/GetRepresentativeById.interface';
import { LocationByRepresentative } from '../event/models/GetEventsByRepresentative.interface';
@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly api = environment.api
  private http = inject(HttpClient)

  getAllLocations(): Observable<AllLocations[]> {
    return this.http.get<AllLocations[]>(`${environment.api}/admin/places`);
  }

  /**
   * Método para pegar as categorias e listar na criação de um local
   */
  getCategoriesNames(): Observable<GetCategoriesNames[]> {
    return this.http.get<GetCategoriesNames[]>(`${this.api}/categories`).pipe(
      map((res) => {
        return res.map((cat) => ({
          id: cat.id,
          name: cat.name,
        }))
      }),
    )
  }

  /**
   * Método do primeiro step para criação de local usando FormData (multipart/form-data)
   */
  createLocation(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.api}/places`, formData)
  }

  /**
   * Método alternativo se você quiser enviar como JSON (sem arquivos)
   */
  createLocationJSON(data: CreateLocation): Observable<any> {
    return this.http.post<any>(`${this.api}/places`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
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

  /**
   * Método do segundo step para editar um representante
   */
  updateRepresentante(data: CreateRepresentante): Observable<any> {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      cpf_cnpj: data.cpf_cnpj,
    }
    return this.http.patch<CreateRepresentante>(`${this.api}/admin/representative/${data.id}`, payload)
  }

  /**
   * Método para pegar um representante pelo ID
   * @param representativeId id do representanteq
   */
  getRepresentativeById(representativeId: number): Observable<GetRepresentativeByIdResponse> {
    return this.http.get<GetRepresentativeByIdResponse>(`${this.api}/users/representative/${representativeId}`);
  }

  /**
   * Rota para pegar um local pelo ID
   * @param locationId id do local
   * @returns
   */
  getLocationById(locationId: any): Observable<GetOneLocationResponse> {
    return this.http.get<GetOneLocationResponse>(`${this.api}/places/${locationId}`)
  }

  /**
   * Método para upload de imagem individual (se necessário)
   */
  uploadImage(file: File, type: "cover" | "logo"): Observable<any> {
    const formData = new FormData()
    formData.append("image", file, file.name)
    formData.append("type", type)

    return this.http.post<any>(`${this.api}/upload/image`, formData)
  }
  /**
   * Deleta um local
   */
  deleteLocation(locationId: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/places/${locationId}`)
  }

  /**
   * @param id id do local
   */
  editLocation(locationId: number, data: FormData): Observable<any> {
    return this.http.put<any>(`${this.api}/places/${locationId}`, data)
  }

  /**
   * Busca locais por representante
   */
  getLocationsByRepresentative(userId: number): Observable<LocationByRepresentative> {
    return this.http.get<LocationByRepresentative>(`${this.api}/admin/events/resentative/${userId}`);
  }

  // editRepresentative(representativeId: number, data: any): Observable<any> {
  //   return this.http.put<any>(`${this.api}/`)
  // }
}
