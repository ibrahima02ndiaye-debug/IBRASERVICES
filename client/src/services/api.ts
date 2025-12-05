import { Client, Vehicle, Appointment, Staff, Partner, FinancialRecord, InventoryItem, Quote } from '../../types';

const API_BASE_URL = '/api';

// Helper to get token from storage
const getAuthToken = () => localStorage.getItem('token');

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    if (response.status === 401 || response.status === 403) {
       console.warn("Unauthorized access detected");
       // Optional: trigger logout
    }
    throw new Error(errorData.message || response.statusText);
  }
  return response.json();
};

const getHeaders = () => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic Fetch Wrapper
const apiFetch = (endpoint: string, options: RequestInit = {}) => {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  }).then(handleResponse);
};

// --- Auth API ---
export const loginUser = (credentials: { email: string; password: string }) => 
    apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });

export const registerUser = (userData: { name: string; email: string; password: string; role: string }) => 
    apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });

// --- Data APIs ---
export const getClients = (): Promise<Client[]> => apiFetch('/clients');
export const getClientById = (id: string): Promise<Client> => apiFetch(`/clients/${id}`);
export const createClient = (data: Omit<Client, 'id'>): Promise<Client> => apiFetch('/clients', { method: 'POST', body: JSON.stringify(data) });
export const updateClient = (id: string, data: Partial<Client>): Promise<Client> => apiFetch(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteClient = (id: string): Promise<void> => apiFetch(`/clients/${id}`, { method: 'DELETE' });

export const getVehicles = (): Promise<Vehicle[]> => apiFetch('/vehicles');
export const getVehicleById = (id: string): Promise<Vehicle> => apiFetch(`/vehicles/${id}`);
export const createVehicle = (data: Omit<Vehicle, 'id'>): Promise<Vehicle> => apiFetch('/vehicles', { method: 'POST', body: JSON.stringify(data) });
export const updateVehicle = (id: string, data: Partial<Vehicle>): Promise<Vehicle> => apiFetch(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteVehicle = (id: string): Promise<void> => apiFetch(`/vehicles/${id}`, { method: 'DELETE' });

export const getAppointments = (): Promise<Appointment[]> => apiFetch('/appointments');
export const createAppointment = (data: Omit<Appointment, 'id'>): Promise<Appointment> => apiFetch('/appointments', { method: 'POST', body: JSON.stringify(data) });
export const updateAppointment = (id: string, data: Partial<Appointment>): Promise<Appointment> => apiFetch(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAppointment = (id: string): Promise<void> => apiFetch(`/appointments/${id}`, { method: 'DELETE' });

export const getStaff = (): Promise<Staff[]> => apiFetch('/personnel');
export const createStaff = (data: Omit<Staff, 'id'>): Promise<Staff> => apiFetch('/personnel', { method: 'POST', body: JSON.stringify(data) });
export const deleteStaff = (id: string): Promise<void> => apiFetch(`/personnel/${id}`, { method: 'DELETE' });

export const getPartners = (): Promise<Partner[]> => apiFetch('/partners');
export const createPartner = (data: Omit<Partner, 'id'>): Promise<Partner> => apiFetch('/partners', { method: 'POST', body: JSON.stringify(data) });
export const deletePartner = (id: string): Promise<void> => apiFetch(`/partners/${id}`, { method: 'DELETE' });

export const getFinancials = (): Promise<FinancialRecord[]> => apiFetch('/accounting');
export const createFinancialRecord = (data: Omit<FinancialRecord, 'id'>): Promise<FinancialRecord> => apiFetch('/accounting', { method: 'POST', body: JSON.stringify(data) });

export const getInventory = (): Promise<InventoryItem[]> => apiFetch('/inventory');
export const createInventoryItem = (data: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => apiFetch('/inventory', { method: 'POST', body: JSON.stringify(data) });
export const deleteInventoryItem = (id: string): Promise<void> => apiFetch(`/inventory/${id}`, { method: 'DELETE' });

export const getQuotes = (): Promise<Quote[]> => apiFetch('/quotes');
export const updateQuoteStatus = (id: string, status: 'Approved' | 'Rejected'): Promise<Quote> => apiFetch(`/quotes/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });

export const runAIDiagnostics = (prompt: string, dtcs: string[]): Promise<{ result: string }> => apiFetch('/ai/diagnose', { method: 'POST', body: JSON.stringify({ prompt, dtcs }) });
