
import React, { createContext, useContext, useState } from 'react';
import { Asset, AssetsContextType, AssetsProviderProps } from '../../types';
import { MOCK_ASSETS } from '../../constants';

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

export const useAssetsContext = () => {
    const context = useContext(AssetsContext);
    if (!context) {
        throw new Error('useAssetsContext must be used within an AssetsProvider');
    }
    return context;
};

export const AssetsProvider: React.FC<AssetsProviderProps> = ({ children }) => {
    const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);

    const saveAsset = (asset: Asset) => {
        setAssets(prev => {
            const isNew = !prev.some(a => a.id === asset.id);
            if (isNew) {
                return [...prev, asset];
            } else {
                return prev.map(a => a.id === asset.id ? asset : a);
            }
        });
    };

    const assignAsset = (assetId: string, employeeId: string | null) => {
        setAssets(prev =>
            prev.map(a =>
                a.id === assetId
                    ? { ...a, assignedToId: employeeId, status: employeeId ? 'Assigned' : 'Available' }
                    : a
            )
        );
    };

    const value = {
        assets,
        saveAsset,
        assignAsset,
    };

    return <AssetsContext.Provider value={value}>{children}</AssetsContext.Provider>;
};
