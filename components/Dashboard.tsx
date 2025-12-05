
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import { CarIcon, CalendarIcon, DollarSignIcon, UsersIcon, FileTextIcon, CheckCircleIcon, ArrowUpIcon, ArrowDownIcon } from './icons/Icons';
import AppointmentList from './AppointmentList';
import Card from './common/Card';
import { Quote, Vehicle, Appointment } from '../types';
import Button from './common/Button';

// Mock data
const MOCK_FINANCIALS = [{type: 'Income', amount: 12500}, {type: 'Income', amount: 8500}, {type: 'Expense', amount: 4300}];
const MOCK_CLIENTS = [{}, {}, {}];
const MOCK_VEHICLES: Vehicle[] = [
    { id: 'veh-1', make: 'Toyota', model: 'Camry', year: 2021, vin: '12345ABC', licensePlate: 'XYZ 123', mileage: 45000, ownerId: 'cli-1', status: 'In Service' },
    { id: 'veh-2', make: 'Honda', model: 'Civic', year: 2020, vin: '67890DEF', licensePlate: 'ABC 456', mileage: 60000, ownerId: 'cli-2', status: 'In Service' },
];
const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'app-1', clientId: 'cli-2', vehicleId: 'veh-2', date: new Date(Date.now() + 86400000).toISOString(), serviceType: 'Brake Inspection', mechanic: 'Bob', status: 'Scheduled' },
    { id: 'app-2', clientId: 'cli-1', vehicleId: 'veh-1', date: new Date(Date.now() + 172800000).toISOString(), serviceType: 'Oil Change', mechanic: 'Alice', status: 'Scheduled' },
];
const MOCK_QUOTES: Quote[] = [
    { id: 'q-1', clientId: 'cli-2', appointmentId: 'app-1', date: '2024-07-29', total: 450.75, status: 'Pending', items: [{description: 'Brake Pad Replacement', cost: 300}, {description: 'Labor', cost: 150.75}] }
];

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement; change?: string; color?: string }> = ({ title, value, icon, change, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  };

  return (
    <Card className="p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
        </div>
        {change && (
            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {change.startsWith('+') ? <ArrowUpIcon className="w-3 h-3 mr-1"/> : <ArrowDownIcon className="w-3 h-3 mr-1"/>}
                {change}
            </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">{title}</p>
      </div>
    </Card>
  );
};

const FinancialSummaryChart: React.FC = () => {
    const { t } = useTranslation();
    const income = MOCK_FINANCIALS.filter(f => f.type === 'Income').reduce((sum, item) => sum + item.amount, 0);
    const expense = MOCK_FINANCIALS.filter(f => f.type === 'Expense').reduce((sum, item) => sum + item.amount, 0);
    const max = Math.max(income, expense) * 1.2;
    const incomeHeight = max > 0 ? (income / max) * 100 : 0;
    const expenseHeight = max > 0 ? (expense / max) * 100 : 0;
  
    return (
      <Card className="p-6 h-full flex flex-col">
        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSignIcon className="w-5 h-5 text-gray-400"/>
            {t('dashboard.financial_overview')}
        </h3>
        <div className="flex-1 flex items-end justify-around gap-8 pt-4 pb-2">
          <div className="flex flex-col items-center w-1/2 group cursor-default">
            <div className="relative w-full max-w-[80px] bg-gray-100 dark:bg-gray-800 rounded-2xl h-48 flex items-end overflow-hidden">
              <div 
                className="w-full bg-gradient-to-t from-green-500 to-green-400 group-hover:from-green-400 group-hover:to-green-300 transition-all duration-500" 
                style={{ height: `${incomeHeight}%` }}
              ></div>
            </div>
            <p className="mt-3 text-lg font-bold text-gray-900 dark:text-white">${income.toLocaleString()}</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('dashboard.income')}</p>
          </div>
          <div className="flex flex-col items-center w-1/2 group cursor-default">
            <div className="relative w-full max-w-[80px] bg-gray-100 dark:bg-gray-800 rounded-2xl h-48 flex items-end overflow-hidden">
              <div 
                className="w-full bg-gradient-to-t from-red-500 to-red-400 group-hover:from-red-400 group-hover:to-red-300 transition-all duration-500" 
                style={{ height: `${expenseHeight}%` }}
              ></div>
            </div>
            <p className="mt-3 text-lg font-bold text-gray-900 dark:text-white">${expense.toLocaleString()}</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('dashboard.expense')}</p>
          </div>
        </div>
      </Card>
    );
};

const ClientQuoteManager: React.FC = () => {
    const { t } = useTranslation();
    const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES.filter(q => q.clientId === 'cli-2'));
    
    const handleQuoteAction = (quoteId: string, status: 'Approved' | 'Rejected') => {
        setQuotes(prevQuotes => prevQuotes.map(q => q.id === quoteId ? {...q, status} : q));
    };

    const pendingQuotes = quotes.filter(q => q.status === 'Pending');

    return (
        <Card className="h-full">
            <h3 className="text-lg font-bold p-6 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white flex items-center gap-2">
                <FileTextIcon className="w-5 h-5 text-gray-400"/>
                {t('quotes.title')}
            </h3>
            {pendingQuotes.length > 0 ? (
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {pendingQuotes.map(quote => {
                        const appointment = MOCK_APPOINTMENTS.find(a => a.id === quote.appointmentId);
                        const vehicle = MOCK_VEHICLES.find(v => v.id === appointment?.vehicleId);
                        return (
                            <li key={quote.id} className="p-6 space-y-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg text-gray-900 dark:text-white">{appointment?.serviceType}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{vehicle?.make} {vehicle?.model}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl text-blue-600 dark:text-blue-400">${quote.total.toFixed(2)}</p>
                                        <p className="text-xs text-gray-400">{new Date(quote.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                    {quote.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-300">{item.description}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">${item.cost.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <Button onClick={() => handleQuoteAction(quote.id, 'Rejected')} variant="danger" size="sm" icon={<CheckCircleIcon className="w-4 h-4 rotate-45" />}>{t('quotes.reject')}</Button>
                                    <Button onClick={() => handleQuoteAction(quote.id, 'Approved')} size="sm" icon={<CheckCircleIcon className="w-4 h-4" />}>{t('quotes.approve')}</Button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <CheckCircleIcon className="w-8 h-8" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">{t('quotes.none')}</p>
                </div>
            )}
        </Card>
    );
}

const Dashboard: React.FC = () => {
  const { userRole } = useAppContext();
  const { t } = useTranslation();

  const garageStats = [
    { title: t('dashboard.total_revenue'), value: `$${MOCK_FINANCIALS.filter(f => f.type === 'Income').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`, icon: <DollarSignIcon />, change: "+5.2%", color: "green" },
    { title: t('dashboard.total_clients'), value: MOCK_CLIENTS.length, icon: <UsersIcon />, change: "+2", color: "blue" },
    { title: t('dashboard.vehicles_in_service'), value: MOCK_VEHICLES.filter(v => v.status === 'In Service').length, icon: <CarIcon />, color: "orange" },
    { title: t('dashboard.upcoming_appointments'), value: MOCK_APPOINTMENTS.filter(a => new Date(a.date) >= new Date() && a.status === 'Scheduled').length, icon: <CalendarIcon />, color: "purple" },
  ];

  const clientStats = [
    { title: t('dashboard.my_vehicles'), value: MOCK_VEHICLES.filter(v => v.ownerId === 'cli-2').length, icon: <CarIcon />, color: "blue" },
    { title: t('dashboard.my_appointments'), value: MOCK_APPOINTMENTS.filter(a => a.clientId === 'cli-2').length, icon: <CalendarIcon />, color: "purple" },
    { title: t('dashboard.pending_quotes'), value: MOCK_QUOTES.filter(q => q.clientId === 'cli-2' && q.status === 'Pending').length, icon: <FileTextIcon />, color: "orange" },
  ];

  const stats = userRole === 'Garage' ? garageStats : clientStats;

  if (userRole === 'Client') {
    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                        {t('dashboard.my_upcoming_appointments')}
                    </h3>
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
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                {t('dashboard.recent_upcoming_appointments')}
            </h3>
            <AppointmentList isDashboardView={true} />
        </div>
        <div className="lg:col-span-1">
            <FinancialSummaryChart />
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
