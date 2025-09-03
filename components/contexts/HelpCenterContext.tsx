
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { HelpArticle, HelpCategory, HelpCenterContextType, BilingualText } from '../../types';
import { MOCK_HELP_ARTICLES, MOCK_HELP_CATEGORIES } from '../../constants';

const HelpCenterContext = createContext<HelpCenterContextType | undefined>(undefined);

export const useHelpCenterContext = () => {
    const context = useContext(HelpCenterContext);
    if (!context) {
        throw new Error('useHelpCenterContext must be used within a HelpCenterProvider');
    }
    return context;
};

export const HelpCenterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [articles, setArticles] = useState<HelpArticle[]>(MOCK_HELP_ARTICLES);
    const [categories, setCategories] = useState<HelpCategory[]>(MOCK_HELP_CATEGORIES);

    // Article CRUD
    const addArticle = (articleData: Omit<HelpArticle, 'id'>) => {
        const newArticle: HelpArticle = { id: `art-${Date.now()}`, ...articleData };
        setArticles(prev => [...prev, newArticle]);
    };

    const updateArticle = (updatedArticle: HelpArticle) => {
        setArticles(prev => prev.map(art => art.id === updatedArticle.id ? updatedArticle : art));
    };

    const deleteArticle = (articleId: string) => {
        setArticles(prev => prev.filter(art => art.id !== articleId));
    };

    // Category CRUD
    const addCategory = (categoryData: Omit<HelpCategory, 'id' | 'icon'> & { name: BilingualText }) => {
        const newCategory: HelpCategory = {
            id: `cat-${Date.now()}`,
            name: categoryData.name,
            icon: MOCK_HELP_CATEGORIES[0].icon, // Placeholder icon
        };
        setCategories(prev => [...prev, newCategory]);
    };

    const updateCategory = (updatedCategory: Omit<HelpCategory, 'icon'>) => {
        setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? { ...cat, name: updatedCategory.name } : cat));
    };

    const deleteCategory = (categoryId: string) => {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        // Also delete articles in that category
        setArticles(prev => prev.filter(art => art.categoryId !== categoryId));
    };


    const value = {
        articles,
        categories,
        addArticle,
        updateArticle,
        deleteArticle,
        addCategory,
        updateCategory,
        deleteCategory,
    };

    return <HelpCenterContext.Provider value={value}>{children}</HelpCenterContext.Provider>;
};