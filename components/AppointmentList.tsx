
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Appointment, Vehicle, Client } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Card from './common/Card';
import Button from './common/Button';
import { PlusIcon } from './icons/Icons';
import ScheduleAppointmentForm from './forms/ScheduleAppointmentForm';
import { getAppointments } from '../client/src/services/api';
import Skeleton from './common/Skeleton';

// MOCK DATA until API is connected
const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'app-1', clientId: 'cli-2', vehicleId: 'veh-2', date: new Date(Date.now() + 86400000).toISOString(), serviceType: 'Brake Inspection', mechanic: 'Bob', status: 'Scheduled' },
    { id: 'app-2', clientId: 'cli-1', vehicleId: 'veh-1', date: new Date(Date.now() + 172800000).toISOString(), serviceType: 'Oil Change', mechanic: 'Alice', status: 'Scheduled' },
    { id: 'app-3', clientId: 'cli-3', vehicleId: 'veh-3', date: new Date(Date.now() + 259200000).toISOString(), serviceType: 'Tire Rotation', mechanic: 'Charlie', status: 'In Progress' },
];
const MOCK_VEHICLES: Vehicle[] = [
    { id: 'veh-1', make: 'Toyota', model: 'Camry', year: 2021, vin: '12345ABC', licensePlate: 'XYZ 123', mileage: 45000, ownerId: 'cli-1', status: 'Available' },
    { id: 'veh-2', make: 'Honda', model: 'Civic', year: 2020, vin: '67890DEF', licensePlate: 'ABC 456', mileage: 60000, ownerId: 'cli-2', status: 'In Service' },
    { id: 'veh-3', make: 'Ford', model: 'F-150', year: 2019, vin: '45678GHI', licensePlate: 'TRK 789', mileage: 85000, ownerId: 'cli-3', status: 'Available' },
];
const MOCK_CLIENTS: Client[] = [
    { id: 'cli-1', name: 'John Doe', email: 'john.doe@example.com', phone: '555-1234', address: '123 Main St' },
    { id: 'cli-2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-5678', address: '456 Oak Ave' },
    { id: 'cli-3', name: 'Bob Johnson', email: 'bob.j@example.com', phone: '555-9012', address: '789 Pine Ln' },
];

const statusColorMap: { [key in Appointment['status']]: string } = {
  'Scheduled': 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20',
  'In Progress': 'bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border border-yellow-500/20',
  'Completed': 'bg-green-500/10 text-green-500 dark:text-green-400 border border-green-500/20',
  'Cancelled': 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border border-gray-500/20',
};

interface AppointmentListProps {
  isDashboardView?: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ isDashboardView = false }) => {
  const { userRole, openModal, closeModal } = useAppContext();
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getAppointments();
            setAppointments(data);
        } catch (error) {
            console.warn("Failed to fetch appointments. Using mock data.", error);
            setAppointments(MOCK_APPOINTMENTS);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);
  
  // Client filter for "Client" role (using demo ID cli-2)
  const allAppointments = userRole === 'Garage' 
    ? appointments 
    : appointments.filter(a => a.clientId === 'cli-2');
  
  const displayedAppointments = (isDashboardView 
    ? allAppointments.filter(a => new Date(a.date) >= new Date() && a.status === 'Scheduled').slice(0, 5) 
    : allAppointments
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleScheduleAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `app-${Date.now()}`,
    };
    setAppointments(prev => [newAppointment, ...prev]);
    closeModal();
  };

  const handleScheduleClick = () => {
    openModal(
      t('forms.schedule_appointment'),
      <ScheduleAppointmentForm onSchedule={handleScheduleAppointment} />,
      { showFooter: false }
    );
  };
  
  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('appointments.header_date')}</th>
            {userRole === 'Garage' && <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('appointments.header_client')}</th>}
            <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('appointments.header_vehicle')}</th>
            <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('appointments.header_service')}</th>
            {userRole === 'Garage' && <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('appointments.header_mechanic')}</th>}
            <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('appointments.header_status')}</th>
            <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('appointments.header_actions')}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
             [1,2,3].map(i => (
                <tr key={i} className="border-b border-gray-200 dark:border-gray-800">
                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                    {userRole === 'Garage' && <td className="p-4"><Skeleton className="h-4 w-24" /></td>}
                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                    {userRole === 'Garage' && <td className="p-4"><Skeleton className="h-4 w-20" /></td>}
                    <td className="p-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                    <td className="p-4"><Skeleton className="h-8 w-16 rounded" /></td>
                </tr>
             ))
          ) : displayedAppointments.length === 0 ? (
             <tr><td colSpan={7} className="p-4 text-center text-gray-500">No appointments found.</td></tr>
          ) : (
            displayedAppointments.map((appointment) => {
                // In real app, you might fetch related entities or have them joined in the API response.
                // Here we fallback to finding them in mock lists if not in state, but ideally API returns joined data.
                const vehicle = MOCK_VEHICLES.find(v => v.id === appointment.vehicleId);
                const client = MOCK_CLIENTS.find(c => c.id === appointment.clientId);
                return (
                <tr key={appointment.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="p-4 font-medium text-gray-950 dark:text-white">{new Date(appointment.date).toLocaleString()}</td>
                {userRole === 'Garage' && <td className="p-4">{client?.name || 'Unknown'}</td>}
                <td className="p-4">{vehicle?.make} {vehicle?.model || 'Unknown Vehicle'}</td>
                <td className="p-4">{appointment.serviceType}</td>
                {userRole === 'Garage' && <td className="p-4">{appointment.mechanic || '-'}</td>}
                <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColorMap[appointment.status]}`}>
                    {t(`statuses.${appointment.status}`)}
                    </span>
                </td>
                <td className="p-4 space-x-2">
                    <Button variant="secondary" size="sm">{t('lists.edit')}</Button>
                </td>
                </tr>
            )})
          )}
        </tbody>
      </table>
    </div>
  );

  if (isDashboardView) {
    return <Card><TableView /></Card>;
  }

  return (
    <Card>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold">{t('nav.appointments', 'Rendez-vous')}</h2>
        <Button onClick={handleScheduleClick} icon={<PlusIcon />}>{t('appointments.schedule')}</Button>
      </div>
      <TableView />
    </Card>
  );
};

export default AppointmentList;
