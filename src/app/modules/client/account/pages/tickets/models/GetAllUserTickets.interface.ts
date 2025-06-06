export interface GetAllUserTicketsResponse {
  data: GetAllUserTickets[];
  metadata: GetAllUserTicketsMetadata;
}

export interface GetAllUserTickets {
  id: number;
  userId: number;
  eventId: number;
  giftFrom: number | null;
  status: 'VALID' | 'INVALID' | string; 
  dateOfUse: string | null;
  value: any;
  statusProcess: 'WAIT' | 'PROCESSING' | 'DONE' | string; 
  createdAt: string; 
  updatedAt: string; 
  qrcode: {
    id: number;
    qrcode: string; 
  };
  event: {
    name: string;
    timelineEvent: TimelineEvent[];
    eventLocation: {
      name: string;
    };
  };
}

export interface TimelineEvent {
  id: number;
  date: string;
  hourInit: string;
}

interface GetAllUserTicketsMetadata {
  totalPages: number;
  offset: number;
  limit: number;
  currentPage: number;
  previewPage: number;
  nextPage: number;
}


  