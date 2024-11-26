import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User, signOut as firebaseSignOut, 
  signInWithPopup, GoogleAuthProvider, updateProfile as firebaseUpdateProfile } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    const auth = getAuth();
    await firebaseSignOut(auth);
  };

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const updateProfile = async (displayName: string, photoURL?: string) => {
    if (!user) return;
    await firebaseUpdateProfile(user, { displayName, photoURL });
  };

  return { 
    user, 
    loading,
    signOut,
    signInWithGoogle,
    updateProfile
  };
}
