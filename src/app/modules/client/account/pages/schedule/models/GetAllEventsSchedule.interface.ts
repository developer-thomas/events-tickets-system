export interface Category {
    id: number
    name: string
  }
  
  export interface AddressLocation {
    lat: number
    lng: number
    placeId: string
  }
  
  export interface EventLocation {
    id: number
    name: string
    description: string
    addressLocation: AddressLocation
  }
  
  export interface TimelineEvent {
    // Defina os campos conforme necessário
    id?: number
    title?: string
    description?: string
    date?: Date
  }
  
  export interface EventsResult {
    id: number
    name: string
    description: string
    value: string
    eventDate: string
    fileUrl: string | null
    numberOfTickets: number
    active: boolean
    categories: Category[]
    timelineEvent: TimelineEvent[]
    eventLocation: EventLocation
    isFavorite: boolean
  }
  
  export interface GetAllEvents {
    status: number
    result: EventsResult[]
  }
  