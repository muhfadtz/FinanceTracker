import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useSettings } from '../../context/SettingsContext';
import { Transaction, Wallet } from '../../types';
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from '../../components/Icons';
import { formatDate } from '../../utils/helpers';

const SmallWalletCard = ({ wallet }: { wallet: Wallet}) => {
    const { formatCurrency } = useSettings();
    return (
        <div className="flex-shrink-0 w-32 bg-gray-100 dark:bg-gray-700 rounded-2xl p-3 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-evvo-green-light flex items-center justify-center">
                       <WalletIcon className="w-3 h-3 text-evvo-green-dark" />
                    </div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">{wallet.name}</p>
                </div>
            </div>
            <p className="font-bold text-gray-800 dark:text-gray-100 mt-2">{formatCurrency(wallet.balance)}</p>
        </div>
    )
};


const Home = () => {
  const { userProfile } = useAuth();
  const { wallets, transactions, goals, debts } = useData();
  const { t, formatCurrency, language } = useSettings();

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  
  const targetAccumulation = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalReceivables = debts
    .filter(d => d.type === 'receivable')
    .reduce((sum, debt) => sum + debt.amount, 0);

  const recentTransactions = transactions.slice(0, 5);


  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center ${transaction.type === 'expense' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                {transaction.type === 'expense' ? <ArrowUpIcon className="w-5 h-5" /> : <ArrowDownIcon className="w-5 h-5" />}
            </div>
            <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{transaction.category}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.walletName}</p>
            </div>
        </div>
        <div>
            <p className={`font-bold text-right ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                {transaction.type === 'expense' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
            </p>
             <p className="text-sm text-gray-500 dark:text-gray-400 text-right">{formatDate(transaction.date, language)}</p>
        </div>
    </div>
  );

  return (
    <div className="p-6 pb-28">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <img src={userProfile?.photoURL || `https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${userProfile?.email}`} alt="Profile" className="w-12 h-12 rounded-full mr-4 border-2 border-white dark:border-gray-700 shadow-md" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('welcomeBack')}</p>
              <h1 className="font-bold text-xl text-gray-800 dark:text-gray-100">{userProfile?.name || 'User'}</h1>
            </div>
        </div>
        <button className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>
      </header>

      <div className="bg-evvo-green-dark text-white p-5 rounded-2xl mb-6 relative overflow-hidden shadow-lg">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-evvo-green-medium/50 rounded-full opacity-50"></div>
        <div className="absolute right-4 -bottom-12 w-40 h-40 border-[6px] border-evvo-green-medium/50 rounded-full opacity-50"></div>
        <div className="relative z-10">
            <p className="text-sm text-green-200">{t('yourWalletBalance')}</p>
            <p className="text-4xl font-bold mt-1 mb-4">{formatCurrency(totalBalance)}</p>
            <div className="flex gap-4">
                <div className="flex-1 p-3 bg-white/10 rounded-lg text-sm">
                    <p className="text-green-200">{t('targetAccumulation')}</p>
                    <p className="font-semibold">{formatCurrency(targetAccumulation)}</p>
                </div>
                 <div className="flex-1 p-3 bg-white/10 rounded-lg text-sm">
                    <p className="text-red-200">{t('totalReceivables')}</p>
                    <p className="font-semibold">{formatCurrency(totalReceivables)}</p>
                </div>
            </div>
        </div>
      </div>
      
       <section className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">{t('yourWallet')}</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
            {wallets.map(wallet => <SmallWalletCard key={wallet.id} wallet={wallet} />)}
            <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{t('yourTransaction')}</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 divide-y divide-gray-100 dark:divide-gray-700 shadow-sm">
            {recentTransactions.length > 0 ? (
                recentTransactions.map(t => <TransactionItem key={t.id} transaction={t} />)
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('noTransactions')}</p>
            )}
        </div>
      </section>
    </div>
  );
};

export default Home;