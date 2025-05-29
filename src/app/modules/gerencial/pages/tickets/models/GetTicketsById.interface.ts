export interface QrCodeModel {
    qrcode: QrCode;
    event: TicketsEvent;
    user: User;
  }
  
export interface QrCode {
    id: number;
    qrcode: string;
}

export interface TicketsEvent {
    id: any;
    name: string;
    description: string;
    value: number;
    numberOfTickets: number;
    eventDate: string; // Pode usar Date se quiser tratar como objeto
    eventLocation: TicketsEventLocation;
}

export interface TicketsEventLocation {
    name: string;
    description: string;
    categories: string[];
    addressLocation: TicketsAddressLocation;
}

export interface TicketsAddressLocation {
    street: string;
    number: string;
    neighborhood: string;
    cep: string;
    city: string;
    uf: string;
    lat: number;
    lng: number;
    placeId: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    imageUrl: string;
}
  