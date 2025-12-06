import React from 'react';
import { AppContextProvider, useAppContext } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import VehicleList from './components/VehicleList';
import ClientList from './components/ClientList';
import ClientDetail from './components/ClientDetail';
import AppointmentList from './components/AppointmentList';
import ServiceBoard from './components/ServiceBoard'; // New import
import CommandPalette from './components/CommandPalette'; // New import
import PersonnelManager from './components/PersonnelManager';
import Accounting from './components/Accounting';
import PartnerList from './components/PartnerList';
import Messaging from './components/Messaging';
import AIDiagnostics from './components/AIDiagnostics';
import Inventory from './components/Inventory';
import ChatAssistant from './components/ChatAssistant';
import Modal from './components/common/Modal';
import LoginView from './components/LoginView';

const MainContent: React.FC = () => {
  const { currentView, modal, closeModal, selectedClientId } = useAppContext();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'workflow':
        return <ServiceBoard />; // New View
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
          {renderView()}
        </main>
      </div>
      <ChatAssistant />
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
}

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <AppAuthWrapper />
    </AppContextProvider>
  );
};

export default App;