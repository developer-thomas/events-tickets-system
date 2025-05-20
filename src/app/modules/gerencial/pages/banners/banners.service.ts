import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { GetAllBanners } from './models/GetAllBanners.interface';
import { CreateBanner } from './models/CreateBanner.interface';
import { GetLocationsName, LocationResult } from './models/GetLocationsName.interface';

@Injectable({
  providedIn: 'root'
})
export class BannersService {
  private readonly api = environment.api
  private http = inject(HttpClient)

  getAll(page = 10, skip = 1, search?: string): Observable<GetAllBanners[]> {
    let params = new HttpParams().set("page", page).set("skip", skip)

    if (search) {
      params = params.set("search", search)
    }

    return this.http.get<GetAllBanners[]>(`${this.api}/banners`, { params })
  }

  getLocationsNames(): Observable<LocationResult[]> {
    return this.http.get<GetLocationsName>(`${this.api}/places`).pipe(
      map((res) => {
        return res.result.map((loc) => ({
          name: loc.name,
          id: loc.id,
        }))
      }),
    )
  }

  /**
   * Método para criar um novo banner usando multipart/form-data
   */
  create(data: any, file?: File): Observable<any> {
    console.log("Dados originais recebidos no serviço:", data)

    // Criar um objeto FormData para enviar como multipart/form-data
    const formData = new FormData()

    // Adicionar os campos de texto ao FormData
    formData.append("title", data.title)
    formData.append("eventLocationId", data.eventLocationId.toString())

    // Formatar e adicionar as datas
    const dateInit = this.formatDateToYYYYMMDD(data.dateInit)
    const dateFinish = this.formatDateToYYYYMMDD(data.dateFinish)

    formData.append("dateInit", dateInit)
    formData.append("dateFinish", dateFinish)

    // Adicionar o link do vídeo se existir
    if (data.videoLink) {
      formData.append("videoLink", data.videoLink)
    } else {
      formData.append("videoLink", "")
    }

    // Adicionar o arquivo se existir
    if (file) {
      formData.append("file", file, file.name)
      formData.append("fileKey", file.name)
    } else {
      formData.append("fileKey", "")
      formData.append("fileUrl", "")
    }

    console.log("FormData criado com sucesso")

    // Enviar o FormData para o backend
    return this.http.post<any>(`${this.api}/banners`, formData)
  }

  /**
   * Formata uma data de DD/MM/YY ou DD/MM/YYYY para YYYY/MM/DD
   */
  private formatDateToYYYYMMDD(dateString: string): string {
    console.log("Formatando data:", dateString)

    try {
      // Verificar se a data já está sem barras
      if (dateString.indexOf("/") === -1) {
        // Se a data já estiver sem barras, verificar o formato
        if (dateString.length === 8) {
          // Formato DDMMYYYY
          const day = dateString.substring(0, 2)
          const month = dateString.substring(2, 4)
          const year = dateString.substring(4, 8)
          return `${year}/${month}/${day}`
        } else {
          // Formato desconhecido, retornar com barras para garantir
          console.error("Formato de data sem barras desconhecido:", dateString)
          return dateString
        }
      }

      // Dividir a string da data em partes
      const parts = dateString.split("/")

      if (parts.length !== 3) {
        console.error("Formato de data inválido:", dateString)
        return dateString // Retornar a data original se o formato for inválido
      }

      let day = parts[0]
      let month = parts[1]
      let year = parts[2]

      // Garantir que o dia e o mês tenham 2 dígitos
      day = day.padStart(2, "0")
      month = month.padStart(2, "0")

      // Garantir que o ano tenha 4 dígitos
      if (year.length === 2) {
        year = `20${year}` // Assumir que anos de 2 dígitos são do século 21
      }

      // Montar a data no formato YYYY/MM/DD
      const formattedDate = `${year}/${month}/${day}`
      console.log("Data formatada:", formattedDate)

      return formattedDate
    } catch (error) {
      console.error("Erro ao formatar data:", error)
      // Em caso de erro, retornar a data original
      return dateString
    }
  }

  getById(id: number): Observable<GetAllBanners> {
    return this.http.get<GetAllBanners>(`${this.api}/banners/${id}`)
  }

  update(id: number, data: any, file?: File): Observable<any> {
    // Criar um objeto FormData para enviar como multipart/form-data
    const formData = new FormData()

    // Adicionar os campos de texto ao FormData
    formData.append("title", data.title)
    formData.append("eventLocationId", data.eventLocationId.toString())

    // Formatar e adicionar as datas
    const dateInit = this.formatDateToYYYYMMDD(data.dateInit)
    const dateFinish = this.formatDateToYYYYMMDD(data.dateFinish)

    formData.append("dateInit", dateInit)
    formData.append("dateFinish", dateFinish)

    // Adicionar o link do vídeo se existir
    if (data.videoLink) {
      formData.append("videoLink", data.videoLink)
    } else {
      formData.append("videoLink", "")
    }

    // Adicionar o arquivo se existir
    if (file) {
      formData.append("file", file, file.name)
      formData.append("fileKey", file.name)
    } else if (data.fileKey) {
      // Se não tiver um novo arquivo, mas tiver um fileKey existente
      formData.append("fileKey", data.fileKey)
    }

    return this.http.put<any>(`${this.api}/banners/${id}`, formData)
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/banners/${id}`)
  }
}
