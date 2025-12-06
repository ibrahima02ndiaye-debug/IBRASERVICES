
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Appointment, Vehicle, Client } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Card from './common/Card';
import Button from './common/Button';
import { PlusIcon } from './icons/Icons';
import ScheduleAppointmentForm from './forms/ScheduleAppointmentForm';
import { getAppointments, getVehicles, getClients, createAppointment } from '../client/src/services/api';
import Skeleton from './common/Skeleton';

const statusColorMap: { [key in Appointment['status']]: string } = {
  'Scheduled': 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20',
  'In Progress': 'bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border border-yellow-500/20',
  'Completed': 'bg-green-500/10 text-green-500 dark:text-green-400 border border-green-500/20',
  'Cancelled': 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border border-gray-500/20',
  'Waiting for Parts': 'bg-orange-500/10 text-orange-500 dark:text-orange-400 border border-orange-500/20',
  'Quality Check': 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20',
};

interface AppointmentListProps {
  isDashboardView?: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ isDashboardView = false }) => {
  const { userRole, openModal, closeModal } = useAppContext();
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const [apps, vehs, clis] = await Promise.all([
            getAppointments(),
            getVehicles(),
            getClients()
        ]);
        setAppointments(apps);
        setVehicles(vehs);
        setClients(clis);
    } catch (error) {
        console.warn("Failed to fetch appointments data", error);
        setAppointments([]);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  // Client filter for "Client" role (In a real app, API returns filtered data)
  // Here we just show all for demo if role is Client, or filter if we had user ID.
  const allAppointments = appointments;
  
  const displayedAppointments = (isDashboardView 
    ? allAppointments.filter(a => new Date(a.date) >= new Date() && a.status === 'Scheduled').slice(0, 5) 
    : allAppointments
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleScheduleAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    try {
        await createAppointment(appointmentData);
        closeModal();
        fetchData();
    } catch (error) {
        console.error("Failed to schedule appointment", error);
        alert("Failed to schedule appointment.");
    }
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
                const vehicle = vehicles.find(v => v.id === appointment.vehicleId);
                const client = clients.find(c => c.id === appointment.clientId);
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
