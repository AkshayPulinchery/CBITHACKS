'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import type {User as FirebaseUser} from 'firebase/auth';
import {auth, db} from '@/lib/firebase/config';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import type {AppUser} from '@/lib/types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, displayName: string) => Promise<any>;
  signOut: () => Promise<void>;
  setUserRole: (role: 'recruiter' | 'job-seeker') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({uid: firebaseUser.uid, ...userDoc.data()} as AppUser);
        } else {
          // New user, role not set yet
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: null,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const signIn = async (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName });
    
    // Create user document in Firestore
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userData = {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        role: null
    };
    await setDoc(userDocRef, userData);

    // The onAuthStateChanged listener will automatically pick up the new user
    // and fetch the document we just created.
    return userCredential;
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out', error);
    }
  };
  
  const setUserRole = async (role: 'recruiter' | 'job-seeker') => {
    if (!user || !user.uid) return;
    const userDocRef = doc(db, 'users', user.uid);
    const userData: Omit<AppUser, 'uid' | 'role'> & { role: 'recruiter' | 'job-seeker' } = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role,
    };
    await setDoc(userDocRef, userData, {merge: true});
    setUser({...user, role});
  };

  const value = {user, loading, signIn, signUp, signOut, setUserRole};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
