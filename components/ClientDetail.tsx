import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import Card from './common/Card';
import Button from './common/Button';
import { ArrowLeftIcon } from './icons/Icons';
import { Client } from '../types';
import { getClientById } from '../client/src/services/api';
import Skeleton from './common/Skeleton';

const ClientDetail: React.FC = () => {
  const { selectedClientId, setCurrentView } = useAppContext();
  const { t } = useTranslation();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedClientId) {
      setIsLoading(true);
      getClientById(selectedClientId)
        .then(setClient)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [selectedClientId]);

  if (isLoading) {
    return (
        <Card className="p-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/4" />
        </Card>
    );
  }

  if (!client) {
    return (
      <Card>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">{t('clients.not_found')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('clients.not_found_description')}
          </p>
          <Button onClick={() => setCurrentView('clients')} className="mt-4">
            {t('clients.back_to_list')}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
       <Button onClick={() => setCurrentView('clients')} variant="secondary" icon={<ArrowLeftIcon />}>
            {t('clients.back_to_list')}
        </Button>
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold">{client.name}</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            <p><strong>{t('common.email')}:</strong> <a href={`mailto:${client.email}`} className="text-blue-500">{client.email}</a></p>
            <p><strong>{t('common.phone')}:</strong> <a href={`tel:${client.phone}`} className="text-blue-500">{client.phone}</a></p>
            <p className="md:col-span-2"><strong>{t('common.address')}:</strong> {client.address}</p>
          </div>
        </div>
      </Card>
      {/* Future sections: Vehicles, History, etc. can be added here fetching associated data */}
    </div>
  );
};

export default ClientDetail;