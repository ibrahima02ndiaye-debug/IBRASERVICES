import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from './common/Card';

const Messaging: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Card>
            <div className="p-6">
                <h2 className="text-xl font-bold">{t('messages.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {t('messages.under_construction')}
                </p>
            </div>
        </Card>
    );
};

export default Messaging;
