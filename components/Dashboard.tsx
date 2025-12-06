import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import { CarIcon, CalendarIcon, DollarSignIcon, UsersIcon, FileTextIcon, CheckCircleIcon, ArrowUpIcon, ArrowDownIcon, PlusIcon } from './icons/Icons';
import Card from './common/Card';
import { Quote, Vehicle, Appointment, Client, FinancialRecord } from '../types';
import Button from './common/Button';
import { getClients, getVehicles, getAppointments, getFinancials, getQuotes, updateQuoteStatus } from '../client/src/services/api';
import Skeleton from './common/Skeleton';

// Metric Card Component
const MetricCard: React.FC<{ label: string; value: string; trend?: string; trendUp?: boolean; icon: React.ReactElement }> = ({ label, value, trend, trendUp, icon }) => (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">{value}</h3>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })}
            </div>
        </div>
        {trend && (
            <div className="flex items-center gap-1.5 text-xs font-medium relative z-10">
                <span className={`flex items-center ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {trendUp ? <ArrowUpIcon className="w-3 h-3 mr-0.5"/> : <ArrowDownIcon className="w-3 h-3 mr-0.5"/>}
                    {trend}
                </span>
                <span className="text-gray-400">vs last month</span>
            </div>
        )}
        {/* Decorative Background Blob */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl group-hover:from-blue-500/10 transition-all"></div>
    </div>
);

const Dashboard: React.FC = () => {
  const { userRole, setCurrentView } = useAppContext();
  const { t, i18n } = useTranslation();
  
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
          <div className="space-y-6 animate-fadeIn p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
              </div>
          </div>
      );
  }

  // Calculate stats
  const totalRevenue = financials.filter(f => f.type === 'Income').reduce((sum, item) => sum + item.amount, 0);
  const formattedRevenue = new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(totalRevenue);
  const activeJobs = appointments.filter(a => ['In Progress', 'Waiting for Parts', 'Quality Check'].includes(a.status)).length;
  const pendingQuotes = quotes.filter(q => q.status === 'Pending').length;

  // Render Client View
  if (userRole === 'Client') {
    return (
        <div className="p-6 space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                 <Button onClick={() => setCurrentView('appointments')} icon={<PlusIcon />}>Book Service</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard label="My Vehicles" value={vehicles.length.toString()} icon={<CarIcon />} />
                <MetricCard label="Upcoming Service" value={appointments.length.toString()} icon={<CalendarIcon />} />
                <MetricCard label="Pending Estimates" value={pendingQuotes.toString()} icon={<FileTextIcon />} />
            </div>

            {/* Pending Actions */}
            {pendingQuotes > 0 && (
                <Card className="border-l-4 border-l-orange-500">
                    <div className="p-6 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Action Required</h3>
                            <p className="text-gray-500">You have {pendingQuotes} estimates waiting for approval.</p>
                        </div>
                        <Button variant="secondary">Review Estimates</Button>
                    </div>
                </Card>
            )}
        </div>
    )
  }

  // Render Garage View (Pro Dashboard)
  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop Overview</h2>
              <p className="text-sm text-gray-500">Here's what's happening in your shop today.</p>
          </div>
          <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setCurrentView('workflow')} icon={<CheckCircleIcon />}>Workflow Board</Button>
              <Button onClick={() => setCurrentView('appointments')} icon={<PlusIcon />}>New Job</Button>
          </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Gross Revenue" value={formattedRevenue} trend="+12.5%" trendUp={true} icon={<DollarSignIcon />} />
        <MetricCard label="Active Jobs" value={activeJobs.toString()} trend="+2" trendUp={true} icon={<CarIcon />} />
        <MetricCard label="Pending Estimates" value={pendingQuotes.toString()} trend="-1" trendUp={true} icon={<FileTextIcon />} />
        <MetricCard label="Total Clients" value={clients.length.toString()} trend="+5.2%" trendUp={true} icon={<UsersIcon />} />
      </div>
      
      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 flex flex-col gap-4">
             <div className="flex justify-between items-center">
                 <h3 className="font-bold text-gray-800 dark:text-white">Today's Schedule</h3>
                 <button onClick={() => setCurrentView('appointments')} className="text-sm text-blue-600 hover:underline">View All</button>
             </div>
             <Card className="flex-1 min-h-[300px]">
                {appointments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                        <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
                        <p>No appointments scheduled for today.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {appointments.slice(0, 5).map(app => {
                            const client = clients.find(c => c.id === app.clientId);
                            const vehicle = vehicles.find(v => v.id === app.vehicleId);
                            return (
                                <div key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                                            <span className="text-xs font-bold uppercase">{new Date(app.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-lg font-bold leading-none">{new Date(app.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{client?.name || 'Unknown'}</p>
                                            <p className="text-sm text-gray-500">{vehicle?.year} {vehicle?.make} {vehicle?.model} • {app.serviceType}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            app.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                            app.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                            {app.status}
                                        </span>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
             </Card>
        </div>

        {/* Shop Activity Feed / Notifications */}
        <div className="flex flex-col gap-4">
             <h3 className="font-bold text-gray-800 dark:text-white">Shop Activity</h3>
             <Card className="flex-1 p-0 overflow-hidden">
                 <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                     <p className="text-xs font-semibold text-gray-500 uppercase">Recent Updates</p>
                 </div>
                 <div className="p-4 space-y-6">
                     <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                             <CheckCircleIcon className="w-4 h-4" />
                         </div>
                         <div>
                             <p className="text-sm text-gray-900 dark:text-white"><span className="font-semibold">Job Completed</span>: Honda Civic Brake Service</p>
                             <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
                         </div>
                     </div>
                     <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                             <PlusIcon className="w-4 h-4" />
                         </div>
                         <div>
                             <p className="text-sm text-gray-900 dark:text-white"><span className="font-semibold">New Client</span>: Sarah Connor added</p>
                             <p className="text-xs text-gray-500 mt-0.5">4 hours ago</p>
                         </div>
                     </div>
                     <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                             <FileTextIcon className="w-4 h-4" />
                         </div>
                         <div>
                             <p className="text-sm text-gray-900 dark:text-white"><span className="font-semibold">Estimate Approved</span>: #EST-1024</p>
                             <p className="text-xs text-gray-500 mt-0.5">Yesterday</p>
                         </div>
                     </div>
                 </div>
             </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;