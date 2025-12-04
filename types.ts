// FIX: Import React to make types like React.ReactNode available.
import React from 'react';

export type View =
  | 'dashboard'
  | 'vehicles'
  | 'clients'
  | 'client-detail'
  | 'appointments'
  | 'personnel'
  | 'accounting'
  | 'partners'
  | 'messages'
  | 'diagnostics'
  | 'inventory';

export type UserRole = 'Garage' | 'Client';

export type Theme = 'light' | 'dark';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  mileage: number;
  ownerId: string;
  status: 'Available' | 'In Service' | 'Out of Service';
}

export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  date: string;
  serviceType: string;
  mechanic: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'Manager' | 'Mechanic' | 'Receptionist' | 'Detailer';
  email: string;
  phone: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  clientId?: string;
  invoiceId?: string;
}

export interface Partner {
  id: string;
  name: string;
  type: 'Parts Supplier' | 'Insurance' | 'Towing Service' | 'Detailing Specialist';
  contactPerson: string;
  email: string;
  phone: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

export interface Quote {
  id: string;
  clientId: string;
  appointmentId: string;
  date: string;
  total: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  items: { description: string; cost: number }[];
}

export interface DirectMessage {
  id: string;
  conversationId: string; // Corresponds to clientId
  sender: UserRole;
  text: string;
  timestamp: string;
  read: boolean;
  isSOS: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  lowStockThreshold: number;
  supplier: string;
}

export interface ModalOptions {
  showFooter?: boolean;
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  options?: ModalOptions;
}

export interface AppContextType {
  currentView: View;
  setCurrentView: (view: View) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  modal: ModalState;
  openModal: (title: string, content: React.ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  
  // Auth additions
  isAuthenticated: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

// Billing Types
export type InvoiceTemplate = 'modern' | 'classic' | 'minimal';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  template: InvoiceTemplate;
  status: 'Draft' | 'Sent' | 'Paid';
}