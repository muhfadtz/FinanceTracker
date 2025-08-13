import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { Wallet, Transaction, Goal, Debt } from '../types';

interface DataContextType {
    wallets: Wallet[];
    transactions: Transaction[];
    goals: Goal[];
    debts: Debt[];
    loading: boolean;
    addTransaction: (transactionData: Omit<Transaction, 'id' | 'walletName' | 'date'> & { date: Date, description?: string }) => Promise<void>;
    addWallet: (walletData: Omit<Wallet, 'id' | 'order'>) => Promise<void>;
    addGoal: (goalData: Omit<Goal, 'id' | 'currentAmount'>) => Promise<void>;
    addDebt: (debtData: Omit<Debt, 'id' | 'dueDate'> & { dueDate?: Date }) => Promise<void>;
    updateWallet: (walletData: Pick<Wallet, 'id' | 'name' | 'icon' | 'balance'>) => Promise<void>;
    deleteWallet: (walletId: string) => Promise<void>;
    updateWalletOrder: (reorderedWallets: Wallet[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            setWallets([]);
            setTransactions([]);
            setGoals([]);
            setDebts([]);
            return;
        }
        
        setLoading(true);

        const createSubscription = (collectionName: string, setter: React.Dispatch<React.SetStateAction<any[]>>, orderField?: string, orderDirection: 'asc' | 'desc' = 'desc') => {
            const userDocRef = db.collection('users').doc(user.uid);
            let collQuery: firebase.firestore.Query = userDocRef.collection(collectionName);
            if (orderField) {
                 collQuery = collQuery.orderBy(orderField, orderDirection);
            }
            
            const unsubscribe = collQuery.onSnapshot((querySnapshot) => {
                const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setter(items);
            }, (error) => {
                console.error(`Error fetching ${collectionName}: `, error);
            });
            return unsubscribe;
        };
        
        const unsubWallets = createSubscription('wallets', setWallets, 'order', 'asc');
        const unsubTransactions = createSubscription('transactions', setTransactions, 'date', 'desc');
        const unsubGoals = createSubscription('goals', setGoals, 'name');
        const unsubDebts = createSubscription('debts', setDebts);

        // Simple loading indicator
        setTimeout(() => setLoading(false), 500);

        return () => {
            unsubWallets();
            unsubTransactions();
            unsubGoals();
            unsubDebts();
        };
    }, [user]);

    const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'walletName' | 'date'> & { date: Date }) => {
        if (!user) throw new Error("User not authenticated");
        
        const { walletId, amount, type, date, ...rest } = transactionData;
        
        await db.runTransaction(async (transaction) => {
            const walletRef = db.collection('users').doc(user.uid).collection('wallets').doc(walletId);
            const walletDoc = await transaction.get(walletRef);
            if (!walletDoc.exists) throw new Error("Wallet does not exist!");

            const walletData = walletDoc.data()!;
            const oldBalance = walletData.balance;
            const newBalance = type === 'income' ? oldBalance + amount : oldBalance - amount;
            
            if (newBalance < 0) throw new Error("Insufficient funds for this transaction.");

            transaction.update(walletRef, { balance: newBalance });
            
            const newTransactionData = {
                ...rest,
                type,
                amount,
                walletId,
                walletName: walletData.name,
                date: firebase.firestore.Timestamp.fromDate(date),
            };
            const newTransactionRef = db.collection('users').doc(user.uid).collection('transactions').doc();
            transaction.set(newTransactionRef, newTransactionData);
        });
    };

    const addWallet = async (walletData: Omit<Wallet, 'id' | 'order'>) => {
        if (!user) throw new Error("User not authenticated");
        const order = wallets.length;
        await db.collection('users').doc(user.uid).collection('wallets').add({ ...walletData, order });
    };

    const addGoal = async (goalData: Omit<Goal, 'id' | 'currentAmount'>) => {
        if (!user) throw new Error("User not authenticated");
        await db.collection('users').doc(user.uid).collection('goals').add({ ...goalData, currentAmount: 0 });
    };

    const addDebt = async (debtData: Omit<Debt, 'id' | 'dueDate'> & {dueDate?: Date}) => {
        if (!user) throw new Error("User not authenticated");
        const dataToAdd: any = { ...debtData };
        if (debtData.dueDate) {
            dataToAdd.dueDate = firebase.firestore.Timestamp.fromDate(debtData.dueDate);
        }
        await db.collection('users').doc(user.uid).collection('debts').add(dataToAdd);
    };

    const updateWallet = async (walletData: Pick<Wallet, 'id' | 'name' | 'icon' | 'balance'>) => {
        if (!user) throw new Error("User not authenticated");
        const walletRef = db.collection('users').doc(user.uid).collection('wallets').doc(walletData.id);
        await walletRef.update({ 
            name: walletData.name, 
            icon: walletData.icon, 
            balance: walletData.balance 
        });
    };
    
    const updateWalletOrder = async (reorderedWallets: Wallet[]) => {
        if (!user) throw new Error("User not authenticated");

        const batch = db.batch();
        const walletsRef = db.collection('users').doc(user.uid).collection('wallets');

        reorderedWallets.forEach((wallet, index) => {
            const docRef = walletsRef.doc(wallet.id);
            batch.update(docRef, { order: index });
        });

        await batch.commit();
    };

    const deleteWallet = async (walletId: string) => {
        if (!user) throw new Error("User not authenticated");
        
        const batch = db.batch();
        
        const walletRef = db.collection('users').doc(user.uid).collection('wallets').doc(walletId);
        batch.delete(walletRef);

        const transactionsColRef = db.collection('users').doc(user.uid).collection('transactions');
        const q = transactionsColRef.where('walletId', '==', walletId);
        const transactionsSnapshot = await q.get();
        transactionsSnapshot.forEach(doc => batch.delete(doc.ref));

        await batch.commit();
    };

    const value = { wallets, transactions, goals, debts, loading, addTransaction, addWallet, addGoal, addDebt, updateWallet, deleteWallet, updateWalletOrder };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};