import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { ServicesIcon } from '../../components/Icons';

const Services = () => {
  const { t } = useSettings();
  return (
    <div className="p-6 h-full flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-evvo-green-light rounded-full flex items-center justify-center mb-6">
        <ServicesIcon className="w-12 h-12 text-evvo-green-dark" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('featureServices')}</h1>
      <p className="text-evvo-green-dark mt-2 font-semibold">{t('underDevelopment')}</p>
      <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{t('servicesDesc')}</p>
    </div>
  );
};

export default Services;