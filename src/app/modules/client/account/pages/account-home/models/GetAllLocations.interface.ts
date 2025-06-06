export interface LocationListResponse {
  status: number;
  result: GetAllLocation[];
}
  
export interface GetAllLocation {
  id: number;
  name: string;
  description: string;
  fileCoverKey: string;
  fileCoverUrl: string;
  fileLogoKey: string;
  fileLogoUrl: string;
  categories: LocationCategory[];
  event: EventItem[];
  addressLocation: AddressLocation;
  estimatedTime?: string;
  distanceKm?: any;
}
  
export interface LocationCategory {
  id: number;
  name: string;
  imageCoverUrl: string;
  imageIconUrl: string;
}

export interface EventItem {
  id: number;
  name: string;
  description: string;
  categories: EventCategory[];
}

export interface EventCategory {
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
  
export interface UserLocation {
  lat: any;
  lng: any;
}