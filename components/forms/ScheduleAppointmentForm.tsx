

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Appointment, Client, Vehicle, Staff } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
// FIX: Removed imports from obsolete constants.ts.
// import { getClients, getVehicles, getStaff } from '../../services/api';

// MOCK DATA until API is connected
const MOCK_CLIENTS: Client[] = [
    { id: 'cli-1', name: 'John Doe', email: 'john.doe@example.com', phone: '555-1234', address: '123 Main St' },
    { id: 'cli-2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-5678', address: '456 Oak Ave' },
];
const MOCK_VEHICLES: Vehicle[] = [
    { id: 'veh-1', make: 'Toyota', model: 'Camry', year: 2021, vin: '12345ABC', licensePlate: 'XYZ 123', mileage: 45000, ownerId: 'cli-1', status: 'Available' },
    { id: 'veh-2', make: 'Honda', model: 'Civic', year: 2020, vin: '67890DEF', licensePlate: 'ABC 456', mileage: 60000, ownerId: 'cli-2', status: 'In Service' },
];
const MOCK_STAFF: Staff[] = [
    { id: 'staff-2', name: 'Bob', role: 'Mechanic', email: 'bob@garage.com', phone: '555-0102' },
];

interface ScheduleAppointmentFormProps {
  onSchedule: (appointmentData: Omit<Appointment, 'id'>) => void;
}

const ScheduleAppointmentForm: React.FC<ScheduleAppointmentFormProps> = ({ onSchedule }) => {
  const { closeModal, userRole } = useAppContext();
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);

  const [clientId, setClientId] = useState(userRole === 'Client' ? 'cli-2' : '');
  const [vehicleId, setVehicleId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 16));
  const [serviceType, setServiceType] = useState('');
  const [mechanic, setMechanic] = useState('');
  const [notes, setNotes] = useState('');

  // useEffect(() => {
  //   if (userRole === 'Garage') {
  //     getClients().then(setClients);
  //     getStaff().then(setStaff);
  //   }
  //   getVehicles().then(setVehicles);
  // }, [userRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !vehicleId || !date || !serviceType) {
      alert('All fields except notes are required.');
      return;
    }
    onSchedule({
      clientId,
      vehicleId,
      date,
      serviceType,
      mechanic,
      status: 'Scheduled',
      notes,
    });
  };

  const clientVehicles = vehicles.filter(v => v.ownerId === clientId);
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
      <Select id="vehicleId" label={t('forms.label_vehicle')} value={vehicleId} onChange={e => setVehicleId(e.target.value)} required disabled={!clientId}>
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
