export interface CreateAddress {
  id?: number; // Usa o id caso o usuário já possua endereço, pra cadsatrar envia sem
  street: string;
  number: number;
  neighborhood: string;
  cep: number;
  uf: string;
  city: string;
  referenceType: string; 
}

export interface GetUserAddress {
  id: number;
  userId: number;
  cep: number;
  street: string;
  number: number;
  neighborhood: string;
  uf: string;
  city: string;
  referenceType: string;
  createdAt: string; // ou `Date` se você quiser fazer `new Date(createdAt)`
  updatedAt: string;
}
