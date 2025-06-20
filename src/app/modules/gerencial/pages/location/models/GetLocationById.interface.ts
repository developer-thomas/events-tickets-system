export interface GetOneLocationResponse {
    result: GetOneLocation;
}
  
export interface GetOneLocation {
    id: number;
    name: string;
    slug: string;
    description: string;
    fileCoverKey: string | null;
    fileCoverUrl: string | null;
    fileLogoKey: string | null;
    fileLogoUrl: string | null;
    addressLocation: GetOneLocationAddress;
    categories: GetOneLocationCategory[]; // está vindo vazio, mas é uma lista
    event: GetOneLocationEvent[];
}

export interface GetOneLocationAddress {
    lat: number;
    lng: number;
    placeId: string;
    number?: string;
    neighborhood?: string;
    street?: string;
    cep?: string;
    city?: string;
    uf?: string;
}

export interface GetOneLocationCategory {
    id?: number;
    name?: string;
    imageIconUrl: string;
    imageCoverUrl: string;
    
    
}

export interface GetOneLocationEvent {
    id: number;
    name: string;
    slug?: string;
    description: string;
    isFavorite: boolean;
    categories: GetOneLocationCategory[];
    imageCoverKey: string | null;
    imageCoverUrl: string | null;
    imageIconKey: string | null;
    imageIconUrl: string | null;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    fileCoverUrl: string;
    fileLogoUrl: string;
    fileUrl: string;
}
