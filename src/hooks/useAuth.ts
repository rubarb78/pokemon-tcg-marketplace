import { useEffect, useState } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User, 
  signOut as firebaseSignOut,
  signInWithPopup, 
  GoogleAuthProvider, 
  updateProfile as firebaseUpdateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

interface AuthError {
  code: string;
  message: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  const handleAuthError = (error: any): string => {
    const errorCode = error.code || '';
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Cette adresse email est déjà utilisée.';
      case 'auth/invalid-email':
        return 'Adresse email invalide.';
      case 'auth/operation-not-allowed':
        return 'Opération non autorisée.';
      case 'auth/weak-password':
        return 'Le mot de passe est trop faible.';
      case 'auth/user-disabled':
        return 'Ce compte a été désactivé.';
      case 'auth/user-not-found':
        return 'Aucun compte ne correspond à cette adresse email.';
      case 'auth/wrong-password':
        return 'Mot de passe incorrect.';
      default:
        return 'Une erreur est survenue. Veuillez réessayer.';
    }
  };

  const signUp = async (email: string, password: string) => {
    const auth = getAuth();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signIn = async (email: string, password: string) => {
    const auth = getAuth();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    const auth = getAuth();
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    const auth = getAuth();
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProfile = async (displayName?: string, photoURL?: string) => {
    if (!user) return;
    
    try {
      await firebaseUpdateProfile(user, {
        displayName: displayName || user.displayName,
        photoURL: photoURL || user.photoURL
      });
      // Force refresh the user object
      setUser({ ...user });
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile
  };
}
