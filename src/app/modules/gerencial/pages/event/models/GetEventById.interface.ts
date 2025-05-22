export interface GetOneEvent {
    id: number;
    name: string;
    description: string;
    eventDate: string; // ISO string
    active: boolean;
    categories: EventCategory[];
    eventSponsors: EventSponsor[];
    eventLocation: EventLocation;
    fileUrl: string;
    value: number;
  }
  
  export interface EventCategory {
    id: number;
    name: string;
  }
  
  export interface EventSponsor {
    id: number;
    eventId: number;
    name: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }
  
  export interface EventLocation {
    id: number;
    name: string;
    description: string;
    addressLocation: string | null;
  }
  