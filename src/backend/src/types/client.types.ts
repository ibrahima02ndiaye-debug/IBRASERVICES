export interface IClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: 'EN' | 'FR';
  type: 'Regular' | 'Fleet';
  createdAt: Date;
  updatedAt: Date;
  totalSales: number;
  totalProfit: number;
  totalPayments: number;
  outstandingBalance: number;
}

export interface ICreateClientDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: 'EN' | 'FR';
  type: 'Regular' | 'Fleet';
}

export interface IUpdateClientDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  language?: 'EN' | 'FR';
  type?: 'Regular' | 'Fleet';
}

export interface IClientFilters {
  language?: string;
  type?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface IVehicle {
  id: string;
  clientId: string;
  year: number;
  make: string;
  model: string;
  vin: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITag {
  id: string;
  name: string;
  createdAt: Date;
}

export interface IRepairOrder {
  id: string;
  clientId: string;
  vehicleId: string;
  status: 'open' | 'in-progress' | 'completed' | 'invoiced';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}