import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import { Observable, map } from "rxjs"
import { environment } from "../../../../../environments/environment.development"
import { GetCategoriesNames, GetLocationsNames, CreateEventResponse, CreateEventTimeline, CreateEventTimelines, CreateSponsor } from "./models/CreateEvent.interface"
import { EventsResult, GetAllEvents } from "./models/GetAllEvents.interface"
import { GetOneEvent } from "./models/GetEventById.interface"
import { UpdateEventTimeline } from "./models/UpdateEventTimeline.interface"
import { UpdateEventSponsor } from "./models/UpdateEventSponsor.interface"
import { LocationByRepresentative } from "./models/GetEventsByRepresentative.interface"

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly api = environment.api
  private http = inject(HttpClient)

  getAllEvents(): Observable<EventsResult[]> {  
    return this.http.get<EventsResult[]>(`${this.api}/admin/events`)
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/events/${id}`)
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
   * Método para pegar os locais e listar na criação de um evento
   */
  getLocationsNames(): Observable<GetLocationsNames[]> {
    return this.http.get<{ status: number; result: any[] }>(`${this.api}/places`).pipe(
      map((res) => {
        if (res && res.result && Array.isArray(res.result)) {
          return res.result.map((loc) => ({
            id: loc.id,
            name: loc.name,
          }))
        }
        return []
      }),
    )
  }

  // Certifique-se de que o método createEvent está configurado corretamente para enviar multipart/form-data
  /**
   * Cria um novo evento
   * @param data dados do evento a ser criado
   * @returns
   */
  createEvent(data: FormData): Observable<CreateEventResponse> {
    // Log the FormData entries for debugging
    console.log("Sending FormData to API:")
    data.forEach((value, key) => {
      console.log(`${key}: ${value}`)
    })

    // Não definimos cabeçalhos explicitamente para permitir que o Angular configure automaticamente
    // o Content-Type como multipart/form-data com o boundary correto
    return this.http.post<CreateEventResponse>(`${this.api}/events`, data)
  }

  /**
   * Cria um novo cronograma para um evento (método individual)
   * @param data dados do cronograma a ser criado
   * @returns não retorna nada
   */
  createEventTimeline(data: CreateEventTimeline): Observable<any> {
    return this.http.post<CreateEventTimeline>(`${this.api}/timelines/create`, data)
  }

  /**
   * Cria múltiplos itens de cronograma para um evento (método em lote)
   * @param data objeto contendo eventId e array de timelines
   * @returns
   */
  createEventTimelines(data: CreateEventTimelines): Observable<any> {
    return this.http.post<CreateEventTimelines>(`${this.api}/timelines/create`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  /**
   * Cria um novo patrocinador para um evento
   * @param data dados do patrocinador a ser criado
   * @returns
   */
  createSponsor(data: CreateSponsor): Observable<any> {
    return this.http.post<CreateSponsor>(`${this.api}/events/sponsors`, data)
  }

  /**
   * Pega o evento baseado em seu ID
   */
  getOneEvent(eventId: any): Observable<GetOneEvent> {
    return this.http.get<GetOneEvent>(`${this.api}/events/${eventId}`);
  }

  /**
   * @param eventId id do evento
   * @data formData de edição
   */
  updateEvent(eventId: number, data: FormData): Observable<any> {
    return this.http.put<FormData>(`${this.api}/events/${eventId}`, data);
  }
  
  /**
   * Método para atualizar um cronograma de um evento
   * @param timelineId id do cronograma
   */
  updateEventTimeline(timelineId: number, data: UpdateEventTimeline ): Observable<any> {
    return this.http.patch<UpdateEventTimeline>(`${this.api}/timelines/${timelineId}`, data);
  }

  /**
   * @param sponsorId id do patrocinador
   */
  updateEventSponsor(sponsorId: number, data: UpdateEventSponsor ): Observable<any> {
    return this.http.patch<UpdateEventSponsor>(`${this.api}/admin/sponsor/${sponsorId}`, data);
  }

  getEventsByRepresentative(userId: number): Observable<LocationByRepresentative> {
    return this.http.get<LocationByRepresentative>(`${this.api}/admin/events/resentative/${userId}`);
  }
}
