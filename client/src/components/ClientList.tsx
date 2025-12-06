import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Client, Vehicle, Appointment } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Card from './common/Card';
import Button from './common/Button';
import { PlusIcon, SearchIcon, PhoneIcon, EnvelopeIcon, CarIcon, CalendarIcon, FileTextIcon, ArrowLeftIcon, UsersIcon } from './icons/Icons';
import AddClientForm from './forms/AddClientForm';
import { getClients, createClient, getVehicles, getAppointments } from '../client/src/services/api';
import Skeleton from './common/Skeleton';

const ClientList: React.FC = () => {
  const { openModal, closeModal } = useAppContext();
  const { t } = useTranslation();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const [clis, vehs, apps] = await Promise.all([
            getClients(),
            getVehicles(),
            getAppointments()
        ]);
        setClients(clis);
        setVehicles(vehs);
        setAppointments(apps);
    } catch (error) {
        console.error("Failed to fetch client data:", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredClients = clients.filter(client =>
    `${client.name} ${client.email} ${client.phone}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
  const handleAddNewClient = async (clientData: Omit<Client, 'id'>) => {
    try {
        const newClient = await createClient(clientData);
        await fetchData();
        setSelectedClientId(newClient.id); // Auto-select new client
        closeModal();
    } catch (error) {
        console.error("Failed to create client", error);
        alert("Failed to create client.");
    }
  };

  const handleAddClientClick = () => {
    openModal(
        t('clients.add_new'), 
        <AddClientForm onAdd={handleAddNewClient} />,
        { showFooter: false }
    );
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const clientVehicles = vehicles.filter(v => v.ownerId === selectedClientId);
  const clientAppointments = appointments.filter(a => a.clientId === selectedClientId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // --- Render Functions ---

  const renderClientList = () => (
    <div className="bg-white dark:bg-gray-900 h-full flex flex-col border-r border-gray-200 dark:border-gray-800 w-full md:w-96">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
             <div className="flex justify-between items-center mb-4">
                 <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('nav.clients')}</h2>
                 <Button size="sm" onClick={handleAddClientClick} icon={<PlusIcon />}>New</Button>
             </div>
             <div className="relative">
                <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder={t('clients.search_placeholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {isLoading ? (
                [1,2,3,4,5].map(i => <div key={i} className="p-4 border-b border-gray-100 dark:border-gray-800/50"><Skeleton className="h-10 w-full rounded-lg" /></div>)
            ) : filteredClients.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">{t('clients.not_found')}</div>
            ) : (
                filteredClients.map(client => (
                    <button
                        key={client.id}
                        onClick={() => setSelectedClientId(client.id)}
                        className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 ${selectedClientId === client.id ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                    >
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${selectedClientId === client.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                             {client.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                         </div>
                         <div className="flex-1 min-w-0">
                             <h3 className={`font-semibold text-sm truncate ${selectedClientId === client.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>{client.name}</h3>
                             <p className="text-xs text-gray-500 truncate">{client.email}</p>
                         </div>
                    </button>
                ))
            )}
        </div>
    </div>
  );

  const renderClientDetail = () => {
      if (!selectedClient) {
          return (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-950 p-6">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <UsersIcon className="w-8 h-8 opacity-50" />
                  </div>
                  <p>{t('clients.not_found_description')}</p>
              </div>
          );
      }

      return (
          <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
              {/* Header Profile */}
              <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-8">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                       <div className="flex items-center gap-6">
                           <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/30">
                               {selectedClient.name.substring(0,2).toUpperCase()}
                           </div>
                           <div>
                               <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedClient.name}</h1>
                               <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                   <div className="flex items-center gap-1.5"><EnvelopeIcon className="w-4 h-4" /> {selectedClient.email}</div>
                                   <div className="flex items-center gap-1.5"><PhoneIcon className="w-4 h-4" /> {selectedClient.phone}</div>
                               </div>
                               <div className="mt-1 text-sm text-gray-500">{selectedClient.address}</div>
                           </div>
                       </div>
                       <div className="flex gap-3">
                           <Button variant="secondary" icon={<PhoneIcon />}>Call</Button>
                           <Button variant="secondary" icon={<EnvelopeIcon />}>Email</Button>
                       </div>
                   </div>
              </div>

              {/* Dashboard Grid */}
              <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
                   {/* Vehicles Column */}
                   <div className="xl:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <CarIcon className="w-5 h-5 text-blue-500" /> 
                                Vehicles
                                <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300 ml-2">{clientVehicles.length}</span>
                            </h3>
                            <Button size="sm" variant="secondary" icon={<PlusIcon />}>Add Vehicle</Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {clientVehicles.length === 0 ? (
                                <div className="col-span-2 p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center text-gray-500">
                                    No vehicles registered.
                                </div>
                            ) : (
                                clientVehicles.map(veh => (
                                    <Card key={veh.id} className="group hover:border-blue-500 transition-colors cursor-pointer">
                                        <div className="p-5">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{veh.year} {veh.make} {veh.model}</h4>
                                                    <p className="text-sm font-mono text-gray-500 mt-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded inline-block">{veh.licensePlate}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${veh.status === 'In Service' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                    {veh.status}
                                                </span>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between text-sm text-gray-500">
                                                <span>{veh.mileage.toLocaleString()} km</span>
                                                <span className="font-mono text-xs opacity-70">VIN: {veh.vin}</span>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Recent History */}
                        <div className="pt-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <FileTextIcon className="w-5 h-5 text-orange-500" />
                                Service History
                            </h3>
                            <Card className="overflow-hidden">
                                {clientAppointments.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">No service history available.</div>
                                ) : (
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500">
                                            <tr>
                                                <th className="p-4 font-medium">Date</th>
                                                <th className="p-4 font-medium">Vehicle</th>
                                                <th className="p-4 font-medium">Service</th>
                                                <th className="p-4 font-medium">Status</th>
                                                <th className="p-4 font-medium text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {clientAppointments.map(app => {
                                                const v = vehicles.find(v => v.id === app.vehicleId);
                                                return (
                                                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                        <td className="p-4">{new Date(app.date).toLocaleDateString()}</td>
                                                        <td className="p-4 text-gray-900 dark:text-white font-medium">{v ? `${v.make} ${v.model}` : '-'}</td>
                                                        <td className="p-4">{app.serviceType}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-0.5 rounded-full text-xs ${app.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                                {app.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right font-mono text-gray-600 dark:text-gray-400">-</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </Card>
                        </div>
                   </div>

                   {/* Sidebar Info Column */}
                   <div className="space-y-6">
                        <Card className="p-5">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4">Upcoming</h3>
                            {/* Filter for future appointments */}
                            {clientAppointments.filter(a => new Date(a.date) > new Date()).length === 0 ? (
                                <p className="text-sm text-gray-500">No upcoming appointments.</p>
                            ) : (
                                <div className="space-y-3">
                                    {clientAppointments.filter(a => new Date(a.date) > new Date()).map(app => (
                                        <div key={app.id} className="flex gap-3 items-start p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                            <div className="bg-white dark:bg-gray-800 rounded p-1.5 shadow-sm text-center min-w-[3rem]">
                                                <span className="block text-xs font-bold text-gray-400 uppercase">{new Date(app.date).toLocaleString('default', {month:'short'})}</span>
                                                <span className="block text-lg font-bold text-gray-900 dark:text-white leading-none">{new Date(app.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">{app.serviceType}</p>
                                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">{new Date(app.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Button className="w-full mt-4" size="sm" icon={<CalendarIcon />}>Schedule Service</Button>
                        </Card>

                        <Card className="p-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-2">Lifetime Value</h3>
                            <div className="text-3xl font-bold mb-1">$0.00</div>
                            <p className="text-xs text-gray-400">Total revenue from this client</p>
                        </Card>
                   </div>
              </div>
          </div>
      );
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Mobile: Show list if no client selected, show detail if selected */}
        <div className={`w-full md:w-96 flex-shrink-0 flex flex-col ${selectedClientId ? 'hidden md:flex' : 'flex'}`}>
            {renderClientList()}
        </div>
        
        {/* Mobile: Detail view overlay behavior handled by CSS hidden logic above */}
        <div className={`flex-1 flex flex-col h-full overflow-hidden ${!selectedClientId ? 'hidden md:flex' : 'flex'}`}>
             {selectedClientId && (
                 <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-2">
                     <Button variant="secondary" size="sm" onClick={() => setSelectedClientId(null)} icon={<ArrowLeftIcon />}>Back to List</Button>
                 </div>
             )}
             {renderClientDetail()}
        </div>
    </div>
  );
};

export default ClientList;