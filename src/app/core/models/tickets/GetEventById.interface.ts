export interface GetOneEvent {
    id: number;
    name: string;
    description: string;
    eventDate: string; // ISO string
    active: boolean;
    categories: EventCategory[];
    eventSponsor: EventSponsor[];
    eventLocation: EventLocation;
    fileUrl: string;
    value: number;
    timelineEvent: TimelineEvent[];
  }
  
export interface EventCategory {
  id: number;
  name: string;
}
  
 export interface EventSponsor {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}
  
export interface EventLocation {
  id: number;
  name: string;
  description: string;
  addressLocation: string | null;
}
  
export interface TimelineEvent {
  id: number;
  description: string;
  date: string;
  hourInit: string;
  hourFinish: string; 
}