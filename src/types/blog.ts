export type PostStatus = 'draft' | 'pending' | 'published' | 'rejected';
export type UserRole = 'user' | 'moderator' | 'admin';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  timestamp: Date;
  imageUrl?: string;
  likes: string[];
  comments: Comment[];
  tags: string[];
  category: 'strategy' | 'collection' | 'trading' | 'news';
  status: PostStatus;
  moderationComment?: string;
  lastModifiedAt: Date;
  publishedAt?: Date;
  isDraft: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  timestamp: Date;
  likes: string[];
  isReported: boolean;
  reportReason?: string;
  moderationStatus: 'approved' | 'pending' | 'rejected';
}

export interface BlogStats {
  views: number;
  readTime: number;
  shares: number;
  uniqueVisitors: number;
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  engagementMetrics: {
    averageTimeOnPage: number;
    bounceRate: number;
    commentRate: number;
  };
  demographicData?: {
    countries: Record<string, number>;
    languages: Record<string, number>;
  };
}

export interface RecommendationData {
  postId: string;
  score: number;
  matchingTags: string[];
  categoryMatch: boolean;
  authorMatch: boolean;
  recentlyViewed: boolean;
  userInteractions: {
    hasLiked: boolean;
    hasCommented: boolean;
    hasShared: boolean;
  };
}
