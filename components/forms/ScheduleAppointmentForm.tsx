
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Appointment, Client, Vehicle, Staff } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { getClients, getVehicles, getStaff } from '../../client/src/services/api';

interface ScheduleAppointmentFormProps {
  onSchedule: (appointmentData: Omit<Appointment, 'id'>) => void;
}

const ScheduleAppointmentForm: React.FC<ScheduleAppointmentFormProps> = ({ onSchedule }) => {
  const { closeModal, userRole } = useAppContext();
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  const [clientId, setClientId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 16));
  const [serviceType, setServiceType] = useState('');
  const [mechanic, setMechanic] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadData = async () => {
        try {
            if (userRole === 'Garage') {
                const [clis, stf] = await Promise.all([getClients(), getStaff()]);
                setClients(clis);
                setStaff(stf);
            }
            const vehs = await getVehicles();
            setVehicles(vehs);
        } catch (e) {
            console.error(e);
        }
    };
    loadData();
  }, [userRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === 'Garage' && !clientId) {
        alert('Client is required');
        return;
    }
    if (!vehicleId || !date || !serviceType) {
      alert('Vehicle, date, and service type are required.');
      return;
    }
    onSchedule({
      clientId: userRole === 'Client' ? 'self' : clientId,
      vehicleId,
      date,
      serviceType,
      mechanic,
      status: 'Scheduled',
      notes,
    });
  };

  const clientVehicles = userRole === 'Garage' 
    ? vehicles.filter(v => v.ownerId === clientId)
    : vehicles; 
    
  const mechanics = staff.filter(s => s.role === 'Mechanic');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {userRole === 'Garage' && (
        <Select id="clientId" label={t('forms.label_client')} value={clientId} onChange={e => { setClientId(e.target.value); setVehicleId(''); }} required>
          <option value="" disabled>{t('forms.placeholder_select_client')}</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </Select>
      )}
      <Select id="vehicleId" label={t('forms.label_vehicle')} value={vehicleId} onChange={e => setVehicleId(e.target.value)} required disabled={userRole === 'Garage' && !clientId}>
        <option value="" disabled>{t('forms.placeholder_select_vehicle')}</option>
        {clientVehicles.map(vehicle => (
          <option key={vehicle.id} value={vehicle.id}>{vehicle.year} {vehicle.make} {vehicle.model}</option>
        ))}
      </Select>
      <Input id="serviceType" label={t('forms.label_service_type')} value={serviceType} onChange={e => setServiceType(e.target.value)} placeholder={t('forms.placeholder_service_type')} required />
      <Input id="date" label={t('forms.label_datetime')} type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
      
      {userRole === 'Garage' && (
        <Select id="mechanic" label={t('forms.label_assign_mechanic')} value={mechanic} onChange={e => setMechanic(e.target.value)}>
          <option value="">{t('forms.placeholder_assign_later')}</option>
          {mechanics.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
        </Select>
      )}
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">{t('forms.label_notes')}</label>
        <textarea id="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm px-3 py-2 text-gray-950 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={closeModal}>{t('common.cancel')}</Button>
        <Button type="submit">{t('forms.button_schedule')}</Button>
      </div>
    </form>
  );
};

export default ScheduleAppointmentForm;