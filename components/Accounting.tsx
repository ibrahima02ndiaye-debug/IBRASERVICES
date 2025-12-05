import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FinancialRecord, Client } from '../types';
import { DollarSignIcon, ArrowUpIcon, ArrowDownIcon, FileTextIcon, PlusIcon, SearchIcon } from './icons/Icons';
import Card from './common/Card';
import Button from './common/Button';
import { useAppContext } from '../contexts/AppContext';
import AddTransactionForm from './forms/AddTransactionForm';
import InvoiceCreator from './InvoiceCreator';
import { generateInvoicePdf } from '../utils/pdfGenerator';
import { getFinancials, getClients, createFinancialRecord } from '../client/src/services/api';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactElement; }> = ({ title, value, icon }) => (
    <Card className="p-6 flex items-center space-x-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-3.5 rounded-lg">{icon}</div>
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </Card>
);

const Accounting: React.FC = () => {
  const { openModal, closeModal } = useAppContext();
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<FinancialRecord[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'invoicing'>('overview');

  const fetchData = async () => {
    try {
        const [trans, clis] = await Promise.all([getFinancials(), getClients()]);
        setTransactions(trans);
        setClients(clis);
    } catch (e) {
        console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalIncome = transactions.filter(f => f.type === 'Income').reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = transactions.filter(f => f.type === 'Expense').reduce((sum, item) => sum + item.amount, 0);
  const netProfit = totalIncome - totalExpense;
  
  const filteredTransactions = transactions.filter(record => 
    record.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  const handleViewInvoice = (record: FinancialRecord) => {
    const client = clients.find(c => c.id === record.clientId);
    generateInvoicePdf(record, client, t);
  };

  if (activeTab === 'invoicing') {
    return (
        <InvoiceCreator clients={clients} onCancel={() => setActiveTab('overview')} />
    );
  }

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-800 pb-0">
        <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 text-blue-600 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20`}
        >
            {t('accounting.tab_overview')}
        </button>
        <button 
            onClick={() => setActiveTab('invoicing')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300`}
        >
            {t('accounting.tab_invoicing')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title={t('accounting.total_income')} value={`$${totalIncome.toLocaleString()}`} icon={<ArrowUpIcon className="w-7 h-7 text-green-500" />} />
        <StatCard title={t('accounting.total_expense')} value={`$${totalExpense.toLocaleString()}`} icon={<ArrowDownIcon className="w-7 h-7 text-red-500" />} />
        <StatCard title={t('accounting.net_profit')} value={`$${netProfit.toLocaleString()}`} icon={<DollarSignIcon className="w-7 h-7 text-blue-500" />} />
      </div>

      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-auto">
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder={t('accounting.search_placeholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={() => setActiveTab('invoicing')} variant="secondary" icon={<FileTextIcon />}>{t('accounting.create_invoice')}</Button>
                <Button onClick={handleAddTransactionClick} icon={<PlusIcon />}>{t('accounting.add_button')}</Button>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('accounting.header_date')}</th>
                <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('accounting.header_description')}</th>
                <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('accounting.header_type')}</th>
                <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('accounting.header_amount')}</th>
                <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300">{t('accounting.header_invoice')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                        No transactions found.
                    </td>
                </tr>
              ) : filteredTransactions.map((record) => (
                <tr key={record.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="p-4 font-medium text-gray-950 dark:text-white text-sm">{record.description}</td>
                  <td className="p-4">
                    <span className={`font-semibold text-sm ${record.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-semibold text-sm">{record.type === 'Income' ? '+' : '-'}${record.amount.toFixed(2)}</td>
                  <td className="p-4">
                    {record.type === 'Income' && record.invoiceId && (
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewInvoice(record)}
                      >
                        <FileTextIcon className="w-4 h-4 mr-1.5" />
                        {t('accounting.view_pdf')}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Accounting;