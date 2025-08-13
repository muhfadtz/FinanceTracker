import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';
import Home from './main/Home';
import WalletScreen from './main/Wallet';
import Services from './main/Services';
import Profile from './main/Profile';
import Settings from './Settings';
import AddTransactionModal from './AddTransactionModal';

type NavItem = 'home' | 'wallet' | 'services' | 'profile';

const MainApp = () => {
  const [activeScreen, setActiveScreen] = useState<NavItem>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [overlay, setOverlay] = useState<string | null>(null);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <Home />;
      case 'wallet':
        return <WalletScreen />;
      case 'services':
        return <Services />;
      case 'profile':
        // Pass the function to set the overlay
        return <Profile onNavigateToSettings={() => setOverlay('settings')} />;
      default:
        return <Home />;
    }
  };

  // If an overlay is active, render it exclusively.
  // This prevents the underlying screen (Profile) and the BottomNav from rendering.
  if (overlay === 'settings') {
    return <Settings onBack={() => setOverlay(null)} />;
  }

  return (
    <div className="w-full relative flex flex-col flex-grow">
      <main className="flex-grow">{renderScreen()}</main>
      
      <BottomNav 
        activeItem={activeScreen}
        onItemClick={(item) => {
            setActiveScreen(item);
        }}
        onAddClick={() => setIsModalOpen(true)}
      />
      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MainApp;