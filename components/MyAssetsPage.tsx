
import React, { useMemo } from 'react';
import type { Asset } from '../types';
import PageHeader from './PageHeader';
import Card from './Card';
import { useAssetsContext } from './contexts/AssetsContext';

interface MyAssetsPageProps {
    currentUserId: string;
}

const MyAssetsPage: React.FC<MyAssetsPageProps> = ({ currentUserId }) => {
    const { assets: allAssets } = useAssetsContext();

    const assets = useMemo(() => 
        allAssets.filter(a => a.assignedToId === currentUserId),
        [allAssets, currentUserId]
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="عهدتي"
                subtitle="قائمة بجميع عهد الشركة التي في حوزتك حاليًا."
            />
            <Card paddingClass="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="px-6 py-3">العهدة</th>
                                <th className="px-6 py-3">الفئة</th>
                                <th className="px-6 py-3">الرقم التسلسلي</th>
                                <th className="px-6 py-3">تاريخ الشراء/الاستلام</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map(asset => (
                                <tr key={asset.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-semibold text-slate-800">{asset.name}</td>
                                    <td className="px-6 py-4">{asset.category}</td>
                                    <td className="px-6 py-4 font-mono">{asset.serialNumber}</td>
                                    <td className="px-6 py-4">{new Date(asset.purchaseDate).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                </tr>
                            ))}
                             {assets.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-slate-500">
                                        لا توجد أي عهد مسجلة باسمك حاليًا.
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