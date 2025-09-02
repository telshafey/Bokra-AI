
import React, { useMemo } from 'react';
import type { Asset } from '../types';
import PageHeader from './PageHeader';
import Card from './Card';
import { useAssetsContext } from './contexts/AssetsContext';
import { useTranslation } from './contexts/LanguageContext';

interface MyAssetsPageProps {
    currentUserId: string;
}

const MyAssetsPage: React.FC<MyAssetsPageProps> = ({ currentUserId }) => {
    const { t, language } = useTranslation();
    const { assets: allAssets } = useAssetsContext();

    const assets = useMemo(() => 
        allAssets.filter(a => a.assignedToId === currentUserId),
        [allAssets, currentUserId]
    );

    const locale = language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';

    return (
        <div className="space-y-6">
            <PageHeader
                title={t('myAssets.pageHeaderTitle')}
                subtitle={t('myAssets.pageHeaderSubtitle')}
            />
            <Card paddingClass="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3">{t('myAssets.assetName')}</th>
                                <th className="px-6 py-3">{t('myAssets.category')}</th>
                                <th className="px-6 py-3">{t('myAssets.serialNumber')}</th>
                                <th className="px-6 py-3">{t('myAssets.receivedDate')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map(asset => (
                                <tr key={asset.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{asset.name}</td>
                                    <td className="px-6 py-4">{t(`assets.categories.${asset.category}`)}</td>
                                    <td className="px-6 py-4 font-mono">{asset.serialNumber}</td>
                                    <td className="px-6 py-4">{new Date(asset.purchaseDate).toLocaleDateString(locale)}</td>
                                </tr>
                            ))}
                             {assets.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        {t('myAssets.noAssets')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default MyAssetsPage;
