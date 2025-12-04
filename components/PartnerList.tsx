

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Removed import from obsolete constants.ts.
import { Partner } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Card from './common/Card';
import Button from './common/Button';
import { PlusIcon, SearchIcon } from './icons/Icons';
import AddPartnerForm from './forms/AddPartnerForm';
// import { getPartners } from '../services/api';

// MOCK DATA until API is connected
const MOCK_PARTNERS: Partner[] = [
    { id: 'part-1', name: 'Auto Parts Pro', type: 'Parts Supplier', contactPerson: 'Mike', email: 'mike@app.com', phone: '555-0201' },
    { id: 'part-2', name: 'Secure Insurance', type: 'Insurance', contactPerson: 'Sarah', email: 'sarah@secure.com', phone: '555-0202' },
];

const PartnerList: React.FC = () => {
  const { openModal, closeModal } = useAppContext();
  const { t } = useTranslation();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // getPartners().then(setPartners).catch(console.error);
    setPartners(MOCK_PARTNERS); // Placeholder
  }, []);

  const filteredPartners = partners.filter(partner =>
    `${partner.name} ${partner.type} ${partner.contactPerson} ${partner.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleAddNewPartner = (partnerData: Omit<Partner, 'id'>) => {
    const newPartner: Partner = {
        ...partnerData,
        id: `part-${Date.now()}`,
    };
    setPartners(prev => [newPartner, ...prev]);
    closeModal();
  };

  const handleAddPartnerClick = () => {
    openModal(
        t('partners.add_new'), 
        <AddPartnerForm onAdd={handleAddNewPartner} />,
        { showFooter: false }
    );
  };

  return (
    <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div className="relative">
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder={t('partners.search_placeholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
            </div>
            <Button onClick={handleAddPartnerClick} icon={<PlusIcon />}>{t('partners.add_button')}</Button>
        </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('partners.header_name')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('partners.header_type')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('partners.header_contact_person')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('partners.header_email')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('partners.header_phone')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('partners.header_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map((partner) => (
              <tr key={partner.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="p-4 font-medium text-gray-950 dark:text-white">{partner.name}</td>
                <td className="p-4 text-sm">{partner.type}</td>
                <td className="p-4 text-sm">{partner.contactPerson}</td>
                <td className="p-4 text-blue-500 dark:text-blue-400 text-sm">{partner.email}</td>
                <td className="p-4 text-sm">{partner.phone}</td>
                <td className="p-4 space-x-2">
                    <Button variant="secondary" size="sm">{t('common.edit')}</Button>
                    <Button variant="danger" size="sm">{t('common.delete')}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PartnerList;
