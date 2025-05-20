export interface CreateLocation {
    name: string; 
    description: string; 
    categoryIds?: string[]; 
    street: string; 
    number: string; 
    neighborhood: string; 
    cep: string; 
    city: string; 
    uf: string; 
    active: boolean;
    coverImage?: string; 
    logoImage?: string; 
}

  