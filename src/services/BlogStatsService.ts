import { db } from '../firebase';
import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';

export interface BlogStats {
  views: number;
  readTime: number;
  shares: number;
}

export const BlogStatsService = {
  async incrementViews(postId: string): Promise<void> {
    const statsRef = doc(db, 'blogStats', postId);
    const statsDoc = await getDoc(statsRef);

    if (!statsDoc.exists()) {
      // Initialize stats if they don't exist
      await setDoc(statsRef, {
        views: 1,
        readTime: 0,
        shares: 0,
      });
    } else {
      await updateDoc(statsRef, {
        views: increment(1),
      });
    }
  },

  async incrementShares(postId: string): Promise<void> {
    const statsRef = doc(db, 'blogStats', postId);
    await updateDoc(statsRef, {
      shares: increment(1),
    });
  },

  async updateReadTime(postId: string, timeInSeconds: number): Promise<void> {
    const statsRef = doc(db, 'blogStats', postId);
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      const currentStats = statsDoc.data() as BlogStats;
      const newAvgTime = Math.round(
        (currentStats.readTime * currentStats.views + timeInSeconds) / (currentStats.views + 1)
      );
      await updateDoc(statsRef, {
        readTime: newAvgTime,
      });
    }
  },

  async getStats(postId: string): Promise<BlogStats | null> {
    const statsRef = doc(db, 'blogStats', postId);
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      return statsDoc.data() as BlogStats;
    }
    return null;
  },
};
