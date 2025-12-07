import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import Card from './common/Card';
import Button from './common/Button';
import { StarIcon, GiftIcon, CrownIcon, TrophyIcon, CheckCircleIcon } from './icons/Icons';

interface LoyaltyPoints {
    total: number;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    nextTierPoints: number;
    lifetime: number;
}

interface Reward {
    id: string;
    name: string;
    description: string;
    pointsCost: number;
    icon: React.ReactElement;
    available: boolean;
}

const LoyaltyProgram: React.FC = () => {
    const { t } = useTranslation();
    const { userRole } = useAppContext();

    const [points, setPoints] = useState<LoyaltyPoints>({
        total: 1250,
        tier: 'Silver',
        nextTierPoints: 750,
        lifetime: 3400,
    });

    const tiers = [
        { name: 'Bronze', min: 0, color: 'bg-amber-700', icon: '🥉', perks: ['5% de rabais', '1 point par $'] },
        { name: 'Silver', min: 500, color: 'bg-gray-400', icon: '🥈', perks: ['10% de rabais', '1.5 points par $', 'Rappels prioritaires'] },
        { name: 'Gold', min: 2000, color: 'bg-yellow-500', icon: '🥇', perks: ['15% de rabais', '2 points par $', 'Service Express', 'Cadeau d\'anniversaire'] },
        { name: 'Platinum', min: 5000, color: 'bg-purple-600', icon: '👑', perks: ['20% de rabais', '3 points par $', 'VIP Lane', 'Concierge Service', 'Pick-up gratuit'] },
    ];

    const rewards: Reward[] = [
        {
            id: '1',
            name: 'Vidange Gratuite',
            description: 'Vidange d\'huile synthétique complète',
            pointsCost: 500,
            icon: <GiftIcon />,
            available: points.total >= 500,
        },
        {
            id: '2',
            name: '50$ de Crédit',
            description: 'Crédit applicable sur tout service',
            pointsCost: 800,
            icon: <StarIcon />,
            available: points.total >= 800,
        },
        {
            id: '3',
            name: 'Inspection Premium',
            description: 'Inspection complète 120 points',
            pointsCost: 400,
            icon: <CheckCircleIcon />,
            available: points.total >= 400,
        },
        {
            id: '4',
            name: 'Service VIP',
            description: 'Service prioritaire pendant 1 an',
            pointsCost: 2000,
            icon: <CrownIcon />,
            available: points.total >= 2000,
        },
    ];

    const currentTierIndex = tiers.findIndex(t => t.name === points.tier);
    const nextTier = tiers[currentTierIndex + 1];
    const progressToNextTier = nextTier
        ? ((points.total - tiers[currentTierIndex].min) / (nextTier.min - tiers[currentTierIndex].min)) * 100
        : 100;

    const handleRedeem = (reward: Reward) => {
        if (reward.available) {
            // Call API to redeem
            alert(`Récompense "${reward.name}" échangée avec succès! Vous avez économisé ${reward.pointsCost} points.`);
            setPoints(prev => ({
                ...prev,
                total: prev.total - reward.pointsCost,
            }));
        }
    };

    const earnPointsActivities = [
        { action: 'Service complet', points: '+150' },
        { action: 'Parrainage ami', points: '+300' },
        { action: 'Avis 5 étoiles', points: '+100' },
        { action: 'Anniversaire', points: '+200' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Programme de Fidélité VIP
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Gagnez des points à chaque service et profitez de récompenses exclusives
                </p>
            </div>

            {/* Current Status Card */}
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>

                <div className="relative p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Votre Niveau</p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-4xl">{tiers[currentTierIndex].icon}</span>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {points.tier}
                                    </h2>
                                    <p className="text-sm text-gray-500">Membre depuis 2023</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Points Disponibles</p>
                            <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {points.total.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {points.lifetime.toLocaleString()} points cumulés
                            </p>
                        </div>
                    </div>

                    {/* Progress to Next Tier */}
                    {nextTier && (
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Prochain niveau: {nextTier.name}</span>
                                <span className="text-gray-600">
                                    {points.nextTierPoints} points nécessaires
                                </span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
                                    style={{ width: `${progressToNextTier}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Current Tier Perks */}
                    <div className="mt-6">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Vos Avantages Actuels:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {tiers[currentTierIndex].perks.map((perk, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm flex items-center gap-1"
                                >
                                    <CheckCircleIcon className="w-4 h-4" />
                                    {perk}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tier Levels */}
            <div>
                <h3 className="text-xl font-bold mb-4">Niveaux de Fidélité</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {tiers.map((tier, idx) => (
                        <Card
                            key={tier.name}
                            className={`p-6 text-center ${tier.name === points.tier
                                    ? 'ring-2 ring-purple-600 shadow-lg transform scale-105'
                                    : 'opacity-60'
                                }`}
                        >
                            <div className="text-5xl mb-3">{tier.icon}</div>
                            <h4 className="font-bold text-lg mb-2">{tier.name}</h4>
                            <p className="text-xs text-gray-500 mb-3">À partir de {tier.min} pts</p>
                            <div className="space-y-1 text-xs text-left">
                                {tier.perks.map((perk, i) => (
                                    <p key={i} className="flex items-center gap-1">
                                        <CheckCircleIcon className="w-3 h-3 text-green-600" />
                                        {perk}
                                    </p>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Rewards Store */}
            <div>
                <h3 className="text-xl font-bold mb-4">Boutique de Récompenses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {rewards.map((reward) => (
                        <Card key={reward.id} className="p-6 flex flex-col">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                                {React.cloneElement(reward.icon, { className: 'w-6 h-6 text-white' })}
                            </div>
                            <h4 className="font-bold mb-2">{reward.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                                {reward.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-purple-600">{reward.pointsCost} pts</span>
                                <Button
                                    size="sm"
                                    disabled={!reward.available}
                                    onClick={() => handleRedeem(reward)}
                                >
                                    {reward.available ? 'Échanger' : 'Bientôt'}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* How to Earn Points */}
            <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Comment Gagner Plus de Points</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {earnPointsActivities.map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                +
                            </div>
                            <div>
                                <p className="font-medium text-sm">{activity.action}</p>
                                <p className="text-green-600 font-bold">{activity.points}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Referral Program */}
            <Card className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Parrainez un Ami</h3>
                        <p className="text-purple-100">
                            Vous et votre ami recevez 300 points! 🎁
                        </p>
                    </div>
                    <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                        Partager Mon Code
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default LoyaltyProgram;
