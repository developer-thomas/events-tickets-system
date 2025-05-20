export interface GetAllLocations {
    result: AllLocations[];
}

export interface AllLocations {
    id: number;
    name: string;
    description: string;
    categories: CategoriesList[];
}

interface CategoriesList {
    id: number;
    name: string;
}