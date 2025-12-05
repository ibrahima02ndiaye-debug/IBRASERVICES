
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import { CarIcon, CalendarIcon, DollarSignIcon, UsersIcon, FileTextIcon, CheckCircleIcon, CloseIcon, ArrowUpIcon, ArrowDownIcon } from './icons/Icons';
import AppointmentList from './AppointmentList';
import Card from './common/Card';
import { Quote, Vehicle, Appointment, Client, FinancialRecord } from '../types';
import Button from './common/Button';
import { getClients, getVehicles, getAppointments, getFinancials, getQuotes, updateQuoteStatus } from '../client/src/services/api';
import Skeleton from './common/Skeleton';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement; change?: string; color?: string }> = ({ title, value, icon, change, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  };

  return (
    <Card className="p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} shadow-sm`}>
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
        </div>
        {change && (
            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {change.startsWith('+') ? <ArrowUpIcon className="w-3 h-3 mr-1"/> : <ArrowDownIcon className="w-3 h-3 mr-1"/>}
                {change}
            </span>
        )}
      </div>
      <div className="mt-6">
        <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">{value}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2">{title}</p>
      </div>
    </Card>
  );
};

const FinancialSummaryChart: React.FC<{ financials: FinancialRecord[] }> = ({ financials }) => {
    const { t } = useTranslation();
    const income = financials.filter(f => f.type === 'Income').reduce((sum, item) => sum + item.amount, 0);
    const expense = financials.filter(f => f.type === 'Expense').reduce((sum, item) => sum + item.amount, 0);
    const max = Math.max(income, expense) * 1.2;
    const incomeHeight = max > 0 ? (income / max) * 100 : 0;
    const expenseHeight = max > 0 ? (expense / max) * 100 : 0;
  
    return (
      <Card className="p-6 h-full flex flex-col">
        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg"><DollarSignIcon className="w-5 h-5 text-gray-500 dark:text-gray-400"/></div>
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

const ClientQuoteManager: React.FC<{ quotes: Quote[], appointments: Appointment[], vehicles: Vehicle[], onUpdate: () => void }> = ({ quotes, appointments, vehicles, onUpdate }) => {
    const { t } = useTranslation();

    const handleQuoteAction = async (quoteId: string, status: 'Approved' | 'Rejected') => {
        try {
            await updateQuoteStatus(quoteId, status);
            onUpdate();
        } catch (error) {
            console.error("Failed to update quote status", error);
        }
    };

    const pendingQuotes = quotes.filter(q => q.status === 'Pending');

    return (
        <Card className="h-full">
            <h3 className="text-lg font-bold p-6 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg"><FileTextIcon className="w-5 h-5 text-gray-500 dark:text-gray-400"/></div>
                {t('quotes.title')}
            </h3>
            {pendingQuotes.length > 0 ? (
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {pendingQuotes.map(quote => {
                        const appointment = appointments.find(a => a.id === quote.appointmentId);
                        const vehicle = vehicles.find(v => v.id === appointment?.vehicleId);
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
                                    <Button onClick={() => handleQuoteAction(quote.id, 'Rejected')} variant="danger" size="sm" icon={<CloseIcon className="w-4 h-4" />}>{t('quotes.reject')}</Button>
                                    <Button onClick={() => handleQuoteAction(quote.id, 'Approved')} size="sm" icon={<CheckCircleIcon className="w-4 h-4" />}>{t('quotes.approve')}</Button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="p-12 text-center h-64 flex flex-col items-center justify-center">
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
  
  const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async () => {
    try {
        const [fins, clis, vehs, apps, qts] = await Promise.all([
            getFinancials(),
            getClients(),
            getVehicles(),
            getAppointments(),
            getQuotes()
        ]);
        setFinancials(fins);
        setClients(clis);
        setVehicles(vehs);
        setAppointments(apps);
        setQuotes(qts);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (isLoading) {
      return (
          <div className="space-y-8 animate-fadeIn pb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Skeleton className="lg:col-span-2 h-96" />
                  <Skeleton className="h-96" />
              </div>
          </div>
      );
  }

  const garageStats = [
    { title: t('dashboard.total_revenue'), value: `$${financials.filter(f => f.type === 'Income').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`, icon: <DollarSignIcon />, change: "", color: "green" },
    { title: t('dashboard.total_clients'), value: clients.length, icon: <UsersIcon />, change: "", color: "blue" },
    { title: t('dashboard.vehicles_in_service'), value: vehicles.filter(v => v.status === 'In Service').length, icon: <CarIcon />, color: "orange" },
    { title: t('dashboard.upcoming_appointments'), value: appointments.filter(a => new Date(a.date) >= new Date() && a.status === 'Scheduled').length, icon: <CalendarIcon />, color: "purple" },
  ];

  const clientStats = [
    { title: t('dashboard.my_vehicles'), value: vehicles.length, icon: <CarIcon />, color: "blue" },
    { title: t('dashboard.my_appointments'), value: appointments.length, icon: <CalendarIcon />, color: "purple" },
    { title: t('dashboard.pending_quotes'), value: quotes.filter(q => q.status === 'Pending').length, icon: <FileTextIcon />, color: "orange" },
  ];

  const stats = userRole === 'Garage' ? garageStats : clientStats;

  if (userRole === 'Client') {
    return (
        <div className="space-y-8 animate-fadeIn pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg"><CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" /></div>
                        {t('dashboard.my_upcoming_appointments')}
                    </h3>
                    <AppointmentList isDashboardView={true} />
                </div>
                <div className="lg:col-span-1">
                    <ClientQuoteManager quotes={quotes} appointments={appointments} vehicles={vehicles} onUpdate={fetchAllData} />
                </div>
             </div>
        </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg"><CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" /></div>
                {t('dashboard.recent_upcoming_appointments')}
            </h3>
            <AppointmentList isDashboardView={true} />
        </div>
        <div className="lg:col-span-1">
            <FinancialSummaryChart financials={financials} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
