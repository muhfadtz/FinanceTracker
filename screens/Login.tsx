import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface LoginProps {
    onNavigate: (view: 'signup') => void;
}

const Login = ({ onNavigate }: LoginProps) => {
  const { t } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(t('errorLoginFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-800">
      {/* Bagian Atas */}
      <div className="flex flex-col flex-grow justify-center px-8 pt-12 pb-8">
        <h1 className="font-bold text-gray-400 dark:text-gray-500 mb-2">
          evvoFinance
        </h1>
        <p className="text-4xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
          {t('loginTitle')}
        </p>
      </div>

      {/* Bagian Form */}
      <div className="bg-evvo-green-dark text-white rounded-t-[40px] p-8 shadow-lg">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white text-gray-800 placeholder-gray-400 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-evvo-green-medium"
          />
          <input
            type="password"
            placeholder={t('passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white text-gray-800 placeholder-gray-400 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-evvo-green-medium"
          />
          {error && (
            <p className="bg-red-100 text-red-600 px-3 py-2 rounded-md text-sm">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-evvo-green-dark font-bold py-3 rounded-lg mt-4 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loading ? t('loggingIn') : t('continue')}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="w-full text-center text-green-100 hover:text-white font-semibold py-2 mt-2 transition-colors"
          >
            {t('signupWithEmailNav')}
          </button>
        </form>
      </div>
    </div>
  );
};


export default Login;
