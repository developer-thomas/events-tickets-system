export interface GetAllLocations {
    result: LocationResult[]
    // Outros campos que possam existir na resposta
  }
  
  export interface LocationResult {
    id: number
    name: string
    description: string
    // Outros campos que possam existir
  }
  
  export interface GetCategoriesNames {
    id: number
    name: string
  }
  
  export interface CreateLocation {
    name: string
    description: string
    categoryIds?: string[]
    street: string
    number: string
    neighborhood: string
    cep: string
    city: string
    uf: string
    active: boolean
    coverImage?: string
    logoImage?: string
  }
  
  export interface CreateRepresentante {
    name: string
    email: string
    password: string
    cpf_cnpj: string
    placeId: number
    phone: string
  }
  