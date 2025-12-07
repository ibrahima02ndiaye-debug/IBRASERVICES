import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';
import {
    TruckIcon,
    CheckCircleIcon,
    AlertTriangleIcon,
    CalendarIcon,
    DollarSignIcon,
    ToolIcon,
    MapPinIcon,
    UserIcon
} from './icons/Icons';

interface FleetVehicle {
    id: string;
    name: string;
    type: 'Taxi' | 'Delivery' | 'Service';
    licensePlate: string;
    vin: string;
    driver?: string;
    status: 'Active' | 'Maintenance' | 'Inactive';
    mileage: number;
    nextService: string;
    monthlyRevenue: number;
    maintenanceCost: number;
    location?: string;
}

const FleetManagement: React.FC = () => {
    const { t } = useTranslation();

    const [vehicles, setVehicles] = useState<FleetVehicle[]>([
        {
            id: '1',
            name: 'Taxi #101',
            type: 'Taxi',
            licensePlate: 'ABC 123',
            vin: '1HGCM82633A123456',
            driver: 'Jean Tremblay',
            status: 'Active',
            mileage: 145000,
            nextService: '2025-01-15',
            monthlyRevenue: 4500,
            maintenanceCost: 350,
            location: 'En service - Centre-ville',
        },
        {
            id: '2',
            name: 'Livraison #201',
            type: 'Delivery',
            licensePlate: 'XYZ 789',
            vin: '1HGCM82633A789012',
            driver: 'Marie Gagnon',
            status: 'Active',
            mileage: 98000,
            nextService: '2025-02-01',
            monthlyRevenue: 3200,
            maintenanceCost: 280,
            location: 'En livraison - Shawinigan',
        },
        {
            id: '3',
            name: 'Taxi #102',
            type: 'Taxi',
            licensePlate: 'DEF 456',
            vin: '1HGCM82633A456789',
            status: 'Maintenance',
            mileage: 187000,
            nextService: '2024-12-20',
            monthlyRevenue: 0,
            maintenanceCost: 850,
            location: 'Garage IBRA',
        },
    ]);

    const [filter, setFilter] = useState<'all' | FleetVehicle['type']>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | FleetVehicle['status']>('all');

    const filteredVehicles = vehicles.filter(v => {
        const typeMatch = filter === 'all' || v.type === filter;
        const statusMatch = statusFilter === 'all' || v.status === statusFilter;
        return typeMatch && statusMatch;
    });

    const stats = {
        total: vehicles.length,
        active: vehicles.filter(v => v.status === 'Active').length,
        maintenance: vehicles.filter(v => v.status === 'Maintenance').length,
        totalRevenue: vehicles.reduce((sum, v) => sum + v.monthlyRevenue, 0),
        totalCosts: vehicles.reduce((sum, v) => sum + v.maintenanceCost, 0),
    };

    const handleAddVehicle = () => {
        // Open modal for adding new vehicle
        alert('Add vehicle modal would open here');
    };

    const handleScheduleMaintenance = (vehicleId: string) => {
        alert(`Schedule maintenance for vehicle ${vehicleId}`);
    };

    const handleAssignDriver = (vehicleId: string) => {
        alert(`Assign driver to vehicle ${vehicleId}`);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Gestion de Flotte
                    </h1>
                    <p className="text-sm text-gray-500">
                        Gérez vos véhicules de taxi et livraison
                    </p>
                </div>
                <Button onClick={handleAddVehicle} icon={<TruckIcon />}>
                    Ajouter Véhicule
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <TruckIcon className="w-8 h-8 opacity-80" />
                    </div>
                    <p className="text-sm opacity-90">Total Véhicules</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircleIcon className="w-8 h-8 opacity-80" />
                    </div>
                    <p className="text-sm opacity-90">En Service</p>
                    <p className="text-3xl font-bold">{stats.active}</p>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <ToolIcon className="w-8 h-8 opacity-80" />
                    </div>
                    <p className="text-sm opacity-90">Maintenance</p>
                    <p className="text-3xl font-bold">{stats.maintenance}</p>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSignIcon className="w-8 h-8 opacity-80" />
                    </div>
                    <p className="text-sm opacity-90">Revenus/Mois</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSignIcon className="w-8 h-8 opacity-80" />
                    </div>
                    <p className="text-sm opacity-90">Coûts/Mois</p>
                    <p className="text-2xl font-bold">${stats.totalCosts.toLocaleString()}</p>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="flex gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">
                            Type:
                        </span>
                        {(['all', 'Taxi', 'Delivery', 'Service'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === type
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                    }`}
                            >
                                {type === 'all' ? 'Tous' : type}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">
                            Statut:
                        </span>
                        {(['all', 'Active', 'Maintenance', 'Inactive'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === status
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                    }`}
                            >
                                {status === 'all' ? 'Tous' : status}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Vehicle List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredVehicles.map(vehicle => (
                    <Card key={vehicle.id} className="p-6 hover:shadow-xl transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {vehicle.name}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${vehicle.status === 'Active'
                                                ? 'bg-green-100 text-green-700'
                                                : vehicle.status === 'Maintenance'
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {vehicle.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">{vehicle.licensePlate} • {vehicle.type}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <TruckIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-gray-500">Kilométrage</p>
                                <p className="font-bold text-gray-900 dark:text-white">
                                    {vehicle.mileage.toLocaleString()} km
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Prochain Service</p>
                                <p className="font-bold text-gray-900 dark:text-white">
                                    {new Date(vehicle.nextService).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Revenus/Mois</p>
                                <p className="font-bold text-green-600">
                                    ${vehicle.monthlyRevenue.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Coûts/Mois</p>
                                <p className="font-bold text-red-600">
                                    ${vehicle.maintenanceCost.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {vehicle.driver && (
                            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium">{vehicle.driver}</span>
                            </div>
                        )}

                        {vehicle.location && (
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-2">
                                <MapPinIcon className="w-4 h-4 text-blue-600" />
                                <span className="text-sm">{vehicle.location}</span>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleScheduleMaintenance(vehicle.id)}
                                icon={<CalendarIcon />}
                            >
                                Maintenance
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleAssignDriver(vehicle.id)}
                                icon={<UserIcon />}
                            >
                                Chauffeur
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Performance Chart */}
            <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Performance de la Flotte</h3>
                <div className="space-y-4">
                    {filteredVehicles.map(vehicle => {
                        const profit = vehicle.monthlyRevenue - vehicle.maintenanceCost;
                        const profitMargin = vehicle.monthlyRevenue > 0
                            ? (profit / vehicle.monthlyRevenue) * 100
                            : 0;

                        return (
                            <div key={vehicle.id}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">{vehicle.name}</span>
                                    <span className={`font-bold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${profit.toLocaleString()} ({profitMargin.toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${profit > 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${Math.min(Math.abs(profitMargin), 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default FleetManagement;
