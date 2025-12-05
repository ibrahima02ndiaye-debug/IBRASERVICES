
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InventoryItem, Partner } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Select from '../common/Select';
import { getPartners } from '../../client/src/services/api';

interface AddInventoryItemFormProps {
  onAdd: (itemData: Omit<InventoryItem, 'id'>) => void;
}

const AddInventoryItemForm: React.FC<AddInventoryItemFormProps> = ({ onAdd }) => {
  const { closeModal } = useAppContext();
  const { t } = useTranslation();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [supplier, setSupplier] = useState('');

  useEffect(() => {
    getPartners().then(allPartners => {
      const suppliers = allPartners.filter(p => p.type === 'Parts Supplier');
      setPartners(suppliers);
      if (suppliers.length > 0) {
        setSupplier(suppliers[0].name);
      }
    }).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) {
      alert('Item Name and SKU are required.');
      return;
    }
    onAdd({ name, sku, quantity, lowStockThreshold, supplier });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="item-name"
        label={t('forms.label_item_name')}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        id="item-sku"
        label={t('forms.label_sku')}
        type="text"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="item-quantity"
          label={t('forms.label_initial_quantity')}
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          required
        />
        <Input
          id="item-threshold"
          label={t('forms.label_low_stock_threshold')}
          type="number"
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10))}
          required
        />
      </div>
      <Select id="item-supplier" label={t('forms.label_supplier')} value={supplier} onChange={(e) => setSupplier(e.target.value)} required>
        <option value="" disabled>{t('forms.placeholder_select_supplier')}</option>
        {partners.map(s => (
          <option key={s.id} value={s.name}>{s.name}</option>
        ))}
      </Select>
      <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={closeModal}>
          {t('common.cancel')}
        </Button>
        <Button type="submit">
          {t('forms.button_add_item')}
        </Button>
      </div>
    </form>
  );
};

export default AddInventoryItemForm;