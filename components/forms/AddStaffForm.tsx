

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Use relative paths for imports from other root-level directories.
import { Staff } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

interface AddStaffFormProps {
  onAdd: (staffData: Omit<Staff, 'id'>) => void;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ onAdd }) => {
  const { closeModal } = useAppContext();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [role, setRole] = useState<Staff['role']>('Mechanic');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Name and Email are required.');
      return;
    }
    onAdd({ name, role, email, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input id="staff-name" label={t('forms.label_full_name')} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <Select id="staff-role" label={t('forms.label_role')} value={role} onChange={(e) => setRole(e.target.value as Staff['role'])} required>
        <option value="Mechanic">{t('forms.role_mechanic')}</option>
        <option value="Manager">{t('forms.role_manager')}</option>
        <option value="Receptionist">{t('forms.role_receptionist')}</option>
        <option value="Detailer">{t('forms.role_detailer')}</option>
      </Select>
      <Input id="staff-email" label={t('forms.label_email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input id="staff-phone" label={t('forms.label_phone')} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      
      <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={closeModal}>{t('common.cancel')}</Button>
        <Button type="submit">{t('forms.button_add_staff')}</Button>
      </div>
    </form>
  );
};

export default AddStaffForm;
