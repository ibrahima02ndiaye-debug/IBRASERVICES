

import React from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Corrected relative import path.
import { CloseIcon } from '../icons/Icons';
import Card from './Card';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showFooter?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, showFooter = true }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <Card 
        className="w-full max-w-lg mx-4 animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            aria-label={t('modal.close')}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {children}
        </div>
        {showFooter && (
          <div className="p-4 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 rounded-b-xl">
              <Button onClick={onClose} variant="secondary">{t('common.cancel')}</Button>
              <Button>{t('common.save')}</Button>
          </div>
        )}
      </Card>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Modal;
