import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { BlogStats } from '../types/blog';

export const BlogAnalyticsService = {
  async trackPageView(
    postId: string,
    userId: string | null,
    deviceInfo: {
      type: 'desktop' | 'mobile' | 'tablet';
      country?: string;
      language?: string;
    }
  ): Promise<void> {
    const viewRef = collection(db, 'postViews');
    const timestamp = new Date();
    
    await addDoc(viewRef, {
      postId,
      userId,
      timestamp,
      sessionId: generateSessionId(),
      ...deviceInfo
    });

    // Update aggregate stats
    const statsRef = doc(db, 'postStats', postId);
    const statsSnapshot = await getDoc(statsRef);
    
    if (statsSnapshot.exists()) {
      const stats = statsSnapshot.data() as BlogStats;
      const updatedStats: Partial<BlogStats> = {
        views: stats.views + 1,
        uniqueVisitors: userId ? stats.uniqueVisitors : stats.uniqueVisitors + 1,
        deviceStats: {
          ...stats.deviceStats,
          [deviceInfo.type]: (stats.deviceStats[deviceInfo.type] || 0) + 1
        }
      };
      
      if (deviceInfo.country) {
        updatedStats.demographicData = {
          ...stats.demographicData,
          countries: {
            ...stats.demographicData?.countries,
            [deviceInfo.country]: (stats.demographicData?.countries[deviceInfo.country] || 0) + 1
          }
        };
      }
      
      await updateDoc(statsRef, updatedStats);
    }
  },

  async getPostStats(postId: string): Promise<BlogStats> {
    const statsRef = doc(db, 'postStats', postId);
    const statsSnapshot = await getDoc(statsRef);
    
    if (!statsSnapshot.exists()) {
      return {
        views: 0,
        readTime: 0,
        shares: 0,
        uniqueVisitors: 0,
        deviceStats: {
          desktop: 0,
          mobile: 0,
          tablet: 0
        },
        engagementMetrics: {
          averageTimeOnPage: 0,
          bounceRate: 0,
          commentRate: 0
        }
      };
    }
    
    return statsSnapshot.data() as BlogStats;
  },

  async updateEngagementMetrics(
    postId: string,
    metrics: {
      timeOnPage?: number;
      bounced?: boolean;
      commented?: boolean;
    }
  ): Promise<void> {
    const statsRef = doc(db, 'postStats', postId);
    const statsSnapshot = await getDoc(statsRef);
    
    if (statsSnapshot.exists()) {
      const stats = statsSnapshot.data() as BlogStats;
      const updatedMetrics = { ...stats.engagementMetrics };
      
      if (metrics.timeOnPage) {
        const totalTime = stats.engagementMetrics.averageTimeOnPage * stats.views;
        updatedMetrics.averageTimeOnPage = (totalTime + metrics.timeOnPage) / (stats.views + 1);
      }
      
      if (metrics.bounced !== undefined) {
        const totalBounces = stats.engagementMetrics.bounceRate * stats.views;
        updatedMetrics.bounceRate = (totalBounces + (metrics.bounced ? 1 : 0)) / (stats.views + 1);
      }
      
      if (metrics.commented !== undefined) {
        const totalComments = stats.engagementMetrics.commentRate * stats.views;
        updatedMetrics.commentRate = (totalComments + (metrics.commented ? 1 : 0)) / (stats.views + 1);
      }
      
      await updateDoc(statsRef, {
        engagementMetrics: updatedMetrics
      });
    }
  },

  async getPopularPosts(limit = 5): Promise<{ postId: string; stats: BlogStats }[]> {
    const statsQuery = query(
      collection(db, 'postStats'),
      orderBy('views', 'desc'),
      limit(limit)
    );
    
    const snapshot = await getDocs(statsQuery);
    return snapshot.docs.map(doc => ({
      postId: doc.id,
      stats: doc.data() as BlogStats
    }));
  }
};

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
