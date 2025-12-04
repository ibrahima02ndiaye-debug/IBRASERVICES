
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import { SunIcon, MoonIcon, GarageIcon, UsersIcon, CloseIcon } from './icons/Icons';
import Button from './common/Button';

const Header: React.FC = () => {
  const { userRole, setUserRole, theme, setTheme, currentView, logout } = useAppContext();
  const { i18n, t } = useTranslation();

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleRoleChange = () => {
    setUserRole(userRole === 'Garage' ? 'Client' : 'Garage');
  }
  
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const getTitle = (view: string) => {
    switch(view) {
        case 'dashboard': return t('nav.dashboard', 'Tableau de bord');
        case 'vehicles': return t('nav.vehicles', 'Véhicules');
        case 'clients': return t('nav.clients', 'Clients');
        case 'client-detail': return t('nav.client_detail', 'Détails du client');
        case 'appointments': return t('nav.appointments', 'Rendez-vous');
        case 'personnel': return t('nav.personnel', 'Personnel');
        case 'accounting': return t('nav.accounting', 'Comptabilité');
        case 'partners': return t('nav.partners', 'Partenaires');
        case 'messages': return t('nav.messages', 'Messagerie');
        case 'diagnostics': return t('nav.diagnostics', 'Diagnostic IA');
        case 'inventory': return t('nav.inventory', 'Inventaire');
        default: return t(`nav.${view.replace('-', '_')}`, view.charAt(0).toUpperCase() + view.slice(1));
    }
  };

  return (
    <header className="flex-shrink-0 bg-white/70 dark:bg-gray-900/60 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 flex items-center justify-between p-4 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-950 dark:text-white">{getTitle(currentView)}</h2>
      <div className="flex items-center space-x-4">

        <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 rounded-full p-1">
            <button onClick={() => handleLanguageChange('en')} className={`px-3 py-1 text-sm rounded-full transition-colors ${i18n.language.startsWith('en') ? 'font-semibold bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>EN</button>
            <button onClick={() => handleLanguageChange('fr')} className={`px-3 py-1 text-sm rounded-full transition-colors ${i18n.language.startsWith('fr') ? 'font-semibold bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>FR</button>
        </div>

        <div className="hidden md:flex items-center bg-gray-200 dark:bg-gray-800 rounded-full p-1">
          <button
            onClick={handleRoleChange}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${userRole === 'Garage' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
            aria-label={t('roles.Garage')}
          >
            <GarageIcon className="w-5 h-5" />
            <span>{t('roles.Garage')}</span>
          </button>
          <button
            onClick={handleRoleChange}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${userRole === 'Client' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
            aria-label={t('roles.Client')}
          >
            <UsersIcon className="w-5 h-5" />
            <span>{t('roles.Client')}</span>
          </button>
        </div>

        <button
          onClick={handleThemeChange}
          className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label={t('header.toggle_theme')}
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
        
        <button 
            onClick={logout} 
            className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline pl-2 border-l border-gray-300 dark:border-gray-700"
        >
            Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
