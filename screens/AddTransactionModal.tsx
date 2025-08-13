import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal = ({ isOpen, onClose }: AddTransactionModalProps) => {
  const { wallets, addTransaction } = useData();
  const { t } = useSettings();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [walletId, setWalletId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (wallets.length > 0 && !walletId) {
      setWalletId(wallets[0].id);
    }
  }, [wallets, walletId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !walletId) {
      setError(t('errorRequired'));
      return;
    }
    
    const transactionAmount = parseFloat(amount);
    const selectedWallet = wallets.find(w => w.id === walletId);

    if (type === 'expense' && selectedWallet && selectedWallet.balance < transactionAmount) {
        setError(t('errorInsufficientFunds'));
        return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      await addTransaction({
        type,
        amount: transactionAmount,
        category,
        walletId,
        description,
        date: new Date(date),
      });

      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      onClose();

    } catch (err) {
      console.error(err);
      setError(t('errorAddTransaction'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end sm:items-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md animate-slide-up sm:animate-scale-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('addTransaction')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-gray-100 dark:bg-gray-900">
              <button type="button" onClick={() => setType('expense')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${type === 'expense' ? 'bg-red-100 text-red-600 shadow-sm dark:bg-red-500/20' : 'text-gray-500 dark:text-gray-400'}`}>
                {t('expense')}
              </button>
              <button type="button" onClick={() => setType('income')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${type === 'income' ? 'bg-green-100 text-green-600 shadow-sm dark:bg-green-500/20' : 'text-gray-500 dark:text-gray-400'}`}>
                {t('income')}
              </button>
            </div>
          </div>
            
          <div className="grid grid-cols-2 gap-4 mb-4">
             <div>
                <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="amount">{t('amountLabel')}</label>
                <input
                  id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required
                />
              </div>
               <div>
                <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="date">{t('date')}</label>
                <input
                  id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required
                />
              </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="category">{t('category')}</label>
            <input
              id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)}
              placeholder={t('categoryPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="wallet">{t('wallet')}</label>
            <select
                id="wallet" value={walletId} onChange={(e) => setWalletId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
                {wallets.length > 0 ? wallets.map(wallet => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>) : <option disabled>{t('noWallet')}</option>}
            </select>
          </div>
          <div className="mb-6">
             <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="description">{t('descriptionOptional')}</label>
             <textarea
                id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder={t('addNote')} rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            ></textarea>
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="w-full py-3 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">
              {t('cancel')}
            </button>
            <button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg bg-evvo-green-dark text-white font-bold hover:bg-evvo-green-medium transition-colors flex justify-center items-center disabled:opacity-50">
              {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : t('addTransaction')}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        @media (min-width: 640px) {
            .sm\\:animate-scale-in {
                 animation: scale-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
        }
      `}</style>
    </div>
  );
};

export default AddTransactionModal;
