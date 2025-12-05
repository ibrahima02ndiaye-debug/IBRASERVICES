
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InventoryItem } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Card from './common/Card';
import Button from './common/Button';
import { PlusIcon, SearchIcon } from './icons/Icons';
import AddInventoryItemForm from './forms/AddInventoryItemForm';
import { getInventory, createInventoryItem, deleteInventoryItem } from '../client/src/services/api';

const Inventory: React.FC = () => {
  const { openModal, closeModal } = useAppContext();
  const { t } = useTranslation();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInventory = () => {
    getInventory().then(setInventory).catch(console.error);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(item =>
    `${item.name} ${item.sku} ${item.supplier}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleAddItem = async (itemData: Omit<InventoryItem, 'id'>) => {
    try {
        await createInventoryItem(itemData);
        closeModal();
        fetchInventory();
    } catch (error) {
        console.error("Failed to add inventory item", error);
        alert("Failed to add item.");
    }
  };

  const handleDeleteItem = async (id: string) => {
      if(window.confirm("Are you sure you want to delete this item?")) {
          try {
              await deleteInventoryItem(id);
              fetchInventory();
          } catch (error) {
              console.error("Failed to delete item", error);
          }
      }
  }

  const handleAddItemClick = () => {
    openModal(
      t('inventory.add_new'),
      <AddInventoryItemForm onAdd={handleAddItem} />,
      { showFooter: false }
    );
  };

  const getStockLevelColor = (quantity: number, threshold: number) => {
    if (quantity <= threshold) return 'bg-red-500';
    if (quantity <= threshold * 1.5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div className="relative">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('inventory.search_placeholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>
        <Button onClick={handleAddItemClick} icon={<PlusIcon />}>{t('inventory.add_button')}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('inventory.header_item_name')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('inventory.header_sku')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('inventory.header_supplier')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('inventory.header_quantity')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('inventory.header_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                        No inventory items found.
                    </td>
                </tr>
            ) : filteredInventory.map((item) => {
              const maxStock = item.lowStockThreshold * 3;
              const stockPercentage = Math.min((item.quantity / maxStock) * 100, 100);

              return (
              <tr key={item.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="p-4 font-medium text-gray-950 dark:text-white">{item.name}</td>
                <td className="p-4 font-mono text-sm">{item.sku}</td>
                <td className="p-4 text-sm">{item.supplier}</td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{item.quantity}</span>
                    <div className="w-32 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className={`h-2.5 rounded-full ${getStockLevelColor(item.quantity, item.lowStockThreshold)}`}
                        style={{ width: `${stockPercentage}%`}}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-4 space-x-2">
                    <Button variant="secondary" size="sm">{t('common.edit')}</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteItem(item.id)}>{t('common.delete')}</Button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default Inventory;