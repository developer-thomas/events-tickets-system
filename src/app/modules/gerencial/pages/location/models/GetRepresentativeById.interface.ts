export interface GetRepresentativeByIdResponse {
    status: number;
    result: GetRepresentativeById;
}

export interface GetRepresentativeById {
    id: number;
    name: string;
    email: string;
    cpf_cnpj: string;
}