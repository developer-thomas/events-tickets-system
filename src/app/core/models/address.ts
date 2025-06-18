// export type AddressReponse = {
//   bairro: string;
//   cep: string;
//   complemento: string;
//   ddd: string;
//   gia: string;
//   ibge: string;
//   localidade: string;
//   logradouro: string;
//   siafi: string;
//   uf: string;
//   erro?: boolean;
// };

export interface AddressReponse {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export type Address = {
  zipCode: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
};
