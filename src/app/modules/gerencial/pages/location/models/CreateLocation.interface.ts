export interface CreateLocation {
    name: string
    description: string
    categoryIds?: string[] | string // Pode ser array ou string JSON para FormData
    street: string
    number: string
    neighborhood: string
    cep: string
    city: string
    uf: string
    active: boolean | string // FormData envia como string
    coverImage?: File | string // Pode ser File ou string (base64/url)
    logoImage?: File | string // Pode ser File ou string (base64/url)
    locationLink?: string
  }