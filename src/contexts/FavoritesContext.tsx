import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { PokemonCard } from '../services/PokemonTCGService';

interface FavoritesContextType {
  favorites: PokemonCard[];
  addToFavorites: (card: PokemonCard) => Promise<void>;
  removeFromFavorites: (cardId: string) => Promise<void>;
  isInFavorites: (cardId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFavorites(userData.favorites || []);
        } else {
          await setDoc(userDocRef, { favorites: [] });
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const addToFavorites = async (card: PokemonCard) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedFavorites = [...favorites, card];
      await updateDoc(userDocRef, { favorites: updatedFavorites });
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error adding card to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (cardId: string) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedFavorites = favorites.filter(card => card.id !== cardId);
      await updateDoc(userDocRef, { favorites: updatedFavorites });
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing card from favorites:', error);
      throw error;
    }
  };

  const isInFavorites = (cardId: string) => {
    return favorites.some(card => card.id === cardId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
