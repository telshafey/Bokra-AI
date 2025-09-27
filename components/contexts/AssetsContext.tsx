import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Asset, AssetsContextType, AssetsProviderProps } from '../../types';
import { fetchAssets, updateAsset, updateAssetAssignment } from '../../services/mockApi';
import { useToast } from './ToastContext';
import { useTranslation } from './LanguageContext';

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

export const useAssetsContext = () => {
    const context = useContext(AssetsContext);
    if (!context) {
        throw new Error('useAssetsContext must be used within an AssetsProvider');
    }
    return context;
};

export const AssetsProvider: React.FC<AssetsProviderProps> = ({ children }) => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const { t } = useTranslation();

    const { data: assets = [], isError, error } = useQuery<Asset[], Error>({
        queryKey: ['assets'],
        queryFn: fetchAssets,
    });

    const saveAssetMutation = useMutation({
        mutationFn: updateAsset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            addToast(t('toasts.assetSaved'), 'success');
        },
        onError: (err: Error) => {
            addToast(err.message, 'error');
        },
    });

    const assignAssetMutation = useMutation({
        mutationFn: updateAssetAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            addToast(t('toasts.assetAssigned'), 'success');
        },
         onError: (err: Error) => {
            addToast(err.message, 'error');
        },
    });

    const value: AssetsContextType = {
        assets,
        saveAsset: (asset: Asset) => saveAssetMutation.mutate(asset),
        assignAsset: (assetId: string, employeeId: string | null) => 
            assignAssetMutation.mutate({ assetId, employeeId }),
    };

    if (isError) {
        return <div className="p-4 text-center text-red-500">Error loading assets: {error.message}</div>;
    }

    return <AssetsContext.Provider value={value}>{children}</AssetsContext.Provider>;
};