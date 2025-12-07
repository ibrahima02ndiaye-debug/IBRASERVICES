import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContextProvider, useAppContext } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import VehicleList from './components/VehicleList';
import ClientList from './components/ClientList';
import ClientDetail from './components/ClientDetail';
import AppointmentList from './components/AppointmentList';
import ServiceBoard from './components/ServiceBoard';
import CommandPalette from './components/CommandPalette';
import PersonnelManager from './components/PersonnelManager';
import Accounting from './components/Accounting';
import PartnerList from './components/PartnerList';
import Messaging from './components/Messaging';
import AIDiagnostics from './components/AIDiagnostics';
import Inventory from './components/Inventory';
import Modal from './components/common/Modal';
import LoginView from './components/LoginView';
import ErrorBoundary from './components/ErrorBoundary';
import AIChatbot from './components/AIChatbot';
import LoyaltyProgram from './components/LoyaltyProgram';
import QuotesManager from './components/QuotesManager';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import PushNotificationManager from './utils/pushNotifications';

const MainContent: React.FC = () => {
  const { currentView, modal, closeModal, selectedClientId } = useAppContext();

  // Initialize PWA features
  React.useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    }

    // Initialize push notifications
    PushNotificationManager.initialize().then((success) => {
      if (success) {
        console.log('Push notifications ready');
      }
    });

    // Check for app updates
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      console.log('PWA install prompt ready');
      // Store the event for later use
      (window as any).deferredPrompt = e;
    });
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'workflow':
        return <ServiceBoard />;
      case 'vehicles':
        return <VehicleList />;
      case 'clients':
        return <ClientList />;
      case 'client-detail':
        return <ClientDetail key={selectedClientId} />;
      case 'appointments':
        return <AppointmentList />;
      case 'personnel':
        return <PersonnelManager />;
      case 'accounting':
        return <Accounting />;
      case 'partners':
        return <PartnerList />;
      case 'messages':
        return <Messaging />;
      case 'diagnostics':
        return <AIDiagnostics />;
      case 'inventory':
        return <Inventory />;
      case 'loyalty':
        return <LoyaltyProgram />;
      case 'quotes':
        return <QuotesManager />;
      case 'analytics':
        return <AdvancedAnalytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <ErrorBoundary>{renderView()}</ErrorBoundary>
        </main>
      </div>
      <AIChatbot />
      <CommandPalette />
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        showFooter={modal.options?.showFooter}
      >
        {modal.content}
      </Modal>
    </div>
  );
};

const AppAuthWrapper: React.FC = () => {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <MainContent />;
};

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <ErrorBoundary>
        <AppAuthWrapper />
      </ErrorBoundary>
    </AppContextProvider>
  );
};

export default App;