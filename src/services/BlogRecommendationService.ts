import { db } from '../firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { BlogPost, RecommendationData } from '../types/blog';

export const BlogRecommendationService = {
  async getRecommendations(
    userId: string,
    currentPostId?: string,
    limit = 5
  ): Promise<BlogPost[]> {
    // Get user's reading history and preferences
    const userHistoryQuery = query(
      collection(db, 'userReadingHistory'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    
    const historySnapshot = await getDocs(userHistoryQuery);
    const readPosts = new Set(historySnapshot.docs.map(doc => doc.data().postId));
    
    // Get user's liked posts
    const userLikesQuery = query(
      collection(db, 'posts'),
      where('likes', 'array-contains', userId)
    );
    
    const likesSnapshot = await getDocs(userLikesQuery);
    const likedPosts = new Map(
      likesSnapshot.docs.map(doc => [doc.id, doc.data() as BlogPost])
    );
    
    // Get all published posts
    const postsQuery = query(
      collection(db, 'posts'),
      where('status', '==', 'published')
    );
    
    const postsSnapshot = await getDocs(postsQuery);
    const allPosts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[];
    
    // Calculate recommendations
    const recommendations: RecommendationData[] = allPosts
      .filter(post => post.id !== currentPostId && !readPosts.has(post.id))
      .map(post => {
        const likedPost = likedPosts.get(post.id);
        const score = calculateRecommendationScore(post, likedPost, userId);
        
        return {
          postId: post.id,
          score,
          matchingTags: [], // To be calculated
          categoryMatch: false, // To be calculated
          authorMatch: false, // To be calculated
          recentlyViewed: false,
          userInteractions: {
            hasLiked: !!likedPost,
            hasCommented: post.comments.some(comment => comment.authorId === userId),
            hasShared: false // To be implemented with share tracking
          }
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    // Get the actual posts for the recommendations
    return allPosts.filter(post => 
      recommendations.some(rec => rec.postId === post.id)
    );
  },

  async trackPostView(
    userId: string,
    postId: string,
    deviceType: 'desktop' | 'mobile' | 'tablet'
  ): Promise<void> {
    const historyRef = collection(db, 'userReadingHistory');
    await addDoc(historyRef, {
      userId,
      postId,
      timestamp: new Date(),
      deviceType,
      sessionId: generateSessionId(),
    });
  }
};

function calculateRecommendationScore(
  post: BlogPost,
  likedPost: BlogPost | undefined,
  userId: string
): number {
  let score = 0;
  
  // Recency bonus
  const daysSincePublished = (Date.now() - post.publishedAt!.getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(0, 10 - daysSincePublished); // Bonus for newer posts
  
  // Engagement score
  score += post.likes.length * 0.5;
  score += post.comments.length * 0.3;
  
  // Content length bonus
  const contentLength = post.content.length;
  score += Math.min(5, contentLength / 1000); // Up to 5 points for longer content
  
  // User interaction bonus
  if (likedPost) {
    score += 5; // Bonus if user liked similar posts
  }
  
  if (post.comments.some(comment => comment.authorId === userId)) {
    score += 3; // Bonus if user commented on similar posts
  }
  
  return score;
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
