export interface GetClientResponse {
  result: Client;
}
  
export interface Client {
  id: number;
  createdAt: string;     
  updatedAt: string;     
  deletedAt: string;     
  name: string;
  email: string;
  password: string;
  role: string;
  gender: string
  phone: string;
  dateOfBirth: string;   
  active: boolean;
  cpf_cnpj: string;
  imageUrl: string;
}
