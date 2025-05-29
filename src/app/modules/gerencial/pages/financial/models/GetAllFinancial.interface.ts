export interface GetAllFinancial {
    id: number;
    value: number;
    discount: number;
    status: any;
    referent: any;
    payment: {
      method: any;
    };
    userId: number;
    user: {
      name: string;
    };
    createdAt: string; // ISO date string
    updatedAt: string;
}
  
export enum PaymentMethod {
  CREDIT_CARD = 'Cartão de Crédito',
  PIX = 'Pix'
}

export enum PaymentStatus {
  Paid = 'Pago',
  UnPaid = 'Não Pago'
}