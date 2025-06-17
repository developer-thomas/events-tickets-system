export interface Cart {
    id: number;
    userId: number;
    total: number;
    items: CartItem[];
  }
  
export interface CartItem {
    id: number;
    cartId: number;
    eventId: number;
    quantity: number;
    value: number;
    event: Event;
  }
  
  interface Event {
    name: string;
    eventLocation: EventLocation;
  }
  
  interface EventLocation {
    name: string;
    addressLocation: AddressLocation;
  }
  
  interface AddressLocation {
    lat: number;
    lng: number;
  }
  
export interface CartItemDisplay {
    id: number
    eventId: number
    title: string
    venue: string
    image: string
    price: number
    quantity: number
    cartId: number
  }