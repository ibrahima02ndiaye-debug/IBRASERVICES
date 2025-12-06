import React from 'react';
import { useTranslation } from 'react-i18next';
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
  CheckCircleIcon
} from './icons/Icons';

interface NavItemProps {
  view: View;
  label: string;
  icon: React.ReactElement;
  currentView: View;
  setCurrentView: (view: View) => void;
  isCompact?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, currentView, setCurrentView }) => {
  const isActive = currentView === view;
  return (
    <li className="mb-1">
      <button
        onClick={() => setCurrentView(view)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group relative ${
          isActive
            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })}
        </div>
        <span className="font-medium text-sm tracking-wide">{label}</span>
        
        {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/20 rounded-l-full"></div>}
      </button>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, userRole } = useAppContext();
  const { t } = useTranslation();

  const garageNavItems = [
    { section: 'Overview', items: [
        { view: 'dashboard' as View, label: t('nav.dashboard', 'Dashboard'), icon: <DashboardIcon /> },
        { view: 'workflow' as View, label: 'Workflow', icon: <CheckCircleIcon /> }, // New
    ]},
    { section: 'Management', items: [
        { view: 'appointments' as View, label: t('nav.appointments', 'Schedule'), icon: <CalendarIcon /> },
        { view: 'clients' as View, label: t('nav.clients', 'Clients'), icon: <UsersIcon /> },
        { view: 'vehicles' as View, label: t('nav.vehicles', 'Vehicles'), icon: <CarIcon /> },
        { view: 'inventory' as View, label: t('nav.inventory', 'Inventory'), icon: <PackageIcon /> },
    ]},
    { section: 'Operations', items: [
        { view: 'diagnostics' as View, label: t('nav.diagnostics', 'Diagnostics'), icon: <CpuIcon /> },
        { view: 'personnel' as View, label: t('nav.personnel', 'Staff'), icon: <BriefcaseIcon /> },
        { view: 'partners' as View, label: t('nav.partners', 'Vendors'), icon: <BuildingIcon /> },
    ]},
    { section: 'Finance', items: [
        { view: 'accounting' as View, label: t('nav.accounting', 'Finance'), icon: <DollarSignIcon /> },
    ]},
  ];

  const clientNavItems = [
    { section: 'My Garage', items: [
        { view: 'dashboard' as View, label: t('nav.dashboard', 'Dashboard'), icon: <DashboardIcon /> },
        { view: 'vehicles' as View, label: t('nav.vehicles', 'Vehicles'), icon: <CarIcon /> },
        { view: 'appointments' as View, label: t('nav.appointments', 'Appointments'), icon: <CalendarIcon /> },
    ]},
    { section: 'Support', items: [
        { view: 'messages' as View, label: t('nav.messages', 'Messages'), icon: <MessageSquareIcon /> },
    ]}
  ];

  const navStructure = userRole === 'Garage' ? garageNavItems : clientNavItems;

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-gray-800 flex-shrink-0 flex flex-col h-screen text-gray-300">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800/50">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <GarageIcon className="w-5 h-5 text-white" />
        </div>
        <div>
            <h1 className="text-base font-bold text-white leading-none tracking-tight">IBRA</h1>
            <p className="text-[10px] text-blue-400 font-semibold tracking-wider mt-1 uppercase">Service OS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        {navStructure.map((group, idx) => (
            <div key={idx} className="mb-6">
                <h3 className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{group.section}</h3>
                <ul>
                    {group.items.map((item) => (
                        <NavItem key={item.view} {...item} currentView={currentView} setCurrentView={setCurrentView} />
                    ))}
                </ul>
            </div>
        ))}
      </nav>

      {/* Footer / User Profile Snippet */}
      <div className="p-4 border-t border-gray-800/50">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 border border-gray-500 flex items-center justify-center text-xs font-bold text-white">
                  IN
              </div>
              <div className="text-left flex-1">
                  <p className="text-xs font-semibold text-white">Ibra Ndiaye</p>
                  <p className="text-[10px] text-gray-500">Admin</p>
              </div>
          </button>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </aside>
  );
};

export default Sidebar;