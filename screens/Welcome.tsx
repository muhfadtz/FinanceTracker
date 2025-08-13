import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { GoogleIcon } from '../components/Icons';

interface WelcomeProps {
    onNavigate: (view: 'login' | 'signup') => void;
    onGoogleSignIn: () => void;
}

const Welcome = ({ onNavigate, onGoogleSignIn }: WelcomeProps) => {
  const { t } = useSettings();
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-800">
      {/* Bagian Atas */}
      <div className="flex flex-col flex-grow justify-center px-8 pt-12 pb-8">
        <h1 className="font-bold text-gray-400 dark:text-gray-500 mb-2">
          evvoFinance
        </h1>
        <p className="text-5xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
          {t('letsGo')}
        </p>
      </div>

      {/* Bagian Tombol */}
      <div className="bg-evvo-green-dark text-white rounded-t-[40px] p-8 flex flex-col gap-4 shadow-lg">
        <button
          onClick={onGoogleSignIn}
          className="w-full bg-white text-gray-700 font-semibold py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
        >
          <GoogleIcon />
          {t('continueWithGoogle')}
        </button>
        <button
          onClick={() => onNavigate('signup')}
          className="w-full bg-evvo-green-medium text-white font-semibold py-3 rounded-lg hover:bg-opacity-80 transition-opacity"
        >
          {t('signUpWithEmail')}
        </button>
        <button
          onClick={() => onNavigate('login')}
          className="w-full text-center text-green-200 font-semibold py-2"
        >
          {t('logIn')}
        </button>
      </div>
    </div>
  );
};


export default Welcome;