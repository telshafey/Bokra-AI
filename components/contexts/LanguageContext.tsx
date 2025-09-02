
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { translations } from '../../translations';

export type Language = 'ar' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('ar');

    const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
        const langDict = translations[language] || translations.en;
        let text = key.split('.').reduce((obj, k) => obj && (obj as any)[k], langDict) || key;
        
        if (replacements) {
            Object.keys(replacements).forEach(rKey => {
                text = text.replace(new RegExp(`{{${rKey}}}`, 'g'), String(replacements[rKey]));
            });
        }

        return text;
    }, [language]);

    const value = { language, setLanguage, t };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
