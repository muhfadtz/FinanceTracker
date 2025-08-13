import React from 'react';
import { useSettings } from '../context/SettingsContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  const { theme } = useSettings();
  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex-grow pt-16 px-8">
        <h1 className="font-bold text-gray-400 dark:text-gray-500 mb-2">evvoFinance</h1>
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      </div>
      <div className="bg-evvo-green-dark text-white rounded-t-[40px] p-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
