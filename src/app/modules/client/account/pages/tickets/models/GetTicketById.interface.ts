export interface GetTicketByIdResponse {
    event: GetEventFromTicket;
    qrcode: QrCode;
    status: string;
}
export interface GetEventFromTicket {
    id: any;
    name: string;
    value: number;
    numberOfTickets: number;
    eventDate: string;
    timelineEvent: TimelineEvent[];
    status: string;
}

export interface TimelineEvent {
    hourInit: string;
}

export interface QrCode {
    id: number;
    qrcode: string;
}