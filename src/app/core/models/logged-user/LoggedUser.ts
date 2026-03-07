export interface LoggedUser {
    id: number;
    name: string;
    imageUrl: string;
    email: string;
    role: string;
    addresses: LoggedUserAddress[];
    favorites: LoggedUserFavorites[];
    cpf_cnpj: string;
    gender?: string;
    dateOfBirth: string;
    phone: string;
  }
  
interface LoggedUserAddress {
    addressText: string;
    lat: number;
    lng: number;
    placeId: string;
    type: string;
}
  
  interface LoggedUserFavorites {
    eventId: number;
    userId: number;
  }
  