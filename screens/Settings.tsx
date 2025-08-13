import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { BackIcon, EditIcon, LogoutIcon } from '../components/Icons';

interface SettingsProps {
  onBack: () => void;
}

const SettingsItem = ({ icon, title, subtitle, onClick }: { icon: React.ReactNode, title: string, subtitle: string, onClick?: () => void }) => (
    <div onClick={onClick} className={`flex items-center justify-between p-4 rounded-xl shadow-sm transition-colors cursor-pointer ${onClick ? 'hover:bg-gray-100 dark:hover:bg-gray-600' : ''} bg-white dark:bg-gray-700`}>
        <div className="flex items-center gap-4">
            <div className="text-gray-500 dark:text-gray-300">{icon}</div>
            <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </div>
);

const Settings = ({ onBack }: SettingsProps) => {
    const { userProfile, logout } = useAuth();
    const { theme, setTheme, language, setLanguage, currency, setCurrency, t } = useSettings();
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);
    const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);

    if (!userProfile) return null;

    return (
        <div className="h-full animate-slide-in-right">
            <div className="p-6 pb-28 min-h-full overflow-y-auto">
                <header className="relative flex items-center justify-between mb-6">
                    <button onClick={onBack} className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                        <BackIcon className="h-6 w-6" />
                    </button>
                    <h1 className="font-bold text-xl text-gray-800 dark:text-gray-100 absolute left-1/2 -translate-x-1/2">{t('settings')}</h1>
                    <div className="w-6"></div>
                </header>

                <div className="text-center mb-8">
                    <img
                        src={userProfile.photoURL || `https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${userProfile.email}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{userProfile.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{userProfile.email}</p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 px-1 pt-4">{t('preferences')}</h3>
                    <SettingsItem 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                        title={t('dark_mode')}
                        subtitle={t('dark_mode_desc')}
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    />
                     <SettingsItem 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13h4m-4-2v2m-5-12v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2z" /></svg>}
                        title={t('language')}
                        subtitle={language === 'id' ? 'Bahasa Indonesia' : 'English'}
                        onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                    />
                     <SettingsItem 
                        icon={<span className="font-bold text-xl w-6 text-center">$</span>}
                        title={t('currency')}
                        subtitle={currency}
                        onClick={() => {
                            const currencies = ['IDR', 'USD', 'EUR'];
                            const currentIndex = currencies.indexOf(currency);
                            const nextIndex = (currentIndex + 1) % currencies.length;
                            setCurrency(currencies[nextIndex] as 'IDR' | 'USD' | 'EUR');
                        }}
                    />
                </div>
                 
                 <div className="mt-8">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 px-1 pt-4">{t('account')}</h3>
                     <button onClick={logout} className="w-full flex items-center justify-center gap-3 p-4 mt-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-semibold shadow-sm dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400">
                        <LogoutIcon className="w-6 h-6" />
                        <span>{t('logOut')}</span>
                    </button>
                 </div>
            </div>
             <style>{`
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                @keyframes slide-in-right {
                  from { transform: translateX(100%); }
                  to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default Settings;