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

export interface GetCategoriesNames {
  id: number
  name: string
}

export interface GetLocationsNames {
  id: number
  name: string
}

export interface CreateEventResponse {
  status: number
  result: {
    id: number
    name: string
    // outros campos conforme necessário
  }
  message: string
}

export interface TimelineItem {
  date: string
  initHour: string
  finishHour: string
  description: string
}

export interface CreateEventTimeline {
  eventId: number
  title: string
  description: string
  date: string
}

export interface CreateEventTimelines {
  eventId: number
  timelines: TimelineItem[]
}

export interface SponsorCategory {
  id: number
  name: string
}

export interface SponsorItem {
  name: string
  categoryId: number
  description: string
  logoImage?: File
}

export interface CreateSponsor {
  sponsors: {
    name: string
    categoryIds: number[]
    description: string
    imageUrl: string
    eventId: number
  }[]
}
