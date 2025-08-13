import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Currency } from '../i18n';

type Theme = 'light' | 'dark';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  t: (key: keyof typeof translations.en) => string;
  formatCurrency: (amount: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
        console.error(error);
        return defaultValue;
    }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>(() => getInitialState<Theme>('theme', 'light'));
    const [language, setLanguageState] = useState<Language>(() => getInitialState<Language>('language', 'id'));
    const [currency, setCurrencyState] = useState<Currency>(() => getInitialState<Currency>('currency', 'IDR'));

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', JSON.stringify(theme));
    }, [theme]);
    
    const setTheme = (newTheme: Theme) => setThemeState(newTheme);
    
    const setLanguage = (newLanguage: Language) => {
        setLanguageState(newLanguage);
        localStorage.setItem('language', JSON.stringify(newLanguage));
    };

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('currency', JSON.stringify(newCurrency));
    };

    const t = (key: keyof typeof translations.en): string => {
        return translations[language][key] || translations.en[key];
    };
    
    const formatCurrency = (amount: number) => {
        if (isNaN(amount)) amount = 0;
        return new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const value = { theme, setTheme, language, setLanguage, currency, setCurrency, t, formatCurrency };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
