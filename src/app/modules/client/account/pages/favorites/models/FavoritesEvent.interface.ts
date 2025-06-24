
export interface FavoriteEvent {
    id: number;
    name: string;
    description: string;
    eventLocation: string;
    isFavorite: boolean;
    image: string;
    date: string; // opcional, se você usar a data no front
    lat: number;
    lng: number;
    value: number;
    categories: {
      id: number;
      name: string;
      imageCoverUrl: string | null;
      imageIconUrl: string | null;
    }[];
  }
  