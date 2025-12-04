

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Use relative paths for imports from other root-level directories.
import { Client } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../common/Input';
import Button from '../common/Button';

interface AddClientFormProps {
  onAdd: (clientData: Omit<Client, 'id'>) => void;
}

const AddClientForm: React.FC<AddClientFormProps> = ({ onAdd }) => {
  const { closeModal } = useAppContext();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Name and Email are required.');
      return;
    }
    onAdd({ name, email, phone, address });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="client-name"
        label={t('forms.label_full_name')}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        id="client-email"
        label={t('forms.label_email')}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        id="client-phone"
        label={t('forms.label_phone')}
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Input
        id="client-address"
        label={t('forms.label_address')}
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={closeModal}>
          {t('common.cancel')}
        </Button>
        <Button type="submit">
          {t('forms.button_add_client')}
        </Button>
      </div>
    </form>
  );
};

export default AddClientForm;
