export interface GetUserFinancial {
    id: number;
    orderId: number;
    amount: number;
    method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BOLETO' | string; 
    status: 'Paid' | 'Pending' | 'Failed' | string; 
    codeId: number;
    cardNumber: string;
    brand: string;
    createdAt: string; 
    updatedAt: string;
  }
  