import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Vehicle } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Card from './common/Card';
import Button from './common/Button';
import { PlusIcon, SearchIcon } from './icons/Icons';
import AddVehicleForm from './forms/AddVehicleForm';
import { getVehicles } from '../client/src/services/api';
import Skeleton from './common/Skeleton';

// MOCK DATA Fallback
const MOCK_VEHICLES: Vehicle[] = [
    { id: 'veh-1', make: 'Toyota', model: 'Camry', year: 2021, vin: '12345ABC', licensePlate: 'XYZ 123', mileage: 45000, ownerId: 'cli-1', status: 'Available' },
    { id: 'veh-2', make: 'Honda', model: 'Civic', year: 2020, vin: '67890DEF', licensePlate: 'ABC 456', mileage: 60000, ownerId: 'cli-2', status: 'In Service' },
    { id: 'veh-3', make: 'Ford', model: 'F-150', year: 2019, vin: '45678GHI', licensePlate: 'TRK 789', mileage: 85000, ownerId: 'cli-3', status: 'Available' },
    { id: 'veh-4', make: 'BMW', model: '330i', year: 2023, vin: '98765JKL', licensePlate: 'LUX 456', mileage: 12000, ownerId: 'cli-4', status: 'Out of Service' },
];

const statusColorMap: { [key in Vehicle['status']]: string } = {
  'Available': 'bg-green-500/10 text-green-500 dark:text-green-400 border border-green-500/20',
  'In Service': 'bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border border-yellow-500/20',
  'Out of Service': 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20',
};

const VehicleList: React.FC = () => {
  const { openModal, closeModal } = useAppContext();
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getVehicles();
            setVehicles(data);
        } catch (error) {
            console.warn("Failed to fetch vehicles (Server might be offline). Using mock data.", error);
            setVehicles(MOCK_VEHICLES);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle =>
    `${vehicle.make} ${vehicle.model} ${vehicle.vin} ${vehicle.licensePlate}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleAddNewVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`
    };
    setVehicles(prev => [newVehicle, ...prev]);
    closeModal();
  };

  const handleAddVehicleClick = () => {
    openModal(
        t('vehicles.add_new'), 
        <AddVehicleForm onAdd={handleAddNewVehicle} />,
        { showFooter: false }
    );
  };

  return (
    <Card>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div className="relative">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('vehicles.search_placeholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>
        <Button onClick={handleAddVehicleClick} icon={<PlusIcon />}>{t('vehicles.add_button')}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('vehicles.header_vehicle')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('vehicles.header_vin')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('vehicles.header_license_plate')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('vehicles.header_mileage')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('vehicles.header_status')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('vehicles.header_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                [1,2,3].map(i => (
                    <tr key={i} className="border-b border-gray-200 dark:border-gray-800">
                        <td className="p-4"><Skeleton className="h-6 w-32" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                        <td className="p-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                        <td className="p-4"><Skeleton className="h-8 w-16 rounded" /></td>
                    </tr>
                ))
            ) : filteredVehicles.length === 0 ? (
                <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                        No vehicles found.
                    </td>
                </tr>
            ) : (
                filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                        <div className="font-medium text-gray-950 dark:text-white">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                    </td>
                    <td className="p-4 font-mono text-xs">{vehicle.vin}</td>
                    <td className="p-4 font-mono text-sm">{vehicle.licensePlate}</td>
                    <td className="p-4 text-sm">{vehicle.mileage.toLocaleString()} km</td>
                    <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColorMap[vehicle.status]}`}>
                        {t(`statuses.${vehicle.status}`)}
                    </span>
                    </td>
                    <td className="p-4 space-x-2">
                    <Button variant="secondary" size="sm">{t('common.edit')}</Button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default VehicleList;