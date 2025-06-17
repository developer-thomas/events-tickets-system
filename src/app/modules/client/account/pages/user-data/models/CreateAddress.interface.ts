export interface CreateAddress {
    id: number;
    street: string;
    number: number;
    neighborhood: string;
    cep: number;
    uf: string;
    city: string;
    referenceType: string; // Você pode usar um enum se os valores forem fixos (ex: 'Job', 'Home', etc.)
  }
  