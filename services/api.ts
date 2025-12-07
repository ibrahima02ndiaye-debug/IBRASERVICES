/**
 * API Service Layer
 * All API calls to the backend server
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function to handle API requests
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// Authentication
export async function loginUser(credentials: { email: string; password: string }) {
    return apiRequest<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}

export async function registerUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
}) {
    return apiRequest<{ token: string; user: any }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

// Clients
export async function getClients() {
    return apiRequest<any[]>('/api/clients');
}

export async function createClient(client: any) {
    return apiRequest<any>('/api/clients', {
        method: 'POST',
        body: JSON.stringify(client),
    });
}

export async function updateClient(id: string, client: any) {
    return apiRequest<any>(`/api/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(client),
    });
}

export async function deleteClient(id: string) {
    return apiRequest<void>(`/api/clients/${id}`, {
        method: 'DELETE',
    });
}

// Vehicles
export async function getVehicles() {
    return apiRequest<any[]>('/api/vehicles');
}

export async function createVehicle(vehicle: any) {
    return apiRequest<any>('/api/vehicles', {
        method: 'POST',
        body: JSON.stringify(vehicle),
    });
}

export async function updateVehicle(id: string, vehicle: any) {
    return apiRequest<any>(`/api/vehicles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(vehicle),
    });
}

export async function deleteVehicle(id: string) {
    return apiRequest<void>(`/api/vehicles/${id}`, {
        method: 'DELETE',
    });
}

// Appointments
export async function getAppointments() {
    return apiRequest<any[]>('/api/appointments');
}

export async function createAppointment(appointment: any) {
    return apiRequest<any>('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(appointment),
    });
}

export async function updateAppointment(id: string, appointment: any) {
    return apiRequest<any>(`/api/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(appointment),
    });
}

export async function deleteAppointment(id: string) {
    return apiRequest<void>(`/api/appointments/${id}`, {
        method: 'DELETE',
    });
}

// Financials/Accounting
export async function getFinancials() {
    return apiRequest<any[]>('/api/accounting');
}

export async function createFinancialRecord(record: any) {
    return apiRequest<any>('/api/accounting', {
        method: 'POST',
        body: JSON.stringify(record),
    });
}

// Quotes
export async function getQuotes() {
    return apiRequest<any[]>('/api/quotes');
}

export async function createQuote(quote: any) {
    return apiRequest<any>('/api/quotes', {
        method: 'POST',
        body: JSON.stringify(quote),
    });
}

export async function updateQuoteStatus(id: string, status: string) {
    return apiRequest<any>(`/api/quotes/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

// AI Diagnostics
export async function runAIDiagnostics(data: { symptoms: string; images?: string[] }) {
    return apiRequest<{ diagnosis: string; recommendations: string[] }>('/api/ai/diagnose', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getPredictiveMaintenance(vehicleId: string) {
    return apiRequest<any>(`/api/ai/predictive-maintenance/${vehicleId}`);
}
