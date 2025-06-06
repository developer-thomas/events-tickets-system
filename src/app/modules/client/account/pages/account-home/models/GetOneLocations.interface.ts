export interface ApiResponse {
    status: number;
    result: GetOneLocation;
}

export interface GetOneLocation {
    id: number;
    name: string;
    description: string;
    slug: string;
    fileCoverKey: string | null;
    fileCoverUrl: string | null;
    fileLogoKey: string | null;
    fileLogoUrl: string | null;
    categories: GetOneLocationCategory[];
    event: GetOneLocationEvent[];
    addressLocation: AddressLocation;
}

export interface GetOneLocationEvent {
    id: number;
    name: string;
    description: string;
    categories: GetOneLocationCategory[];
    fileKey: string | null;
    fileUrl: string | null;
    isFavorite: boolean;
}
  
  export interface GetOneLocationCategory {
    id: number;
    name: string;
    slug: string;
    imageCoverKey: string | null;
    imageCoverUrl: string | null;
    imageIconKey: string | null;
    imageIconUrl: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }
  
  export interface AddressLocation {
    lat: number;
    lng: number;
    placeId: string;
  }