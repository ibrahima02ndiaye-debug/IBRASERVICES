import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Client } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Card from './common/Card';
import Button from './common/Button';
import { PlusIcon, SearchIcon } from './icons/Icons';
import AddClientForm from './forms/AddClientForm';
import { getClients } from '../client/src/services/api';
import Skeleton from './common/Skeleton';

// FALLBACK DATA (If DB is empty or server offline)
const MOCK_CLIENTS: Client[] = [
    { id: 'cli-1', name: 'John Doe', email: 'john.doe@example.com', phone: '555-1234', address: '123 Main St, Anytown, USA' },
    { id: 'cli-2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-5678', address: '456 Oak Ave, Anytown, USA' },
    { id: 'cli-3', name: 'Bob Johnson', email: 'bob.j@example.com', phone: '555-9012', address: '789 Pine Ln, Anytown, USA' },
];

const ClientList: React.FC = () => {
  const { openModal, closeModal, setCurrentView, setSelectedClientId } = useAppContext();
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getClients();
            setClients(data);
        } catch (error) {
            console.error("Failed to fetch clients (Server might be offline):", error);
            // Fallback to mock data so UI doesn't break during demo
            setClients(MOCK_CLIENTS);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);

  const filteredClients = clients.filter(client =>
    `${client.name} ${client.email} ${client.phone}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
  const handleAddNewClient = (clientData: Omit<Client, 'id'>) => {
    // In real app, POST to API here
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`
    };
    setClients(prev => [newClient, ...prev]);
    closeModal();
  };

  const handleAddClientClick = () => {
    openModal(
        t('clients.add_new'), 
        <AddClientForm onAdd={handleAddNewClient} />,
        { showFooter: false }
    );
  };

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView('client-detail');
  };

  return (
    <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div className="relative">
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder={t('clients.search_placeholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
            </div>
            <Button onClick={handleAddClientClick} icon={<PlusIcon />}>{t('clients.add_button')}</Button>
        </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('clients.header_name')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('clients.header_contact')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('clients.header_address')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                // Loading Skeletons
                [1,2,3].map(i => (
                    <tr key={i} className="border-b border-gray-200 dark:border-gray-800">
                        <td className="p-4"><Skeleton className="h-6 w-32" /></td>
                        <td className="p-4"><Skeleton className="h-10 w-40" /></td>
                        <td className="p-4"><Skeleton className="h-6 w-48" /></td>
                    </tr>
                ))
            ) : filteredClients.length === 0 ? (
                <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">
                        No clients found.
                    </td>
                </tr>
            ) : (
                filteredClients.map((client) => (
                <tr 
                    key={client.id} 
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => handleClientClick(client.id)}
                >
                    <td className="p-4 font-medium text-gray-950 dark:text-white">{client.name}</td>
                    <td className="p-4">
                        <div className="text-sm text-blue-500 dark:text-blue-400">{client.email}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{client.phone}</div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">{client.address}</td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ClientList;