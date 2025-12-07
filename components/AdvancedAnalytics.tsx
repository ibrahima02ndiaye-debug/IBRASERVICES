import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './common/Card';
import {
    TrendingUpIcon,
    DollarSignIcon,
    UsersIcon,
    CarIcon,
    CalendarIcon,
    ClockIcon,
} from './icons/Icons';

interface MetricData {
    label: string;
    value: string | number;
    change: number;
    trend: 'up' | 'down';
    icon: React.ReactElement;
}

const AdvancedAnalytics: React.FC = () => {
    const { t } = useTranslation();

    const metrics: MetricData[] = [
        { label: 'Revenue Ce Mois', value: '$47,250', change: 12.5, trend: 'up', icon: <DollarSignIcon /> },
        { label: 'Nouveaux Clients', value: 38, change: 8.2, trend: 'up', icon: <UsersIcon /> },
        { label: 'Services Complétés', value: 156, change: -3.1, trend: 'down', icon: <CarIcon /> },
        { label: 'Taux de Satisfaction', value: '4.8/5', change: 0.3, trend: 'up', icon: <TrendingUpIcon /> },
    ];

    const servicePopularity = [
        { name: 'Vidange d\'huile', count: 45, revenue: 3825 },
        { name: 'Freins', count: 28, revenue: 6720 },
        { name: 'Inspection', count: 52, revenue: 2600 },
        { name: 'Climatisation', count: 19, revenue: 4750 },
        { name: 'Transmiss ion', count: 12, revenue: 8400 },
    ];

    const revenueByDay = [
        { day: 'Lun', revenue: 6200 },
        { day: 'Mar', revenue: 7800 },
        { day: 'Mer', revenue: 5400 },
        { day: 'Jeu', revenue: 8900 },
        { day: 'Ven', revenue: 9500 },
        { day: 'Sam', revenue: 5200 },
    ];

    const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue));

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Avancés</h1>
                <p className="text-sm text-gray-500">Insights en temps réel pour optimiser votre business</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, idx) => (
                    <Card key={idx} className="p-5 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                {React.cloneElement(metric.icon, { className: 'w-6 h-6 text-white' })}
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-bold ${metric.trend === 'up'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                {metric.trend === 'up' ? '↑' : '↓'} {Math.abs(metric.change)}%
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{metric.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                    </Card>
                ))}
            </div>

            {/* Revenue Chart */}
            <Card className="p-6">
                <h3 className="font-bold text-lg mb-6">Revenus Par Jour (Cette Semaine)</h3>
                <div className="flex items-end gap-4 h-64">
                    {revenueByDay.map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg relative group">
                                <div
                                    className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg transition-all duration-500 hover:from-blue-500 hover:to-purple-500"
                                    style={{ height: `${(item.revenue / maxRevenue) * 200}px` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        ${item.revenue.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">{item.day}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Service Popularity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-4">Services Les Plus Populaires</h3>
                    <div className="space-y-4">
                        {servicePopularity.map((service, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{service.name}</span>
                                    <span className="text-gray-500">{service.count} services</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(service.count / 52) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-green-600 font-medium">
                                    ${service.revenue.toLocaleString()} revenue
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Customer Insights */}
                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-4">Insights Clients</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Valeur Vie Client (LTV)</p>
                            <p className="text-2xl font-bold text-blue-600">$2,450</p>
                            <p className="text-xs text-gray-500 mt-1">↑ 18% vs année dernière</p>
                        </div>

                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Taux de Rétention</p>
                            <p className="text-2xl font-bold text-green-600">87%</p>
                            <p className="text-xs text-gray-500 mt-1">Excellent maintien clientèle</p>
                        </div>

                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">ROI Marketing</p>
                            <p className="text-2xl font-bold text-purple-600">3.8x</p>
                            <p className="text-xs text-gray-500 mt-1">$3.80 gagné par $1 investi</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Forecasts */}
            <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <h3 className="font-bold text-xl mb-2">🔮 Prévisions IA</h3>
                <p className="text-blue-100 mb-4">Basé sur vos données historiques et tendances du marché</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm opacity-90">Revenue Projeté (Mois Prochain)</p>
                        <p className="text-3xl font-bold">$52,800</p>
                        <p className="text-xs opacity-75">+12% de croissance</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Nouveaux Clients Attendus</p>
                        <p className="text-3xl font-bold">42</p>
                        <p className="text-xs opacity-75">Pic saisonnier prévu</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Meilleur Jour pour Promotion</p>
                        <p className="text-3xl font-bold">Jeudi</p>
                        <p className="text-xs opacity-75">Taux de conversion optimal</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdvancedAnalytics;
