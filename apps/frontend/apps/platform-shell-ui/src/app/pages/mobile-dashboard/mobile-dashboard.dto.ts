export interface MobileDashboardDto {
  totalItems: number;
  totalWarehouses: number;
  lowStockItems: number;
  lastUpdate: string;
}

export interface Activity {
  id: number;
  type: string;
  description: string;
  date: string;
}
