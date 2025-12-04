import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { View, UserRole, Theme, ModalState, AppContextType, ModalOptions } from '../types';

// FIX: Correctly type the context to allow for undefined initial value.
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Garage');
  const [theme, setTheme] = useState<Theme>('light');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole') as UserRole;
    if (token) {
        setIsAuthenticated(true);
        if (role) setUserRole(role);
    }
  }, []);

  const login = (token: string, userData: { role: UserRole }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', userData.role);
    setIsAuthenticated(true);
    setUserRole(userData.role);
    // Reset view to dashboard on login
    setCurrentView('dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    content: null,
    options: { showFooter: true },
  });

  const openModal = (title: string, content: React.ReactNode, options?: ModalOptions) => {
    setModal({ isOpen: true, title, content, options: { ...{showFooter: true}, ...options} });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: '', content: null, options: { showFooter: true } });
  };

  const value: AppContextType = {
    currentView,
    setCurrentView,
    userRole,
    setUserRole,
    theme,
    setTheme,
    modal,
    openModal,
    closeModal,
    selectedClientId,
    setSelectedClientId,
    isAuthenticated,
    login,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};