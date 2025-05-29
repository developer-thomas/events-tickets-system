export interface GetOneTicket {
  qrcode: QrCode;
  event: GetOneEvent;
  user: any;
  status: any;
}

export interface GetOneEvent {
    id: any;
    name: string;
    description: string;
    eventDate: string; // ISO string
    categories: EventCategory[];
    eventSponsor: EventSponsor[];
    eventLocation: EventLocation;
    fileUrl: string;
    value: number;
    timelineEvent: TimelineEvent[];
  }
  
export interface QrCode {
  id: number;
  qrcode: string;
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