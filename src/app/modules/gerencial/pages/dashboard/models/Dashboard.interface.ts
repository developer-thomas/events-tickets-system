export interface DashboardData {
    categoriesRevenue: CategoryRevenue[];
    lastTicketsSold: TicketsSold[];
    users: number;
    subscritionsRevenue: number;
    ticketsRevenue: number;
    annualInformation: AnnualInfo[];
    locationsRevenue: LocationRevenue[];
}

export interface CategoryRevenue {
    revenue: number;
    name: string;
}
  
export interface TicketsSold {
    id: number;
    createdAt: string; 
    userName: string;
}

export interface AnnualInfo {
    month: string;
    ticketRevenue: number;
    totalUsers: number;
}

export interface LocationRevenue {
    name: string;
    total: number;
}

export type DashbocardInfos = {
    value: string;
    description: string;
    percentage?: string;
    icon: string;
    color: string;
  }