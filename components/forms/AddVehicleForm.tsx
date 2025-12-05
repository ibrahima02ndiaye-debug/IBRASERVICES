import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Vehicle, Client } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { SearchIcon, CloudIcon } from '../icons/Icons';
import { getClients } from '../../client/src/services/api';

interface AddVehicleFormProps {
  onAdd: (vehicleData: Omit<Vehicle, 'id'>) => void;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ onAdd }) => {
  const { closeModal, userRole } = useAppContext();
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [vin, setVin] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [mileage, setMileage] = useState<number>(0);
  const [ownerId, setOwnerId] = useState(''); 
  const [status, setStatus] = useState<Vehicle['status']>('Available');
  const [isLookingUp, setIsLookingUp] = useState(false);
  
  useEffect(() => {
      if (userRole === 'Garage') {
        getClients().then(setClients).catch(console.error);
      }
  }, [userRole]);

  const handleVinLookup = async () => {
    if (!vin || vin.length < 5) {
      alert(t('forms.error_invalid_vin'));
      return;
    }
    // Future integration: Call real VIN API here
    alert("VIN Database lookup is not configured.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model) {
      alert('Make and Model are required.');
      return;
    }
    // For Garage role, ownerId is required
    if (userRole === 'Garage' && !ownerId) {
        alert('Owner is required.');
        return;
    }
    onAdd({ make, model, year, vin, licensePlate, mileage, ownerId: userRole === 'Client' ? 'self' : ownerId, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-md border border-blue-100 dark:border-blue-800">
        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1">
             <CloudIcon className="w-4 h-4" /> 
             Global VIN Database
        </span>
        <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online
        </span>
      </div>

      {userRole === 'Garage' && (
        <Select id="ownerId" label={t('forms.label_owner')} value={ownerId} onChange={e => setOwnerId(e.target.value)} required>
          <option value="" disabled>{t('forms.placeholder_select_client')}</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </Select>
      )}

      <div className="flex items-end gap-2">
         <div className="flex-1">
            <Input 
                id="vin" 
                label={t('forms.label_vin')} 
                value={vin} 
                onChange={e => setVin(e.target.value.toUpperCase())} 
                placeholder="e.g. 1G1..." 
                maxLength={17}
            />
         </div>
         <Button 
            type="button" 
            onClick={handleVinLookup} 
            disabled={isLookingUp} 
            className="mb-0.5 bg-indigo-600 hover:bg-indigo-700"
            title={t('forms.tooltip_vin_lookup')}
         >
            {isLookingUp ? (
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                    Running...
                </span>
            ) : (
                <>
                    <SearchIcon className="w-5 h-5" />
                    <span className="ml-2 hidden sm:inline">{t('forms.button_lookup')}</span>
                </>
            )}
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input id="make" label={t('forms.label_make')} value={make} onChange={e => setMake(e.target.value)} required />
        <Input id="model" label={t('forms.label_model')} value={model} onChange={e => setModel(e.target.value)} required />
        <Input id="year" label={t('forms.label_year')} type="number" value={year} onChange={e => setYear(parseInt(e.target.value, 10))} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input id="licensePlate" label={t('forms.label_license_plate')} value={licensePlate} onChange={e => setLicensePlate(e.target.value.toUpperCase())} />
        <Input id="mileage" label={t('forms.label_mileage')} type="number" value={mileage} onChange={e => setMileage(parseInt(e.target.value, 10))} />
      </div>
       
       {userRole === 'Garage' && (
        <Select id="status" label={t('forms.label_status')} value={status} onChange={e => setStatus(e.target.value as Vehicle['status'])} required>
            <option value="Available">{t('forms.status_available')}</option>
            <option value="In Service">{t('forms.status_in_service')}</option>
            <option value="Out of Service">{t('forms.status_out_of_service')}</option>
        </Select>
       )}

      <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={closeModal}>{t('common.cancel')}</Button>
        <Button type="submit">{t('forms.button_add_vehicle')}</Button>
      </div>
    </form>
  );
};

export default AddVehicleForm;