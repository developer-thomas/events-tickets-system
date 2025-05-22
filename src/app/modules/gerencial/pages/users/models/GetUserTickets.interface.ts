export interface GetUserTicket {
    id: number;
    userId: number;
    eventId: number;
    value: number;
    giftFrom: number | null;
    status: string;
    statusProcess: string;
    createdAt: string; 
    updatedAt: string;
    dateOfUse: string | null;
    event: {
      name: string;
      eventLocation: {
        name: string;
      };
    };
    qrcode: {
      id: number;
      qrcode: string;
    };
  }
  