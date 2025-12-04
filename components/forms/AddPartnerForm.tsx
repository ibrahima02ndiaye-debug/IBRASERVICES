

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Use relative paths for imports from other root-level directories.
import { Partner } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

interface AddPartnerFormProps {
  onAdd: (partnerData: Omit<Partner, 'id'>) => void;
}

const AddPartnerForm: React.FC<AddPartnerFormProps> = ({ onAdd }) => {
  const { closeModal } = useAppContext();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [type, setType] = useState<Partner['type']>('Parts Supplier');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactPerson) {
      alert('Partner Name and Contact Person are required.');
      return;
    }
    onAdd({ name, type, contactPerson, email, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input id="partner-name" label={t('forms.label_partner_name')} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <Select id="partner-type" label={t('forms.label_type')} value={type} onChange={(e) => setType(e.target.value as Partner['type'])} required>
        <option value="Parts Supplier">{t('forms.type_parts_supplier')}</option>
        <option value="Insurance">{t('forms.type_insurance')}</option>
        <option value="Towing Service">{t('forms.type_towing')}</option>
        <option value="Detailing Specialist">{t('forms.type_detailing')}</option>
      </Select>
      <Input id="partner-contact" label={t('forms.label_contact_person')} type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
      <Input id="partner-email" label={t('forms.label_email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input id="partner-phone" label={t('forms.label_phone')} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      
      <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={closeModal}>{t('common.cancel')}</Button>
        <Button type="submit">{t('forms.button_add_partner')}</Button>
      </div>
    </form>
  );
};

export default AddPartnerForm;
