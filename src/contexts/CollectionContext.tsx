import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { PokemonCard } from '../services/PokemonTCGService';

interface CollectionContextType {
  collection: PokemonCard[];
  addToCollection: (card: PokemonCard) => Promise<void>;
  removeFromCollection: (cardId: string) => Promise<void>;
  isInCollection: (cardId: string) => boolean;
  loading: boolean;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
};

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collection, setCollection] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadCollection = async () => {
      if (!user) {
        setCollection([]);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCollection(userData.collection || []);
        } else {
          await setDoc(userDocRef, { collection: [] });
          setCollection([]);
        }
      } catch (error) {
        console.error('Error loading collection:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [user]);

  const addToCollection = async (card: PokemonCard) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedCollection = [...collection, card];
      await updateDoc(userDocRef, { collection: updatedCollection });
      setCollection(updatedCollection);
    } catch (error) {
      console.error('Error adding card to collection:', error);
      throw error;
    }
  };

  const removeFromCollection = async (cardId: string) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedCollection = collection.filter(card => card.id !== cardId);
      await updateDoc(userDocRef, { collection: updatedCollection });
      setCollection(updatedCollection);
    } catch (error) {
      console.error('Error removing card from collection:', error);
      throw error;
    }
  };

  const isInCollection = (cardId: string) => {
    return collection.some(card => card.id === cardId);
  };

  const value = {
    collection,
    addToCollection,
    removeFromCollection,
    isInCollection,
    loading,
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
};
