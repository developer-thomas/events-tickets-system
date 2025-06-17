export interface CartRequest {
    userId: number;
    item: CartItem;
  }
  
  export interface CartItem {
    eventId: number;
    quantity: number;
    value: number;
  }
  