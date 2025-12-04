
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Use relative paths for imports from other root-level directories.
// FIX: Removed imports from obsolete constants.ts. Data should be fetched from an API.
import { useAppContext } from '../contexts/AppContext';
import { CarIcon, CalendarIcon, DollarSignIcon, UsersIcon, FileTextIcon, CheckCircleIcon, CloseIcon } from './icons/Icons';
import AppointmentList from './AppointmentList';
import Card from './common/Card';
// FIX: Import Vehicle and Appointment types to correctly type mock data and fix property access errors.
import { Quote, Vehicle, Appointment } from '../types';
import Button from './common/Button';

// Mock data is kept temporarily for display purposes until API is fully integrated.
const MOCK_FINANCIALS = [{type: 'Income', amount: 12500}, {type: 'Income', amount: 8500}, {type: 'Expense', amount: 4300}];
const MOCK_CLIENTS = [{}, {}, {}];
// FIX: Expanded mock data for vehicles to match the Vehicle type, resolving multiple property access errors.
const MOCK_VEHICLES: Vehicle[] = [
    { id: 'veh-1', make: 'Toyota', model: 'Camry', year: 2021, vin: '12345ABC', licensePlate: 'XYZ 123', mileage: 45000, ownerId: 'cli-1', status: 'In Service' },
    { id: 'veh-2', make: 'Honda', model: 'Civic', year: 2020, vin: '67890DEF', licensePlate: 'ABC 456', mileage: 60000, ownerId: 'cli-2', status: 'In Service' },
];
// FIX: Expanded mock data for appointments to match the Appointment type, resolving multiple property access errors.
const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'app-1', clientId: 'cli-2', vehicleId: 'veh-2', date: new Date(Date.now() + 86400000).toISOString(), serviceType: 'Brake Inspection', mechanic: 'Bob', status: 'Scheduled' },
    { id: 'app-2', clientId: 'cli-1', vehicleId: 'veh-1', date: new Date(Date.now() + 172800000).toISOString(), serviceType: 'Oil Change', mechanic: 'Alice', status: 'Scheduled' },
];
const MOCK_QUOTES: Quote[] = [
    { id: 'q-1', clientId: 'cli-2', appointmentId: 'app-1', date: '2024-07-29', total: 450.75, status: 'Pending', items: [{description: 'Brake Pad Replacement', cost: 300}, {description: 'Labor', cost: 150.75}] }
];

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement; change?: string; }> = ({ title, value, icon, change }) => (
  <Card className="p-5 flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6 text-blue-500 dark:text-blue-400' })}
      </div>
      {change && <span className={`text-sm font-semibold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</span>}
    </div>
    <div>
      <p className="text-3xl font-bold text-gray-950 dark:text-white mt-4">{value}</p>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
    </div>
  </Card>
);

const FinancialSummaryChart: React.FC = () => {
    const { t } = useTranslation();
    const income = MOCK_FINANCIALS.filter(f => f.type === 'Income').reduce((sum, item) => sum + item.amount, 0);
    const expense = MOCK_FINANCIALS.filter(f => f.type === 'Expense').reduce((sum, item) => sum + item.amount, 0);
    const max = Math.max(income, expense) * 1.2;
    const incomeHeight = max > 0 ? (income / max) * 100 : 0;
    const expenseHeight = max > 0 ? (expense / max) * 100 : 0;
  
    return (
      <Card className="p-6 h-full flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-gray-950 dark:text-white">{t('dashboard.financial_overview')}</h3>
        <div className="flex-1 flex items-end justify-around gap-4 pt-4">
          <div className="flex flex-col items-center w-1/2">
            <div className="w-1/2 bg-gray-200 dark:bg-gray-700 rounded-t-lg h-48 flex items-end">
              <div className="w-full bg-green-500 rounded-t-lg" style={{ height: `${incomeHeight}%`, transition: 'height 0.5s ease-out' }}></div>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-950 dark:text-white">${income.toLocaleString()}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('dashboard.income')}</p>
          </div>
          <div className="flex flex-col items-center w-1/2">
            <div className="w-1/2 bg-gray-200 dark:bg-gray-700 rounded-t-lg h-48 flex items-end">
              <div className="w-full bg-red-500 rounded-t-lg" style={{ height: `${expenseHeight}%`, transition: 'height 0.5s ease-out' }}></div>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-950 dark:text-white">${expense.toLocaleString()}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('dashboard.expense')}</p>
          </div>
        </div>
      </Card>
    );
};

const ClientQuoteManager: React.FC = () => {
    const { t } = useTranslation();
    const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES.filter(q => q.clientId === 'cli-2')); // Hardcoded for demo
    
    const handleQuoteAction = (quoteId: string, status: 'Approved' | 'Rejected') => {
        setQuotes(prevQuotes => prevQuotes.map(q => q.id === quoteId ? {...q, status} : q));
    };

    const pendingQuotes = quotes.filter(q => q.status === 'Pending');

    return (
        <Card>
            <h3 className="text-xl font-semibold p-6 border-b border-gray-200 dark:border-gray-800 text-gray-950 dark:text-white">{t('quotes.title')}</h3>
            {pendingQuotes.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                    {pendingQuotes.map(quote => {
                        const appointment = MOCK_APPOINTMENTS.find(a => a.id === quote.appointmentId);
                        const vehicle = MOCK_VEHICLES.find(v => v.id === appointment?.vehicleId);
                        return (
                            <li key={quote.id} className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg">{appointment?.serviceType}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle?.make} {vehicle?.model} - {new Date(quote.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className="font-bold text-2xl text-blue-500">${quote.total.toFixed(2)}</p>
                                </div>
                                <div className="space-y-2">
                                    {quote.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                                            <span>{item.description}</span>
                                            <span>${item.cost.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800/50">
                                    <Button onClick={() => handleQuoteAction(quote.id, 'Rejected')} variant="danger" size="sm" icon={<CloseIcon className="w-4 h-4" />}>{t('quotes.reject')}</Button>
                                    <Button onClick={() => handleQuoteAction(quote.id, 'Approved')} size="sm" icon={<CheckCircleIcon className="w-4 h-4" />}>{t('quotes.approve')}</Button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <p className="p-6 text-gray-600 dark:text-gray-400">{t('quotes.none')}</p>
            )}
        </Card>
    );
}

const Dashboard: React.FC = () => {
  const { userRole } = useAppContext();
  const { t } = useTranslation();

  const garageStats = [
    { title: t('dashboard.total_revenue'), value: `$${MOCK_FINANCIALS.filter(f => f.type === 'Income').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`, icon: <DollarSignIcon />, change: "+5.2%" },
    { title: t('dashboard.total_clients'), value: MOCK_CLIENTS.length, icon: <UsersIcon />, change: "+2" },
    { title: t('dashboard.vehicles_in_service'), value: MOCK_VEHICLES.filter(v => v.status === 'In Service').length, icon: <CarIcon /> },
    { title: t('dashboard.upcoming_appointments'), value: MOCK_APPOINTMENTS.filter(a => new Date(a.date) >= new Date() && a.status === 'Scheduled').length, icon: <CalendarIcon /> },
  ];

  const clientStats = [
    { title: t('dashboard.my_vehicles'), value: MOCK_VEHICLES.filter(v => v.ownerId === 'cli-2').length, icon: <CarIcon /> },
    { title: t('dashboard.my_appointments'), value: MOCK_APPOINTMENTS.filter(a => a.clientId === 'cli-2').length, icon: <CalendarIcon /> },
    { title: t('dashboard.pending_quotes'), value: MOCK_QUOTES.filter(q => q.clientId === 'cli-2' && q.status === 'Pending').length, icon: <FileTextIcon /> },
  ];

  const stats = userRole === 'Garage' ? garageStats : clientStats;

  if (userRole === 'Client') {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-4 text-gray-950 dark:text-white">{t('dashboard.my_upcoming_appointments')}</h3>
                    <AppointmentList isDashboardView={true} />
                </div>
                <div className="lg:col-span-1">
                    <ClientQuoteManager />
                </div>
             </div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-950 dark:text-white">{t('dashboard.recent_upcoming_appointments')}</h3>
            <AppointmentList isDashboardView={true} />
        </div>
        <div className="lg:col-span-1">
            <FinancialSummaryChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
