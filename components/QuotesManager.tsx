import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import { Quote, Client, Vehicle } from '../types';
import { getQuotes, getClients, getVehicles, createQuote, updateQuoteStatus } from '../services/api';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';
import { FileTextIcon, CheckCircleIcon, CloseIcon, PlusIcon, ClockIcon } from './icons/Icons';
import Skeleton from './common/Skeleton';

const QuotesManager: React.FC = () => {
    const { t } = useTranslation();
    const { openModal, closeModal, userRole } = useAppContext();

    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [quotesData, clientsData, vehiclesData] = await Promise.all([
                getQuotes(),
                getClients(),
                getVehicles(),
            ]);
            setQuotes(quotesData);
            setClients(clientsData);
            setVehicles(vehiclesData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (quoteId: string, status: 'Approved' | 'Rejected') => {
        try {
            await updateQuoteStatus(quoteId, status);
            fetchData();
        } catch (error) {
            console.error('Failed to update quote:', error);
            alert('Failed to update quote status');
        }
    };

    const handleCreateQuote = () => {
        openModal(
            'Nouvelle Soumission',
            <QuoteCreationForm
                clients={clients}
                vehicles={vehicles}
                onSave={() => {
                    closeModal();
                    fetchData();
                }}
            />,
            { showFooter: false }
        );
    };

    const filteredQuotes = quotes.filter(
        q => filter === 'all' || q.status === filter
    );

    const statusCounts = {
        total: quotes.length,
        pending: quotes.filter(q => q.status === 'Pending').length,
        approved: quotes.filter(q => q.status === 'Approved').length,
        rejected: quotes.filter(q => q.status === 'Rejected').length,
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Soumissions & Devis
                    </h1>
                    <p className="text-sm text-gray-500">
                        Gérez les demandes de devis et soumissions
                    </p>
                </div>
                {userRole === 'Garage' && (
                    <Button onClick={handleCreateQuote} icon={<PlusIcon />}>
                        Nouvelle Soumission
                    </Button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total" value={statusCounts.total} color="blue" />
                <StatCard title="En Attente" value={statusCounts.pending} color="yellow" icon={<ClockIcon />} />
                <StatCard title="Approuvées" value={statusCounts.approved} color="green" icon={<CheckCircleIcon />} />
                <StatCard title="Refusées" value={statusCounts.rejected} color="red" icon={<CloseIcon />} />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(['all', 'Pending', 'Approved', 'Rejected'] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                            }`}
                    >
                        {status === 'all' ? 'Toutes' : status}
                    </button>
                ))}
            </div>

            {/* Quotes List */}
            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)
                ) : filteredQuotes.length === 0 ? (
                    <Card className="p-12 text-center">
                        <FileTextIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">Aucune soumission trouvée</p>
                    </Card>
                ) : (
                    filteredQuotes.map(quote => {
                        const client = clients.find(c => c.id === quote.clientId);
                        return (
                            <Card key={quote.id} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                {client?.name || 'Client inconnu'}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${quote.status === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : quote.status === 'Approved'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {quote.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-3">
                                            Date: {new Date(quote.date).toLocaleDateString()}
                                        </p>

                                        {/* Items */}
                                        <div className="space-y-1 mb-4">
                                            {quote.items.map((item, idx) => (
                                                <div key={idx} className="text-sm text-gray-600">
                                                    • {item.description} - ${item.cost.toFixed(2)}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="text-2xl font-bold text-primary-600">
                                            Total: ${quote.total.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {userRole === 'Client' && quote.status === 'Pending' && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleStatusUpdate(quote.id, 'Approved')}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleStatusUpdate(quote.id, 'Rejected')}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// Stats Card Component
const StatCard: React.FC<{ title: string; value: number; color: string; icon?: React.ReactElement }> = ({
    title,
    value,
    color,
    icon
}) => (
    <Card className="p-5">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
            {icon && (
                <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
                    {React.cloneElement(icon, { className: 'w-6 h-6' })}
                </div>
            )}
        </div>
    </Card>
);

// Quote Creation Form Component
const QuoteCreationForm: React.FC<{
    clients: Client[];
    vehicles: Vehicle[];
    onSave: () => void;
}> = ({ clients, vehicles, onSave }) => {
    const { t } = useTranslation();
    const [clientId, setClientId] = useState('');
    const [items, setItems] = useState<{ description: string; cost: number }[]>([
        { description: '', cost: 0 },
    ]);

    const addItem = () => {
        setItems([...items, { description: '', cost: 0 }]);
    };

    const updateItem = (index: number, field: 'description' | 'cost', value: any) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const getTotal = () => items.reduce((sum, item) => sum + Number(item.cost), 0);

    const handleSubmit = async () => {
        if (!clientId) {
            alert('Please select a client');
            return;
        }

        const quote: Omit<Quote, 'id'> = {
            clientId,
            appointmentId: '',
            date: new Date().toISOString(),
            total: getTotal(),
            status: 'Pending',
            items,
        };

        try {
            await createQuote(quote);
            onSave();
        } catch (error) {
            console.error('Failed to create quote:', error);
            alert('Failed to create quote');
        }
    };

    return (
        <div className="space-y-4">
            <Select label="Client" value={clientId} onChange={e => setClientId(e.target.value)}>
                <option value="">Choisir un client</option>
                {clients.map(c => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </Select>

            <div className="space-y-3">
                <label className="block text-sm font-medium">Items</label>
                {items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={e => updateItem(index, 'description', e.target.value)}
                            className="flex-1"
                        />
                        <Input
                            type="number"
                            placeholder="Prix"
                            value={item.cost}
                            onChange={e => updateItem(index, 'cost', parseFloat(e.target.value))}
                            className="w-32"
                        />
                        <button
                            onClick={() => removeItem(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                <Button variant="secondary" size="sm" onClick={addItem} icon={<PlusIcon />}>
                    Ajouter une ligne
                </Button>
            </div>

            <div className="pt-4 border-t flex justify-between items-center">
                <div className="text-xl font-bold">Total: ${getTotal().toFixed(2)}</div>
                <Button onClick={handleSubmit}>Créer la Soumission</Button>
            </div>
        </div>
    );
};

export default QuotesManager;
