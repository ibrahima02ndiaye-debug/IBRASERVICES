
import React from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Use relative paths for imports from other root-level directories.
import { useAppContext } from '../contexts/AppContext';
import { View } from '../types';
import {
  DashboardIcon,
  CarIcon,
  UsersIcon,
  CalendarIcon,
  BriefcaseIcon,
  DollarSignIcon,
  BuildingIcon,
  MessageSquareIcon,
  CpuIcon,
  PackageIcon,
  GarageIcon,
} from './icons/Icons';

interface NavItemProps {
  view: View;
  label: string;
  icon: React.ReactElement;
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, currentView, setCurrentView }) => {
  const isActive = currentView === view;
  return (
    <li>
      <button
        onClick={() => setCurrentView(view)}
        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
        }`}
      >
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
        <span className="font-semibold">{label}</span>
      </button>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, userRole } = useAppContext();
  const { t } = useTranslation();

  const garageNavItems = [
    { view: 'dashboard' as View, label: t('views.dashboard'), icon: <DashboardIcon /> },
    { view: 'appointments' as View, label: t('views.appointments'), icon: <CalendarIcon /> },
    { view: 'clients' as View, label: t('views.clients'), icon: <UsersIcon /> },
    { view: 'vehicles' as View, label: t('views.vehicles'), icon: <CarIcon /> },
    { view: 'inventory' as View, label: t('views.inventory'), icon: <PackageIcon /> },
    { view: 'diagnostics' as View, label: t('views.diagnostics'), icon: <CpuIcon /> },
    { view: 'personnel' as View, label: t('views.personnel'), icon: <BriefcaseIcon /> },
    { view: 'accounting' as View, label: t('views.accounting'), icon: <DollarSignIcon /> },
    { view: 'partners' as View, label: t('views.partners'), icon: <BuildingIcon /> },
    { view: 'messages' as View, label: t('views.messages'), icon: <MessageSquareIcon /> },
  ];

  const clientNavItems = [
    { view: 'dashboard' as View, label: t('views.dashboard'), icon: <DashboardIcon /> },
    { view: 'vehicles' as View, label: t('views.vehicles'), icon: <CarIcon /> },
    { view: 'appointments' as View, label: t('views.appointments'), icon: <CalendarIcon /> },
    { view: 'messages' as View, label: t('views.messages'), icon: <MessageSquareIcon /> },
  ];

  const navItems = userRole === 'Garage' ? garageNavItems : clientNavItems;

  return (
    <aside className="w-64 bg-white/70 dark:bg-gray-900/60 backdrop-blur-lg border-r border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col p-4 shadow-sm">
      <div className="flex items-center space-x-2 px-4 py-2 mb-6">
        <GarageIcon className="w-9 h-9 text-blue-600 dark:text-blue-500" />
        <div>
            <h1 className="text-xl font-bold text-gray-950 dark:text-white leading-tight">IBRA Services</h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Mécanique & Transport</p>
        </div>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.view} {...item} currentView={currentView} setCurrentView={setCurrentView} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
