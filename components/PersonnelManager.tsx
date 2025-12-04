

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Removed import from obsolete constants.ts.
import { Staff } from '../types';
import { useAppContext } from '../contexts/AppContext';
import Card from './common/Card';
import Button from './common/Button';
import { PlusIcon, SearchIcon } from './icons/Icons';
import AddStaffForm from './forms/AddStaffForm';
// import { getStaff } from '../services/api';

// MOCK DATA until API is connected
const MOCK_STAFF: Staff[] = [
    { id: 'staff-1', name: 'Alice', role: 'Manager', email: 'alice@garage.com', phone: '555-0101' },
    { id: 'staff-2', name: 'Bob', role: 'Mechanic', email: 'bob@garage.com', phone: '555-0102' },
];

const roleColorMap: { [key in Staff['role']]: string } = {
    'Manager': 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20',
    'Mechanic': 'bg-orange-500/10 text-orange-500 dark:text-orange-400 border border-orange-500/20',
    'Receptionist': 'bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20',
    'Detailer': 'bg-pink-500/10 text-pink-500 dark:text-pink-400 border border-pink-500/20',
};

const PersonnelManager: React.FC = () => {
  const { openModal, closeModal } = useAppContext();
  const { t } = useTranslation();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // getStaff().then(setStaff).catch(console.error);
    setStaff(MOCK_STAFF); // Placeholder
  }, []);

  const filteredStaff = staff.filter(s =>
    `${s.name} ${s.role} ${s.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
  const handleAddNewStaff = (staffData: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
        ...staffData,
        id: `staff-${Date.now()}`,
    };
    setStaff(prev => [newStaff, ...prev]);
    closeModal();
  };

  const handleAddStaffClick = () => {
    openModal(
        t('personnel.add_new'), 
        <AddStaffForm onAdd={handleAddNewStaff} />,
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
                    placeholder={t('personnel.search_placeholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
            </div>
            <Button onClick={handleAddStaffClick} icon={<PlusIcon />}>{t('personnel.add_button')}</Button>
        </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('personnel.header_name')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('personnel.header_role')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('personnel.header_email')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('personnel.header_phone')}</th>
              <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('personnel.header_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="p-4 font-medium text-gray-950 dark:text-white">{staff.name}</td>
                <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${roleColorMap[staff.role]}`}>
                        {t(`statuses.${staff.role}`)}
                    </span>
                </td>
                <td className="p-4 text-blue-500 dark:text-blue-400 text-sm">{staff.email}</td>
                <td className="p-4 text-sm">{staff.phone}</td>
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

export default PersonnelManager;
