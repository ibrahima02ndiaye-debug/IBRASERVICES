import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FinancialRecord, Client, Invoice } from '../types';
import { DollarSignIcon, ArrowUpIcon, ArrowDownIcon, FileTextIcon, PlusIcon, SearchIcon, FilterIcon, PrinterIcon, DocumentIcon } from './icons/Icons';
import Card from './common/Card';
import Button from './common/Button';
import { useAppContext } from '../contexts/AppContext';
import AddTransactionForm from './forms/AddTransactionForm';
import InvoiceCreator from './InvoiceCreator';
import { generateInvoicePdf } from '../utils/pdfGenerator';
import { getFinancials, getClients, createFinancialRecord } from '../client/src/services/api';
import Skeleton from './common/Skeleton';

const KPI: React.FC<{ title: string; value: string; trend?: string; trendUp?: boolean; icon: React.ReactElement; colorClass: string }> = ({ title, value, trend, trendUp, icon, colorClass }) => (
    <Card className="p-5 flex flex-col justify-between h-full relative overflow-hidden group">
        <div className="flex justify-between items-start z-10">
            <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100`}>
                {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-6 h-6 ${colorClass.replace('bg-', 'text-')}` })}
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trend}
                </span>
            )}
        </div>
        <div className="mt-4 z-10">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-5 ${colorClass}`}></div>
    </Card>
);

const Accounting: React.FC = () => {
  const { openModal, closeModal } = useAppContext();
  const { t } = useTranslation();
  
  const [transactions, setTransactions] = useState<FinancialRecord[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'invoicing' | 'expenses'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const [trans, clis] = await Promise.all([getFinancials(), getClients()]);
        setTransactions(trans);
        setClients(clis);
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalIncome = transactions.filter(f => f.type === 'Income').reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = transactions.filter(f => f.type === 'Expense').reduce((sum, item) => sum + item.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0';
  
  const handleAddNewTransaction = async (transactionData: Omit<FinancialRecord, 'id' | 'invoiceId' | 'clientId'>) => {
    try {
        await createFinancialRecord(transactionData);
        closeModal();
        fetchData();
    } catch (error) {
        console.error("Failed to add transaction", error);
        alert("Failed to add transaction.");
    }
  };
  
  const handleAddTransactionClick = () => {
    openModal(
        t('accounting.add_new'),
        <AddTransactionForm onAdd={handleAddNewTransaction} />,
        { showFooter: false }
    );
  };

  if (activeTab === 'invoicing') {
    return <InvoiceCreator clients={clients} onCancel={() => setActiveTab('overview')} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance Command Center</h1>
                 <p className="text-gray-500 text-sm">Track revenue, manage invoices, and monitor expenses.</p>
             </div>
             <div className="flex gap-2">
                 <Button variant="secondary" onClick={() => setActiveTab('invoicing')} icon={<FileTextIcon />}>New Invoice</Button>
                 <Button onClick={handleAddTransactionClick} icon={<PlusIcon />}>Log Transaction</Button>
             </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPI title="Total Revenue" value={`$${totalIncome.toLocaleString()}`} colorClass="bg-green-500" icon={<ArrowUpIcon />} trend="+12%" trendUp={true} />
            <KPI title="Expenses" value={`$${totalExpense.toLocaleString()}`} colorClass="bg-red-500" icon={<ArrowDownIcon />} trend="-5%" trendUp={true} />
            <KPI title="Net Profit" value={`$${netProfit.toLocaleString()}`} colorClass="bg-blue-500" icon={<DollarSignIcon />} />
            <KPI title="Profit Margin" value={`${margin}%`} colorClass="bg-purple-500" icon={<DocumentIcon />} />
        </div>

        {/* Visualization Area (CSS Bar Chart) */}
        <Card className="p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Cash Flow Visualization</h3>
            <div className="flex h-4 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                 <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${totalIncome === 0 ? 0 : (totalIncome / (totalIncome + totalExpense)) * 100}%` }}></div>
                 <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${totalExpense === 0 ? 0 : (totalExpense / (totalIncome + totalExpense)) * 100}%` }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Income ({((totalIncome / (totalIncome + totalExpense || 1)) * 100).toFixed(0)}%)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Expense ({((totalExpense / (totalIncome + totalExpense || 1)) * 100).toFixed(0)}%)</span>
            </div>
        </Card>

        {/* Transactions / Ledger Section */}
        <div>
            <div className="flex items-center justify-between mb-4">
                 <div className="flex gap-4">
                     <button 
                        onClick={() => setActiveTab('overview')} 
                        className={`pb-2 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                     >
                         All Transactions
                     </button>
                     <button 
                        onClick={() => setActiveTab('expenses')} 
                        className={`pb-2 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'expenses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                     >
                         Expenses Only
                     </button>
                 </div>
                 <div className="relative">
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Search ledger..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 font-medium">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Category</th>
                            <th className="p-4 text-right">Amount</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {isLoading ? (
                            [1,2,3].map(i => <tr key={i}><td colSpan={5} className="p-4"><Skeleton className="h-8 w-full" /></td></tr>)
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No transactions recorded.</td></tr>
                        ) : (
                            transactions
                                .filter(t => activeTab === 'expenses' ? t.type === 'Expense' : true)
                                .filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(record => (
                                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4 text-gray-600 dark:text-gray-400 font-mono text-xs">
                                        {new Date(record.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                                        {record.description}
                                        {record.clientId && (
                                            <span className="ml-2 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-500">
                                                {clients.find(c => c.id === record.clientId)?.name || 'Client'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${record.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {record.type}
                                        </span>
                                    </td>
                                    <td className={`p-4 text-right font-mono font-bold ${record.type === 'Income' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                                        {record.type === 'Income' ? '+' : '-'}${record.amount.toFixed(2)}
                                    </td>
                                    <td className="p-4 text-right">
                                        {record.type === 'Income' && record.invoiceId && (
                                            <button 
                                                onClick={() => generateInvoicePdf(record, clients.find(c => c.id === record.clientId), t)}
                                                className="text-gray-400 hover:text-blue-600 transition-colors" 
                                                title="Download Invoice"
                                            >
                                                <PrinterIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    </div>
  );
};

export default Accounting;