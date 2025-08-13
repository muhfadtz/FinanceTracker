import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { auth, db, googleProvider } from '../services/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
    user: firebase.User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    signup: (email: string, pass: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    updateUserProfile: (data: Partial<Pick<UserProfile, 'name' | 'photoURL'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<firebase.User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    
    const createUserProfile = async (firebaseUser: firebase.User, name?: string) => {
        const userRef = db.collection('users').doc(firebaseUser.uid);
        const docSnap = await userRef.get();
        if (docSnap.exists) {
            return docSnap.data() as UserProfile;
        }

        const newUserProfileData: UserProfile = {
            uid: firebaseUser.uid,
            name: name || firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp() as any,
            photoURL: firebaseUser.photoURL || `https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${firebaseUser.email || firebaseUser.uid}`,
            usernameUpdateCount: 0,
            lastUsernameUpdate: firebase.firestore.Timestamp.fromMillis(0),
        };
        await userRef.set(newUserProfileData);
        return newUserProfileData;
    }


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const profile = await createUserProfile(firebaseUser);
                    setUserProfile(profile);
                    setUser(firebaseUser);
                } catch (error) {
                    console.error("Error fetching/creating user profile:", error);
                    await auth.signOut();
                    setUser(null);
                    setUserProfile(null);
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, pass: string) => {
        await auth.signInWithEmailAndPassword(email, pass);
    };

    const signup = async (email: string, pass: string, name: string) => {
        const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
        const firebaseUser = userCredential.user;

        if (!firebaseUser) throw new Error("User creation failed.");
        
        await createUserProfile(firebaseUser, name);
    };

    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleProvider);
        // onAuthStateChanged will handle the rest
    };

    const logout = async () => {
        await auth.signOut();
    };

    const updateUserProfile = async (data: Partial<Pick<UserProfile, 'name' | 'photoURL'>>) => {
        if (!user || !userProfile) throw new Error("User not authenticated.");

        const userRef = db.collection('users').doc(user.uid);
        const updatePayload: any = {};

        if (data.name && data.name !== userProfile.name) {
            const now = new Date();
            const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
            
            let currentCount = userProfile.usernameUpdateCount || 0;
            const lastUpdate = userProfile.lastUsernameUpdate?.toDate();

            if (lastUpdate && now.getTime() - lastUpdate.getTime() > oneWeekInMs) {
                currentCount = 0; // Reset count if a week has passed
            }
            
            if (currentCount >= 3) {
                throw new Error("You can only change your username 3 times per week.");
            }

            updatePayload.name = data.name;
            updatePayload.usernameUpdateCount = currentCount + 1;
            updatePayload.lastUsernameUpdate = firebase.firestore.FieldValue.serverTimestamp();
        }

        if (data.photoURL) {
            updatePayload.photoURL = data.photoURL;
        }
        
        if (Object.keys(updatePayload).length > 0) {
            await userRef.update(updatePayload);
            // Optimistically update local state. The server timestamp will be an estimate locally.
            setUserProfile(prev => ({ ...prev!, ...data, usernameUpdateCount: updatePayload.usernameUpdateCount ?? prev?.usernameUpdateCount }));
        }
    };

    const value: AuthContextType = { 
        user, 
        userProfile, 
        loading, 
        login, 
        signup, 
        logout, 
        signInWithGoogle,
        updateUserProfile 
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};