import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Appointment, AppointmentStatus, Vehicle, Client } from '../types';
import { getAppointments, getVehicles, getClients, updateAppointmentStatus } from '../client/src/services/api';
import { CalendarIcon, CarIcon, CheckCircleIcon, UsersIcon } from './icons/Icons';
import Skeleton from './common/Skeleton';

interface BoardColumn {
  id: AppointmentStatus;
  title: string;
  color: string;
}

const COLUMNS: BoardColumn[] = [
  { id: 'Scheduled', title: 'Scheduled', color: 'bg-blue-500' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-yellow-500' },
  { id: 'Waiting for Parts', title: 'Waiting for Parts', color: 'bg-orange-500' },
  { id: 'Quality Check', title: 'Quality Check', color: 'bg-purple-500' },
  { id: 'Completed', title: 'Completed', color: 'bg-green-500' }
];

const ServiceBoard: React.FC = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedAppointmentId, setDraggedAppointmentId] = useState<string | null>(null);

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
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedAppointmentId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: AppointmentStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    
    if (id) {
        // Optimistic UI Update
        setAppointments(prev => prev.map(app => 
            app.id === id ? { ...app, status: newStatus } : app
        ));

        try {
            await updateAppointmentStatus(id, newStatus);
        } catch (error) {
            console.error("Failed to update status", error);
            fetchData(); // Revert on fail
        }
    }
    setDraggedAppointmentId(null);
  };

  if (isLoading) {
      return (
          <div className="flex gap-4 h-full overflow-x-auto pb-4">
              {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="min-w-[300px] bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                      <Skeleton className="h-6 w-1/2 mb-4" />
                      <Skeleton className="h-24 w-full mb-3" />
                      <Skeleton className="h-24 w-full" />
                  </div>
              ))}
          </div>
      )
  }

  return (
    <div className="h-full flex flex-col">
        <div className="mb-6 flex justify-between items-center">
             <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop Workflow</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Drag and drop cards to update service status</p>
             </div>
             <div className="flex items-center gap-2">
                 {/* Filters could go here */}
             </div>
        </div>
        
        <div className="flex-1 flex gap-4 overflow-x-auto pb-6">
        {COLUMNS.map(column => {
            const columnAppointments = appointments.filter(a => a.status === column.id);
            
            return (
            <div 
                key={column.id}
                className="min-w-[300px] w-[300px] flex flex-col bg-gray-100 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800/50 backdrop-blur-sm"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur-md rounded-t-xl z-10">
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${column.color} shadow-[0_0_8px] shadow-${column.color.replace('bg-', '')}/50`}></span>
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">{column.title}</h3>
                    </div>
                    <span className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded-md text-xs font-mono font-medium text-gray-500">
                        {columnAppointments.length}
                    </span>
                </div>

                <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                    {columnAppointments.map(app => {
                        const vehicle = vehicles.find(v => v.id === app.vehicleId);
                        const client = clients.find(c => c.id === app.clientId);
                        
                        return (
                            <div
                                key={app.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, app.id)}
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md hover:border-blue-500/50 transition-all duration-200 group relative"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="mb-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{vehicle?.year} {vehicle?.make} {vehicle?.model}</h4>
                                    </div>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">{app.serviceType}</p>
                                </div>

                                <div className="space-y-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <UsersIcon className="w-3.5 h-3.5" />
                                        <span className="truncate">{client?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        <span>{new Date(app.date).toLocaleDateString()}</span>
                                    </div>
                                    {app.mechanic && (
                                        <div className="flex items-center gap-2 mt-2">
                                             <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold">
                                                {app.mechanic.charAt(0)}
                                             </div>
                                             <span className="text-xs text-gray-600 dark:text-gray-300">{app.mechanic}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            );
        })}
        </div>
        <style>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 4px;
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #475569;
            }
        `}</style>
    </div>
  );
};

export default ServiceBoard;