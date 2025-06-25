export interface EventByRepresentative {
    id: number
    name: string
    slug: string
    description: string
    value: number
    numberOfTickets: number
    eventDate: string
    fileKey: string | null
    fileUrl: string | null
    active: boolean
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    eventLocationId: number
  }
  
  export interface LocationByRepresentative {
    id: number
    name: string
    slug: string
    description: string
    active: boolean
    fileCoverKey: string
    fileCoverUrl: string
    fileLogoKey: string
    fileLogoUrl: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    representativeId: number
    event: EventByRepresentative[]
  }
  