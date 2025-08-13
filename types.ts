import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: firebase.firestore.Timestamp;
  photoURL?: string;
  usernameUpdateCount?: number;
  lastUsernameUpdate?: firebase.firestore.Timestamp;
}

export interface Wallet {
  id: string;
  name:string;
  balance: number;
  icon: 'cash' | 'bank' | 'ewallet';
  order: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: firebase.firestore.Timestamp;
  walletId: string;
  walletName: string;
  description?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface Debt {
  id: string;
  type: 'payable' | 'receivable'; // payable: I owe, receivable: owed to me
  person: string;
  amount: number;
  dueDate?: firebase.firestore.Timestamp;
  status: 'unpaid' | 'paid';
}
