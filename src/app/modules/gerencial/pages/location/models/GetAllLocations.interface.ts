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

// INTERFACE PARA USAR NA PESQUISA PELO FRONT
export interface LocationTableRow {
    id: number;
    name: string;
    description: string;
    categories: string[]; // Aqui são os nomes das categorias
  }