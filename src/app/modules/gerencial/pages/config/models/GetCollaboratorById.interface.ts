export interface GetAllCollaboratorById {
    id: number;
    createdAt: string; // ISO date string
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    email: string;
    password: string;
    role: string;
    permissions: string[]; 
  }