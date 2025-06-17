export interface GetTicketsByUser {
    data: Ticket[];
  }
  
  export interface Ticket {
    id: number;
    userId: number;
    eventId: number;
    giftFrom: string | null;
    status: string;
    dateOfUse: string | null;
    value: number;
    statusProcess: string;
    createdAt: string;
    updatedAt: string;
    qrcode: QrCode;
    event: EventInfo;
  }
  
  export interface QrCode {
    id: number;
    qrcode: string;
  }
  
  export interface EventInfo {
    name: string;
    eventLocation: {
      name: string;
    };
    timelineEvent: TimelineEvent[];
  }
  
  export interface TimelineEvent {
    id: number;
    description: string;
    date: string;
    hourInit: string;
    hourFinish: string;
    eventId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }
  