import React from 'react';
import { HomeIcon, WalletIcon, PlusIcon, ServicesIcon, ProfileIcon } from './Icons';

type NavItem = 'home' | 'wallet' | 'services' | 'profile';

interface BottomNavProps {
  activeItem: NavItem;
  onItemClick: (item: NavItem) => void;
  onAddClick: () => void;
}

const NavButton = ({ isActive, onClick, children }: { isActive: boolean; onClick: () => void; children: React.ReactNode }) => {
    const activeClass = 'text-evvo-green-dark dark:text-evvo-green-light';
    const inactiveClass = 'text-gray-400 dark:text-gray-500';
    return (
        <button onClick={onClick} className={`transition-colors duration-300 ${isActive ? activeClass : inactiveClass}`}>
            {children}
        </button>
    );
}

const BottomNav = ({ activeItem, onItemClick, onAddClick }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-800 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.2)] rounded-t-2xl">
      <div className="flex justify-around items-center h-20">
        <NavButton isActive={activeItem === 'home'} onClick={() => onItemClick('home')}>
          <HomeIcon className="w-7 h-7" />
        </NavButton>
        <NavButton isActive={activeItem === 'wallet'} onClick={() => onItemClick('wallet')}>
          <WalletIcon className="w-7 h-7" />
        </NavButton>
        <button onClick={onAddClick} className="bg-evvo-green-dark text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform -translate-y-4 hover:bg-evvo-green-medium transition-all">
          <PlusIcon className="w-8 h-8" />
        </button>
        <NavButton isActive={activeItem === 'services'} onClick={() => onItemClick('services')}>
          <ServicesIcon className="w-7 h-7" />
        </NavButton>
        <NavButton isActive={activeItem === 'profile'} onClick={() => onItemClick('profile')}>
          <ProfileIcon className="w-7 h-7" />
        </NavButton>
      </div>
    </div>
  );
};

export default BottomNav;
