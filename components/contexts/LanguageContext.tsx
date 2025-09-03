

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { translations } from '../../translations';

export type Language = 'ar' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    // FIX: Updated the type of the `t` function to allow for more flexible options and return types, resolving an issue with `returnObjects: true`.
    t: (key: string, replacements?: { [key: string]: any }) => any;
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

    const t = useCallback((key: string, replacements?: { [key: string]: any }) => {
        // FIX: Updated the logic for selecting the language dictionary to use `translations.ar` as a fallback, and cast the `translations` object to resolve the type error when accessing a dynamic language key.
        const langDict = (translations as any)[language] || translations.ar;
        let text: any = key.split('.').reduce((obj, k) => obj && (obj as any)[k], langDict) || key;
        
        if (replacements?.returnObjects) {
          return text;
        }

        if (replacements && typeof text === 'string') {
            Object.keys(replacements).forEach(rKey => {
                // Do not process the special `returnObjects` key as a replacement
                if (rKey === 'returnObjects') return;
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
