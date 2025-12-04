

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Use relative paths for imports from other root-level directories.
import { FinancialRecord } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

interface AddTransactionFormProps {
  onAdd: (transactionData: Omit<FinancialRecord, 'id' | 'invoiceId'>) => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onAdd }) => {
  const { closeModal } = useAppContext();
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [type, setType] = useState<FinancialRecord['type']>('Income');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) {
      alert('Valid Description and Amount are required.');
      return;
    }
    onAdd({ description, type, amount, date });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input id="trans-desc" label={t('forms.label_description')} type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select id="trans-type" label={t('forms.label_type')} value={type} onChange={(e) => setType(e.target.value as FinancialRecord['type'])} required>
          <option value="Income">{t('forms.type_income')}</option>
          <option value="Expense">{t('forms.type_expense')}</option>
        </Select>
        <Input id="trans-amount" label={t('forms.label_amount')} type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} required min="0.01" step="0.01" />
      </div>
      <Input id="trans-date" label={t('forms.label_date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      
      <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={closeModal}>{t('common.cancel')}</Button>
        <Button type="submit">{t('forms.button_add_transaction')}</Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
