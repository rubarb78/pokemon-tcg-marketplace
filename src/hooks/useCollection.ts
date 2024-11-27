import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export const useCollection = () => {
  const { user } = useAuth();
  const [userCollection, setUserCollection] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserCollection([]);
      setLoading(false);
      return;
    }

    const fetchCollection = async () => {
      try {
        const q = query(collection(db, 'collections'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const cards = querySnapshot.docs.map(doc => doc.data().cardId);
        setUserCollection(cards);
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [user]);

  const addToCollection = async (cardId: string) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'collections'), {
        userId: user.uid,
        cardId,
        addedAt: new Date().toISOString(),
      });
      setUserCollection(prev => [...prev, cardId]);
    } catch (error) {
      console.error('Error adding to collection:', error);
      throw error;
    }
  };

  const removeFromCollection = async (cardId: string) => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'collections'),
        where('userId', '==', user.uid),
        where('cardId', '==', cardId)
      );
      const querySnapshot = await getDocs(q);
      const docToDelete = querySnapshot.docs[0];
      
      if (docToDelete) {
        await deleteDoc(doc(db, 'collections', docToDelete.id));
        setUserCollection(prev => prev.filter(id => id !== cardId));
      }
    } catch (error) {
      console.error('Error removing from collection:', error);
      throw error;
    }
  };

  const isInCollection = (cardId: string) => {
    return userCollection.includes(cardId);
  };

  return {
    userCollection,
    loading,
    addToCollection,
    removeFromCollection,
    isInCollection,
  };
};
