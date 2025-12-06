import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import { SearchIcon, CarIcon, UsersIcon, CalendarIcon, DollarSignIcon, PlusIcon } from './icons/Icons';
import { Command } from '../types';

const CommandPalette: React.FC = () => {
    const { t } = useTranslation();
    const { setCurrentView, openModal } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Define commands
    const commands: Command[] = [
        { id: 'nav-dashboard', label: t('nav.dashboard'), icon: <div className="w-4 h-4 bg-blue-500 rounded-sm" />, action: () => setCurrentView('dashboard') },
        { id: 'nav-workflow', label: 'Workflow Board', icon: <div className="w-4 h-4 bg-orange-500 rounded-sm" />, action: () => setCurrentView('workflow') },
        { id: 'nav-clients', label: t('nav.clients'), icon: <UsersIcon className="w-4 h-4" />, action: () => setCurrentView('clients') },
        { id: 'nav-vehicles', label: t('nav.vehicles'), icon: <CarIcon className="w-4 h-4" />, action: () => setCurrentView('vehicles') },
        { id: 'nav-appointments', label: t('nav.appointments'), icon: <CalendarIcon className="w-4 h-4" />, action: () => setCurrentView('appointments') },
        { id: 'nav-accounting', label: t('nav.accounting'), icon: <DollarSignIcon className="w-4 h-4" />, action: () => setCurrentView('accounting') },
        { id: 'action-new-client', label: t('clients.add_new'), icon: <PlusIcon className="w-4 h-4" />, action: () => { setCurrentView('clients'); /* Logic to open modal would ideally be here or context triggered */ } },
    ];

    const filteredCommands = commands.filter(cmd => 
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (command: Command) => {
        command.action();
        setIsOpen(false);
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-[20vh] animate-fadeIn">
            <div 
                className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col animate-scaleUp"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent border-none outline-none px-3 text-lg text-gray-900 dark:text-white placeholder-gray-400"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
                        onKeyDown={e => {
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setActiveIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setActiveIndex(prev => Math.max(prev - 1, 0));
                            } else if (e.key === 'Enter') {
                                e.preventDefault();
                                if (filteredCommands[activeIndex]) {
                                    handleSelect(filteredCommands[activeIndex]);
                                }
                            }
                        }}
                    />
                    <div className="hidden sm:flex items-center gap-1">
                        <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 font-sans border border-gray-200 dark:border-gray-700">ESC</kbd>
                    </div>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto py-2">
                    {filteredCommands.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500 text-sm">No commands found.</div>
                    ) : (
                        filteredCommands.map((cmd, index) => (
                            <button
                                key={cmd.id}
                                onClick={() => handleSelect(cmd)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                                    index === activeIndex 
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                <div className={`flex items-center justify-center w-5 h-5 ${index === activeIndex ? 'text-blue-500' : 'text-gray-400'}`}>
                                    {cmd.icon}
                                </div>
                                <span className="flex-1 font-medium">{cmd.label}</span>
                                {cmd.shortcut && (
                                    <div className="flex gap-1">
                                        {cmd.shortcut.map(k => (
                                            <kbd key={k} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 border border-gray-200 dark:border-gray-700 min-w-[20px] text-center">
                                                {k}
                                            </kbd>
                                        ))}
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>
                
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 flex justify-between">
                     <span>Navigation</span>
                     <div className="flex gap-2">
                        <span className="flex items-center gap-1"><kbd className="font-sans">↑↓</kbd> to navigate</span>
                        <span className="flex items-center gap-1"><kbd className="font-sans">↵</kbd> to select</span>
                     </div>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.1s ease-out forwards; }
                .animate-scaleUp { animation: scaleUp 0.1s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default CommandPalette;