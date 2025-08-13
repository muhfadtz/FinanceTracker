import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useSettings } from '../../context/SettingsContext';
import { Wallet as WalletType } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, BankIcon, CashIcon, WalletIcon as EWalletIcon } from '../../components/Icons';

const WalletIconComponent = ({ icon, className }: { icon: WalletType['icon'], className?: string}) => {
    switch(icon) {
        case 'bank': return <BankIcon className={className} />;
        case 'cash': return <CashIcon className={className} />;
        case 'ewallet': return <EWalletIcon className={className} />;
        default: return <EWalletIcon className={className} />;
    }
}

const EditWalletModal = ({ wallet, isOpen, onClose, onSave }: { wallet: WalletType; isOpen: boolean; onClose: () => void; onSave: (data: Pick<WalletType, 'id' | 'name' | 'icon' | 'balance'>) => void; }) => {
    const { t } = useSettings();
    const [name, setName] = useState(wallet.name);
    const [icon, setIcon] = useState<WalletType['icon']>(wallet.icon);
    const [balance, setBalance] = useState(String(wallet.balance));

    useEffect(() => {
        setName(wallet.name);
        setIcon(wallet.icon);
        setBalance(String(wallet.balance));
    }, [wallet]);

    if (!isOpen) return null;

    const handleSave = () => {
        if(name && balance !== '') {
            onSave({ id: wallet.id, name, icon, balance: parseFloat(balance) });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm animate-scale-in">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('editWallet')}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="wallet-name">{t('walletName')}</label>
                        <input id="wallet-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                     <div>
                        <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="wallet-balance">{t('balance')}</label>
                        <input id="wallet-balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1" htmlFor="wallet-icon">{t('icon')}</label>
                         <select id="wallet-icon" value={icon} onChange={(e) => setIcon(e.target.value as WalletType['icon'])}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-evvo-green-dark bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="cash">{t('cash')}</option>
                            <option value="bank">{t('bankAccount')}</option>
                            <option value="ewallet">{t('eWallet')}</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button onClick={onClose} className="w-full py-3 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">{t('cancel')}</button>
                    <button onClick={handleSave} className="w-full py-3 rounded-lg bg-evvo-green-dark text-white font-bold hover:bg-evvo-green-medium transition-colors">{t('save')}</button>
                </div>
            </div>
             <style>{`.animate-scale-in{animation:scale-in .3s cubic-bezier(.25,.46,.45,.94) forwards}@keyframes scale-in{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        </div>
    );
};

const WalletItem = ({ wallet, onEdit, onDelete, isDeleting, isDragging }: { wallet: WalletType; onEdit: () => void; onDelete: () => void; isDeleting?: boolean; isDragging: boolean; }) => {
    const { formatCurrency } = useSettings();
    return (
        <div className={`p-4 rounded-xl flex items-center justify-between shadow-md text-white transition-all duration-300 cursor-grab ${wallet.icon === 'bank' ? 'bg-evvo-green-dark' : 'bg-evvo-green-medium'} ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center p-2">
                    <WalletIconComponent icon={wallet.icon} className="w-7 h-7" />
                </div>
                <div>
                    <p className="font-semibold text-lg">{wallet.name}</p>
                     <p className="font-bold text-xl">{formatCurrency(wallet.balance)}</p>
                </div>
            </div>
            <div className="flex gap-2">
                 <button onClick={onEdit} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                    <EditIcon className="w-5 h-5"/>
                 </button>
                 <button onClick={onDelete} disabled={isDeleting} className="p-2 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50">
                    {isDeleting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                        <TrashIcon className="w-5 h-5 text-red-300"/>
                    )}
                 </button>
            </div>
        </div>
    );
};


const AddWalletForm = ({ onAdd, onCancel }: { onAdd: (name: string, icon: WalletType['icon'], balance: number) => void; onCancel: () => void; }) => {
    const { t } = useSettings();
    const [name, setName] = useState('');
    const [icon, setIcon] = useState<WalletType['icon']>('cash');
    const [balance, setBalance] = useState('');
    
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg mt-4 animate-fade-in">
            <h3 className="font-bold mb-3 text-gray-700 dark:text-gray-200">{t('addNewWallet')}</h3>
            <div className="space-y-3">
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('walletNamePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-evvo-green-dark focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                />
                <input 
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder={t('initialBalance')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-evvo-green-dark focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <select 
                    value={icon}
                    onChange={(e) => setIcon(e.target.value as 'cash' | 'bank' | 'ewallet')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-evvo-green-dark focus:outline-none text-gray-900 dark:text-white"
                >
                    <option value="cash">{t('cash')}</option>
                    <option value="bank">{t('bankAccount')}</option>
                    <option value="ewallet">{t('eWallet')}</option>
                </select>
            </div>
            <div className="flex gap-2 mt-4">
                <button onClick={onCancel} className="w-full py-2 bg-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">{t('cancel')}</button>
                <button 
                    onClick={() => name && onAdd(name, icon, parseFloat(balance) || 0)} 
                    disabled={!name}
                    className="w-full py-2 bg-evvo-green-dark text-white rounded-lg font-semibold hover:bg-evvo-green-medium transition-colors disabled:opacity-50"
                >{t('addWallet')}</button>
            </div>
             <style>{`
                .animate-fade-in {
                  animation: fade-in 0.5s ease-in-out;
                }
                @keyframes fade-in {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

const WalletScreen = () => {
    const { wallets, addWallet, updateWallet, deleteWallet, updateWalletOrder } = useData();
    const { t } = useSettings();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingWallet, setEditingWallet] = useState<WalletType | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [error, setError] = useState('');

    const [dndWallets, setDndWallets] = useState<WalletType[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (draggedIndex === null) {
            setDndWallets(wallets);
        }
    }, [wallets, draggedIndex]);

    const handleAddWallet = (name: string, icon: WalletType['icon'], balance: number) => {
        if (!name) return;
        addWallet({ name, icon, balance });
        setShowAddForm(false);
    };
    
    const handleUpdateWallet = (data: Pick<WalletType, 'id' | 'name' | 'icon' | 'balance'>) => {
        updateWallet(data);
    };

    const handleDeleteWallet = async (walletId: string) => {
        setError('');
        if (window.confirm(t('confirmDeleteWallet'))) {
            setIsDeleting(walletId);
            try {
                await deleteWallet(walletId);
            } catch (err) {
                console.error("Failed to delete wallet:", err);
                setError(t('errorDeleteWallet'));
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragEnter = (targetIndex: number) => {
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        const reorderedWallets = [...dndWallets];
        const [movedWallet] = reorderedWallets.splice(draggedIndex, 1);
        reorderedWallets.splice(targetIndex, 0, movedWallet);

        setDraggedIndex(targetIndex);
        setDndWallets(reorderedWallets);
    };

    const handleDragEnd = () => {
        if (draggedIndex !== null) {
            const originalOrder = wallets.map(w => w.id);
            const newOrder = dndWallets.map(w => w.id);
            if (JSON.stringify(originalOrder) !== JSON.stringify(newOrder)) {
                updateWalletOrder(dndWallets);
            }
        }
        setDraggedIndex(null);
    };


    return (
        <div className="p-6 pb-28">
            <header className="mb-6 flex items-center justify-between">
                <h1 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{t('walletManagement')}</h1>
            </header>

            {error && <p className="text-red-500 text-sm mb-4 text-center p-3 bg-red-100 rounded-lg">{error}</p>}

            <div className="space-y-4">
                {dndWallets.map((wallet, index) => (
                    <div
                        key={wallet.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnd={handleDragEnd}
                    >
                        <WalletItem 
                            wallet={wallet} 
                            onEdit={() => setEditingWallet(wallet)}
                            onDelete={() => handleDeleteWallet(wallet.id)}
                            isDeleting={isDeleting === wallet.id}
                            isDragging={draggedIndex === index}
                        />
                    </div>
                ))}
            </div>

            {showAddForm ? (
                <AddWalletForm onAdd={handleAddWallet} onCancel={() => setShowAddForm(false)} />
            ) : (
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 font-semibold p-4 mt-4 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-evvo-green-dark hover:text-evvo-green-dark transition-all duration-300"
                >
                    <PlusIcon className="w-5 h-5" />
                    {t('addWallet')}
                </button>
            )}

            {editingWallet && (
                <EditWalletModal 
                    wallet={editingWallet}
                    isOpen={!!editingWallet}
                    onClose={() => setEditingWallet(null)}
                    onSave={handleUpdateWallet}
                />
            )}
        </div>
    );
};

export default WalletScreen;