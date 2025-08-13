import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useSettings } from '../../context/SettingsContext';
import { BriefcaseIcon, EditIcon, CogIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, CalendarIcon, CheckIcon, TrashIcon } from '../../components/Icons';
import { formatDate } from '../../utils/helpers';
import { Spinner } from '../../components/Spinner';
import { Goal, Debt, Transaction } from '../../types';


// --- In-file Component: AvatarSelectionModal ---
const avatarSeeds = [
  'Midnight', 'Salem', 'Boo', 'Shadow', 'Jasper', 'Milo', 'Oscar', 'Gizmo',
  'Felix', 'Simba', 'Loki', 'Zoe', 'Cleo', 'Luna', 'Nala', 'Leo',
  'Tiger', 'Smokey', 'Oreo', 'Coco'
];

const AvatarSelectionModal = ({ isOpen, onClose, onSelect, t }: { isOpen: boolean; onClose: () => void; onSelect: (url: string) => void; t: (key: any) => string; }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('chooseAvatar')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl">&times;</button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto">
          {avatarSeeds.map(seed => {
            const url = `https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${seed}`;
            return (
              <button key={seed} onClick={() => onSelect(url)} className="p-2 rounded-full aspect-square bg-gray-100 dark:bg-gray-700 hover:ring-4 hover:ring-evvo-green-dark transition-all duration-200">
                <img src={url} alt={seed} className="w-full h-full rounded-full" />
              </button>
            );
          })}
        </div>
      </div>
      <style>{`.animate-scale-in{animation:scale-in .3s cubic-bezier(.25,.46,.45,.94) forwards}@keyframes scale-in{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
};


// --- In-file Component: EditProfileModal ---
const EditProfileModal = ({ isOpen, onClose, t }: { isOpen: boolean, onClose: () => void; t: (key: any) => string; }) => {
  const { userProfile, updateUserProfile } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
    }
  }, [userProfile, isOpen]);
  
  if (!isOpen || !userProfile) return null;

  const handleSave = async () => {
    setError('');
    if (name.trim() === userProfile.name) {
      onClose();
      return;
    }
    if (name.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({ name: name.trim() });
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getRemainingChanges = () => {
    const now = new Date();
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    
    let currentCount = userProfile.usernameUpdateCount || 0;
    const lastUpdate = userProfile.lastUsernameUpdate?.toDate();
    
    if (lastUpdate && now.getTime() - lastUpdate.getTime() > oneWeekInMs) {
      currentCount = 0;
    }
    
    return 3 - currentCount;
  };

  const remainingChanges = getRemainingChanges();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm animate-scale-in">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('editProfile')}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="username">
              {t('yourName')}
            </label>
            <input
              id="username"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
               {t('usernameUpdateInfo').replace('{count}', String(remainingChanges))}
            </p>
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="email">
              {t('emailPlaceholder')}
            </label>
            <input
              id="email"
              type="email"
              value={userProfile.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="w-full py-3 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">
            {t('cancel')}
          </button>
          <button onClick={handleSave} disabled={loading || remainingChanges <= 0} className="w-full py-3 rounded-lg bg-evvo-green-dark text-white font-bold hover:bg-evvo-green-medium transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : t('save')}
          </button>
        </div>
      </div>
      <style>{`.animate-scale-in{animation:scale-in .3s cubic-bezier(.25,.46,.45,.94) forwards}@keyframes scale-in{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
};


const AddGoalModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (data: Omit<Goal, 'id' | 'currentAmount'>) => void; }) => {
    const { t } = useSettings();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    
    if (!isOpen) return null;

    const handleAdd = () => {
        if (name && targetAmount) {
            onAdd({ name, targetAmount: parseFloat(targetAmount) });
            setName('');
            setTargetAmount('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm animate-scale-in">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('addNewGoal')}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="goal-name">{t('goalName')}</label>
                        <input id="goal-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('goalNamePlaceholder')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="goal-target">{t('targetAmount')}</label>
                        <input id="goal-target" type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button onClick={onClose} className="w-full py-3 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">{t('cancel')}</button>
                    <button onClick={handleAdd} className="w-full py-3 rounded-lg bg-evvo-green-dark text-white font-bold hover:bg-evvo-green-medium">{t('addGoal')}</button>
                </div>
            </div>
             <style>{`.animate-scale-in{animation:scale-in .3s cubic-bezier(.25,.46,.45,.94) forwards}@keyframes scale-in{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        </div>
    );
};

const AddDebtModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (data: Omit<Debt, 'id' | 'status' | 'dueDate'> & { dueDate?: Date }) => void; }) => {
    const { t } = useSettings();
    const [type, setType] = useState<'payable' | 'receivable'>('payable');
    const [person, setPerson] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');

    if (!isOpen) return null;

    const handleAdd = () => {
        if (person && amount) {
            onAdd({ type, person, amount: parseFloat(amount), dueDate: dueDate ? new Date(dueDate) : undefined });
            setType('payable');
            setPerson('');
            setAmount('');
            setDueDate('');
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm animate-scale-in">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('addNewDebt')}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">{t('type')}</label>
                        <select value={type} onChange={e => setType(e.target.value as 'payable' | 'receivable')} className="w-full px-3 py-2 border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark text-gray-900 dark:text-white">
                            <option value="payable">{t('payable')}</option>
                            <option value="receivable">{t('receivable')}</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="debt-person">{t('person')}</label>
                        <input id="debt-person" type="text" value={person} onChange={e => setPerson(e.target.value)} placeholder={t('personPlaceholder')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="debt-amount">{t('amount')}</label>
                        <input id="debt-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                     <div>
                        <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="debt-due">{t('dueDateOptional')}</label>
                        <input id="debt-due" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button onClick={onClose} className="w-full py-3 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">{t('cancel')}</button>
                    <button onClick={handleAdd} className="w-full py-3 rounded-lg bg-evvo-green-dark text-white font-bold hover:bg-evvo-green-medium">{t('addDebt')}</button>
                </div>
            </div>
             <style>{`.animate-scale-in{animation:scale-in .3s cubic-bezier(.25,.46,.45,.94) forwards}@keyframes scale-in{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        </div>
    );
};

const DebtItem = ({ debt, onToggleStatus, onDelete }: { debt: Debt, onToggleStatus: (id: string, status: 'unpaid' | 'paid') => void, onDelete: (id: string) => void }) => {
    const { formatCurrency, language, t } = useSettings();
    const isPayable = debt.type === 'payable';
    const isPaid = debt.status === 'paid';

    return (
        <div className={`flex items-center justify-between py-3 transition-opacity ${isPaid ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center ${isPayable ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                    {isPayable ? <ArrowUpIcon className="w-5 h-5" /> : <ArrowDownIcon className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                    <p className={`font-semibold text-gray-800 dark:text-gray-100 truncate ${isPaid ? 'line-through' : ''}`}>{debt.person}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{isPayable ? t('payable') : t('receivable')}</p>
                </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
                 <div className="text-right">
                    <p className={`font-bold ${isPayable ? 'text-red-500' : 'text-green-500'} ${isPaid ? 'line-through' : ''}`}>
                        {formatCurrency(debt.amount)}
                    </p>
                    {debt.dueDate && <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(debt.dueDate, language)}</p>}
                </div>
                <button 
                    onClick={() => onToggleStatus(debt.id, debt.status)} 
                    className={`p-2 rounded-full transition-colors ${isPaid ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-500/20' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    aria-label={isPaid ? t('markAsUnpaid') : t('markAsPaid')}
                >
                    <CheckIcon className="w-5 h-5"/>
                </button>
                <button 
                    onClick={() => onDelete(debt.id)} 
                    className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/20 transition-colors"
                    aria-label={t('deleteDebt')}
                >
                    <TrashIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};


// --- In-file Component: Bar Chart for expenses ---
const Bar = ({ value, maxValue, label, formatCurrency }: { value: number; maxValue: number; label: string; formatCurrency: (v: number) => string }) => {
    const barHeight = maxValue > 0 ? (value / maxValue) * 100 : 0;
    
    return (
        <div className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
            <div className="absolute -top-8 hidden group-hover:block bg-gray-700 dark:bg-gray-600 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
                {formatCurrency(value)}
            </div>
            <div 
                className="w-full bg-evvo-green-dark hover:bg-evvo-green-medium rounded-t-md transition-all"
                style={{ height: `${barHeight}%` }}
            ></div>
            <span className="text-xs text-center text-gray-500 dark:text-gray-400">{label}</span>
        </div>
    );
}

const BarChart = ({ data, formatCurrency }: { data: { label: string, value: number }[], formatCurrency: (v: number) => string}) => {
    const maxValue = Math.max(0, ...data.map(d => d.value));

    return (
        <div className="h-52 flex items-end justify-around gap-1 p-2 border-t border-gray-100 dark:border-gray-700">
            {data.map(item => (
                <Bar key={item.label} value={item.value} maxValue={maxValue} label={item.label} formatCurrency={formatCurrency} />
            ))}
        </div>
    );
}

const FinancialChart = ({ transactions }: { transactions: Transaction[] }) => {
    const { t, formatCurrency, language } = useSettings();
    const [view, setView] = useState<'monthly' | 'daily'>('monthly');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    const expenseTransactions = transactions.filter(tx => tx.type === 'expense');

    const chartData = useMemo(() => {
        if (view === 'monthly') {
            const monthlyExpenses: { [key: string]: number } = {};
            expenseTransactions.forEach(tx => {
                const monthKey = tx.date.toDate().toISOString().slice(0, 7); // YYYY-MM
                monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + tx.amount;
            });
            
            const sortedMonths = Object.keys(monthlyExpenses).sort().slice(-6);
            
            return sortedMonths.map(monthKey => {
                const date = new Date(monthKey + '-15T12:00:00Z');
                return {
                    label: date.toLocaleDateString(language, { month: 'short', timeZone: 'UTC' }),
                    value: monthlyExpenses[monthKey],
                };
            });
        } else { // daily view
            const dailyExpenses: { [key: number]: number } = {};
            expenseTransactions
                .filter(tx => tx.date.toDate().toISOString().slice(0, 7) === selectedMonth)
                .forEach(tx => {
                    const day = tx.date.toDate().getDate();
                    dailyExpenses[day] = (dailyExpenses[day] || 0) + tx.amount;
                });
            
            return Object.keys(dailyExpenses)
                .map(Number)
                .sort((a, b) => a - b)
                .map(day => ({
                    label: String(day),
                    value: dailyExpenses[day],
                }));
        }
    }, [expenseTransactions, view, selectedMonth, language]);

    const formattedSelectedMonth = useMemo(() => {
        if (!selectedMonth) return '';
        // Use a specific day and UTC to avoid timezone issues with month boundaries
        const date = new Date(selectedMonth + '-15T12:00:00Z'); 
        return date.toLocaleDateString(language, {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        });
    }, [selectedMonth, language]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">{t('expenseChart')}</h3>
            <div className="flex items-center gap-2 mb-4">
                <div className="flex-1">
                    <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-gray-100 dark:bg-gray-900">
                        <button onClick={() => setView('monthly')} className={`w-1/2 p-2 text-sm rounded-md font-semibold transition-colors ${view === 'monthly' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                            {t('monthly')}
                        </button>
                         <button onClick={() => setView('daily')} className={`w-1/2 p-2 text-sm rounded-md font-semibold transition-colors ${view === 'daily' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                            {t('daily')}
                        </button>
                    </div>
                </div>
                 {view === 'daily' && (
                    <div className="relative">
                         <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            aria-label={t('selectMonth')}
                        />
                        <div 
                            className="flex items-center justify-between gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm pointer-events-none w-44"
                            aria-hidden="true"
                        >
                            <span>{formattedSelectedMonth}</span>
                            <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                    </div>
                )}
            </div>

            {chartData.length > 0 ? (
                <BarChart data={chartData} formatCurrency={formatCurrency} />
            ) : (
                <div className="h-52 flex items-center justify-center text-center text-gray-500 dark:text-gray-400 p-2 border-t border-gray-100 dark:border-gray-700">
                    <p>{t('noChartData')}</p>
                </div>
            )}
        </div>
    );
};


const Profile = ({ onNavigateToSettings }: { onNavigateToSettings: () => void }) => {
  const { userProfile, updateUserProfile } = useAuth();
  const { wallets, goals, debts, addGoal, addDebt, transactions, toggleDebtStatus, deleteDebt } = useData();
  const { t, formatCurrency } = useSettings();
  const [isAddGoalModalOpen, setAddGoalModalOpen] = useState(false);
  const [isAddDebtModalOpen, setAddDebtModalOpen] = useState(false);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);


  if (!userProfile) {
    return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  }

  const handleAvatarSelect = async (url: string) => {
    setIsUpdatingAvatar(true);
    try {
        await updateUserProfile({ photoURL: url });
        setAvatarModalOpen(false);
    } catch (e) {
        console.error("Failed to update avatar", e);
    } finally {
        setIsUpdatingAvatar(false);
    }
  };

    const handleToggleDebtStatus = (debtId: string, currentStatus: 'unpaid' | 'paid') => {
        toggleDebtStatus(debtId, currentStatus);
    };

    const handleDeleteDebt = (debtId: string) => {
        if (window.confirm(t('confirmDeleteDebt'))) {
            deleteDebt(debtId);
        }
    };

    const sortedDebts = useMemo(() => {
        return [...debts].sort((a, b) => {
            if (a.status === b.status) return 0;
            return a.status === 'paid' ? 1 : -1; // Unpaid first
        });
    }, [debts]);

  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);
  const targetProgress = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const myDebts = debts.filter(d => d.type === 'payable').reduce((acc, d) => acc + d.amount, 0);
  const myReceivables = debts.filter(d => d.type === 'receivable').reduce((acc, d) => acc + d.amount, 0);

  const FinancialSummaryItem = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-bold text-sm text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  );

  return (
    <>
    <div className="p-6 pb-28">
      <header className="relative flex items-center justify-between mb-6">
        <div className="w-6"></div>
        <h1 className="font-bold text-xl text-gray-800 dark:text-gray-100">{t('profile')}</h1>
        <button onClick={onNavigateToSettings} className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
            <CogIcon className="h-6 w-6" />
        </button>
      </header>
      
      <div className="text-center mb-6">
        <button onClick={() => setAvatarModalOpen(true)} className="relative group mx-auto" disabled={isUpdatingAvatar}>
            <img
                src={userProfile.photoURL || `https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${userProfile.email}`}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-white dark:border-gray-700 shadow-lg"
            />
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
                <EditIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {isUpdatingAvatar && (
                 <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                 </div>
            )}
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-3">{userProfile.name}</h2>
        <p className="text-gray-500 dark:text-gray-400">{userProfile.email}</p>
        <button onClick={() => setEditProfileModalOpen(true)} className="mt-2 text-sm font-semibold text-evvo-green-dark dark:text-evvo-green-light hover:underline">
            {t('editProfile')}
        </button>
      </div>

      <section className="mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <BriefcaseIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{t('financialSummary')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <FinancialSummaryItem label={t('totalBalance')} value={formatCurrency(totalBalance)} />
                <FinancialSummaryItem label={t('targetProgress')} value={formatCurrency(targetProgress)} />
                <FinancialSummaryItem label={t('totalDebt')} value={formatCurrency(myDebts)} />
                <FinancialSummaryItem label={t('receivables')} value={formatCurrency(myReceivables)} />
            </div>
        </div>
      </section>

      <section className="mb-6">
          <FinancialChart transactions={transactions} />
      </section>

      <section className="mb-6">
         <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">{t('yourGoals')}</h3>
         <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
            {goals.map(goal => (
                 <div key={goal.id} className="flex-shrink-0 w-40 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="font-bold text-sm mb-1 text-gray-800 dark:text-gray-100">{goal.name}</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                        <div className="bg-evvo-green-dark h-1.5 rounded-full" style={{width: `${(goal.currentAmount / goal.targetAmount) * 100}%`}}></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</p>
                 </div>
            ))}
            <button onClick={() => setAddGoalModalOpen(true)} className="flex-shrink-0 w-28 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:border-evvo-green-dark hover:text-evvo-green-dark transition-colors">
                <PlusIcon className="w-6 h-6 mb-1"/>
                <span className="text-xs font-semibold">{t('addGoal')}</span>
            </button>
            <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
         </div>
      </section>
      
       <section className="mb-6">
         <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">{t('debtManagement')}</h3>
         <div className="flex gap-4">
            <div className="flex-1 bg-red-500 text-white p-3 rounded-2xl shadow-md">
                <div className="flex items-center gap-2 mb-1">
                    <ArrowUpIcon className="w-4 h-4"/>
                    <p className="text-sm font-semibold">{t('iOwe')}</p>
                </div>
                <p className="text-xl font-bold">{formatCurrency(myDebts)}</p>
            </div>
            <div className="flex-1 bg-evvo-green-dark text-white p-3 rounded-2xl shadow-md">
                <div className="flex items-center gap-2 mb-1">
                    <ArrowDownIcon className="w-4 h-4"/>
                    <p className="text-sm font-semibold">{t('owedToMe')}</p>
                </div>
                <p className="text-xl font-bold">{formatCurrency(myReceivables)}</p>
            </div>
             <button onClick={() => setAddDebtModalOpen(true)} className="flex-shrink-0 w-20 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:border-evvo-green-dark hover:text-evvo-green-dark transition-colors">
                <PlusIcon className="w-6 h-6"/>
                <span className="text-xs font-semibold mt-1">{t('addDebt')}</span>
            </button>
         </div>
      </section>

      <section>
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{t('debtDetails')}</h3>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 divide-y divide-gray-100 dark:divide-gray-700 shadow-sm">
            {sortedDebts.length > 0 ? (
                sortedDebts.map(d => <DebtItem key={d.id} debt={d} onToggleStatus={handleToggleDebtStatus} onDelete={handleDeleteDebt} />)
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('noDebtRecords')}</p>
            )}
        </div>
      </section>

    </div>
    <AddGoalModal isOpen={isAddGoalModalOpen} onClose={() => setAddGoalModalOpen(false)} onAdd={addGoal} />
    <AddDebtModal isOpen={isAddDebtModalOpen} onClose={() => setAddDebtModalOpen(false)} onAdd={addDebt} />
    <EditProfileModal isOpen={isEditProfileModalOpen} onClose={() => setEditProfileModalOpen(false)} t={t} />
    <AvatarSelectionModal isOpen={isAvatarModalOpen} onClose={() => setAvatarModalOpen(false)} onSelect={handleAvatarSelect} t={t} />
    </>
  );
};

export default Profile;
