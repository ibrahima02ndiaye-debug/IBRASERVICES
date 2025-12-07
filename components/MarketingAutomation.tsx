import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';
import {
    MailIcon,
    SendIcon,
    UsersIcon,
    TrendingUpIcon,
    ClockIcon,
    CheckCircleIcon,
    EditIcon
} from './icons/Icons';

interface Campaign {
    id: string;
    name: string;
    type: 'Email' | 'SMS' | 'Push';
    status: 'Draft' | 'Scheduled' | 'Sent' | 'Active';
    segment: string;
    subject?: string;
    message: string;
    scheduledDate?: string;
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
}

interface CustomerSegment {
    id: string;
    name: string;
    description: string;
    count: number;
    criteria: string;
}

const MarketingAutomation: React.FC = () => {
    const { t } = useTranslation();

    const [campaigns, setCampaigns] = useState<Campaign[]>([
        {
            id: '1',
            name: 'Promotion Vidange d\'Huile Printemps',
            type: 'Email',
            status: 'Sent',
            segment: 'Clients Inactifs',
            subject: '🌸 Spécial Printemps: Vidange à 59.99$!',
            message: 'Préparez votre véhicule pour l\'été avec notre offre spéciale...',
            scheduledDate: '2024-03-15',
            sent: 342,
            opened: 178,
            clicked: 45,
            converted: 12,
        },
        {
            id: '2',
            name: 'Rappel Entretien Annuel',
            type: 'Email',
            status: 'Active',
            segment: 'Service Dû',
            subject: '⏰ C\'est le temps de votre entretien annuel',
            message: 'Votre véhicule est dû pour son entretien annuel...',
            sent: 89,
            opened: 67,
            clicked: 23,
            converted: 8,
        },
        {
            id: '3',
            name: 'Anniversaire Client VIP',
            type: 'Email',
            status: 'Scheduled',
            segment: 'VIP Gold/Platinum',
            subject: '🎂 Joyeux Anniversaire! Cadeau Spécial',
            message: 'Pour célébrer votre anniversaire, recevez 20% de rabais...',
            scheduledDate: '2024-12-25',
            sent: 0,
            opened: 0,
            clicked: 0,
            converted: 0,
        },
    ]);

    const segments: CustomerSegment[] = [
        {
            id: 'inactive',
            name: 'Clients Inactifs',
            description: 'Aucun service dans les 6 derniers mois',
            count: 342,
            criteria: 'last_service > 180 days',
        },
        {
            id: 'service-due',
            name: 'Service Dû',
            description: 'Entretien prévu basé sur kilométrage',
            count: 89,
            criteria: 'mileage_since_service > 5000km',
        },
        {
            id: 'vip',
            name: 'VIP Gold/Platinum',
            description: 'Clients fidélité niveau Gold ou Platinum',
            count: 47,
            criteria: 'loyalty_tier in [Gold, Platinum]',
        },
        {
            id: 'new',
            name: 'Nouveaux Clients',
            description: 'Clients des 30 derniers jours',
            count: 28,
            criteria: 'created_at > 30 days',
        },
        {
            id: 'high-value',
            name: 'Haute Valeur',
            description: 'Plus de $1000 dépensé cette année',
            count: 103,
            criteria: 'yearly_spend > 1000',
        },
    ];

    const [showCreateCampaign, setShowCreateCampaign] = useState(false);
    const [newCampaign, setNewCampaign] = useState({
        name: '',
        type: 'Email' as Campaign['type'],
        segment: '',
        subject: '',
        message: '',
    });

    const handleCreateCampaign = () => {
        const campaign: Campaign = {
            id: Date.now().toString(),
            ...newCampaign,
            status: 'Draft',
            sent: 0,
            opened: 0,
            clicked: 0,
            converted: 0,
        };
        setCampaigns([...campaigns, campaign]);
        setShowCreateCampaign(false);
        setNewCampaign({
            name: '',
            type: 'Email',
            segment: '',
            subject: '',
            message: '',
        });
    };

    const totalStats = campaigns.reduce((acc, c) => ({
        sent: acc.sent + c.sent,
        opened: acc.opened + c.opened,
        clicked: acc.clicked + c.clicked,
        converted: acc.converted + c.converted,
    }), { sent: 0, opened: 0, clicked: 0, converted: 0 });

    const avgOpenRate = totalStats.sent > 0 ? ((totalStats.opened / totalStats.sent) * 100).toFixed(1) : '0';
    const avgClickRate = totalStats.sent > 0 ? ((totalStats.clicked / totalStats.sent) * 100).toFixed(1) : '0';
    const avgConversionRate = totalStats.sent > 0 ? ((totalStats.converted / totalStats.sent) * 100).toFixed(1) : '0';

    const automationRules = [
        {
            name: 'Welcome Email',
            trigger: 'Nouveau client créé',
            action: 'Envoyer email de bienvenue avec 10% rabais',
            active: true,
        },
        {
            name: 'Post-Service Follow-up',
            trigger: '3 jours après service',
            action: 'Demander avis et feedback',
            active: true,
        },
        {
            name: 'Birthday Bonus',
            trigger: 'Jour d\'anniversaire',
            action: 'Envoyer cadeau d\'anniversaire personnalisé',
            active: true,
        },
        {
            name: 'Re-engagement',
            trigger: '90 jours sans activité',
            action: 'Offre spéciale de retour',
            active: false,
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Marketing Automatisé
                    </h1>
                    <p className="text-sm text-gray-500">
                        Campagnes intelligentes et automation marketing
                    </p>
                </div>
                <Button onClick={() => setShowCreateCampaign(true)} icon={<SendIcon />}>
                    Nouvelle Campagne
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <MailIcon className="w-8 h-8 opacity-80 mb-2" />
                    <p className="text-sm opacity-90">Total Envoyés</p>
                    <p className="text-3xl font-bold">{totalStats.sent.toLocaleString()}</p>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <TrendingUpIcon className="w-8 h-8 opacity-80 mb-2" />
                    <p className="text-sm opacity-90">Taux d\'Ouverture</p>
                    <p className="text-3xl font-bold">{avgOpenRate}%</p>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <TrendingUpIcon className="w-8 h-8 opacity-80 mb-2" />
                    <p className="text-sm opacity-90">Taux de Clic</p>
                    <p className="text-3xl font-bold">{avgClickRate}%</p>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                    <CheckCircleIcon className="w-8 h-8 opacity-80 mb-2" />
                    <p className="text-sm opacity-90">Conversions</p>
                    <p className="text-3xl font-bold">{totalStats.converted}</p>
                    <p className="text-xs opacity-75">{avgConversionRate}% taux</p>
                </Card>
            </div>

            {/* Create Campaign Modal */}
            {showCreateCampaign && (
                <Card className="p-6 border-2 border-blue-500">
                    <h3 className="text-lg font-bold mb-4">Créer Nouvelle Campagne</h3>
                    <div className="space-y-4">
                        <Input
                            label="Nom de la Campagne"
                            value={newCampaign.name}
                            onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                            placeholder="Ex: Promotion Été 2024"
                        />

                        <Select
                            label="Type"
                            value={newCampaign.type}
                            onChange={e => setNewCampaign({ ...newCampaign, type: e.target.value as Campaign['type'] })}
                        >
                            <option value="Email">Email</option>
                            <option value="SMS">SMS</option>
                            <option value="Push">Push Notification</option>
                        </Select>

                        <Select
                            label="Segment de Clients"
                            value={newCampaign.segment}
                            onChange={e => setNewCampaign({ ...newCampaign, segment: e.target.value })}
                        >
                            <option value="">Choisir un segment</option>
                            {segments.map(seg => (
                                <option key={seg.id} value={seg.name}>
                                    {seg.name} ({seg.count} clients)
                                </option>
                            ))}
                        </Select>

                        {newCampaign.type === 'Email' && (
                            <Input
                                label="Sujet"
                                value={newCampaign.subject}
                                onChange={e => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                                placeholder="Sujet accrocheur..."
                            />
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Message
                            </label>
                            <textarea
                                value={newCampaign.message}
                                onChange={e => setNewCampaign({ ...newCampaign, message: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                                placeholder="Contenu du message..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleCreateCampaign}>Créer Campagne</Button>
                            <Button variant="secondary" onClick={() => setShowCreateCampaign(false)}>
                                Annuler
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Campaigns List */}
            <div>
                <h3 className="text-lg font-bold mb-4">Campagnes</h3>
                <div className="space-y-4">
                    {campaigns.map(campaign => (
                        <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {campaign.name}
                                        </h4>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${campaign.status === 'Sent'
                                                    ? 'bg-green-100 text-green-700'
                                                    : campaign.status === 'Active'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : campaign.status === 'Scheduled'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {campaign.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {campaign.type} • {campaign.segment}
                                        {campaign.scheduledDate && ` • Prévu: ${new Date(campaign.scheduledDate).toLocaleDateString()}`}
                                    </p>
                                    {campaign.subject && (
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                                            {campaign.subject}
                                        </p>
                                    )}
                                </div>
                                <Button size="sm" variant="secondary" icon={<EditIcon />}>
                                    Modifier
                                </Button>
                            </div>

                            {campaign.sent > 0 && (
                                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p className="text-xs text-gray-500">Envoyés</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            {campaign.sent}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Ouverts</p>
                                        <p className="text-lg font-bold text-blue-600">
                                            {campaign.opened}
                                            <span className="text-sm font-normal text-gray-500 ml-1">
                                                ({((campaign.opened / campaign.sent) * 100).toFixed(1)}%)
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Cliqués</p>
                                        <p className="text-lg font-bold text-purple-600">
                                            {campaign.clicked}
                                            <span className="text-sm font-normal text-gray-500 ml-1">
                                                ({((campaign.clicked / campaign.sent) * 100).toFixed(1)}%)
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Conversions</p>
                                        <p className="text-lg font-bold text-green-600">
                                            {campaign.converted}
                                            <span className="text-sm font-normal text-gray-500 ml-1">
                                                ({((campaign.converted / campaign.sent) * 100).toFixed(1)}%)
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>

            {/* Customer Segments */}
            <div>
                <h3 className="text-lg font-bold mb-4">Segments Clients</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {segments.map(segment => (
                        <Card key={segment.id} className="p-5 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <UsersIcon className="w-8 h-8 text-blue-600" />
                                <span className="text-2xl font-bold text-blue-600">{segment.count}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{segment.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {segment.description}
                            </p>
                            <p className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                {segment.criteria}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Automation Rules */}
            <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Règles d'Automation</h3>
                <div className="space-y-3">
                    {automationRules.map((rule, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={rule.active}
                                    onChange={() => { }}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{rule.name}</p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Trigger:</span> {rule.trigger} →{' '}
                                        <span className="font-medium">Action:</span> {rule.action}
                                    </p>
                                </div>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${rule.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {rule.active ? 'Actif' : 'Inactif'}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default MarketingAutomation;
