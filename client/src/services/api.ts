import { Client, Vehicle, Appointment, Staff, Partner, FinancialRecord, InventoryItem } from '../../types';

const API_BASE_URL = '/api';

// Helper to get token from storage
const getAuthToken = () => localStorage.getItem('token');

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    // If 401/403, simply throw to handle it in the component (or auto-logout here)
    if (response.status === 401 || response.status === 403) {
       console.warn("Unauthorized access detected");
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
export const getVehicles = (): Promise<Vehicle[]> => apiFetch('/vehicles');
export const getAppointments = (): Promise<Appointment[]> => apiFetch('/appointments');
export const getStaff = (): Promise<Staff[]> => apiFetch('/personnel');
export const getPartners = (): Promise<Partner[]> => apiFetch('/partners');
export const getFinancials = (): Promise<FinancialRecord[]> => apiFetch('/accounting');
export const getInventory = (): Promise<InventoryItem[]> => apiFetch('/inventory');

// Add POST/PUT helpers as needed
export const createClient = (data: Omit<Client, 'id'>) => apiFetch('/clients', { method: 'POST', body: JSON.stringify(data) });