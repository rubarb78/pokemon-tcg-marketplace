import { db } from '../firebase';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { BlogPost, Comment, PostStatus } from '../types/blog';

export const BlogModerationService = {
  async moderatePost(
    postId: string,
    decision: 'approve' | 'reject',
    moderationComment?: string
  ): Promise<void> {
    const postRef = doc(db, 'posts', postId);
    const status: PostStatus = decision === 'approve' ? 'published' : 'rejected';

    await updateDoc(postRef, {
      status,
      moderationComment,
      ...(status === 'published' && { publishedAt: new Date() })
    });
  },

  async reportComment(
    postId: string,
    commentId: string,
    reason: string
  ): Promise<void> {
    const postRef = doc(db, 'posts', postId);
    const post = await getDoc(postRef);
    
    if (post.exists()) {
      const postData = post.data() as BlogPost;
      const updatedComments = postData.comments.map(comment => 
        comment.id === commentId
          ? { ...comment, isReported: true, reportReason: reason, moderationStatus: 'pending' }
          : comment
      );

      await updateDoc(postRef, { comments: updatedComments });
    }
  },

  async moderateComment(
    postId: string,
    commentId: string,
    decision: 'approve' | 'reject'
  ): Promise<void> {
    const postRef = doc(db, 'posts', postId);
    const post = await getDoc(postRef);
    
    if (post.exists()) {
      const postData = post.data() as BlogPost;
      const updatedComments = postData.comments.map(comment => 
        comment.id === commentId
          ? { ...comment, moderationStatus: decision }
          : comment
      );

      await updateDoc(postRef, { comments: updatedComments });
    }
  },

  async getPendingPosts(): Promise<BlogPost[]> {
    const postsQuery = query(
      collection(db, 'posts'),
      where('status', '==', 'pending')
    );
    
    const snapshot = await getDocs(postsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[];
  },

  async getReportedComments(): Promise<{ post: BlogPost; comment: Comment }[]> {
    const postsQuery = query(
      collection(db, 'posts'),
      where('comments', 'array-contains', { isReported: true })
    );
    
    const snapshot = await getDocs(postsQuery);
    const reportedComments: { post: BlogPost; comment: Comment }[] = [];
    
    snapshot.docs.forEach(doc => {
      const post = { id: doc.id, ...doc.data() } as BlogPost;
      post.comments
        .filter(comment => comment.isReported)
        .forEach(comment => {
          reportedComments.push({ post, comment });
        });
    });
    
    return reportedComments;
  },

  async saveDraft(post: Partial<BlogPost>): Promise<string> {
    const postsRef = collection(db, 'posts');
    const newPost = {
      ...post,
      status: 'draft' as PostStatus,
      isDraft: true,
      timestamp: new Date(),
      lastModifiedAt: new Date(),
      likes: [],
      comments: []
    };
    
    const docRef = await addDoc(postsRef, newPost);
    return docRef.id;
  },

  async publishDraft(postId: string): Promise<void> {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      status: 'pending' as PostStatus,
      isDraft: false,
      lastModifiedAt: new Date()
    });
  },

  async getDrafts(userId: string): Promise<BlogPost[]> {
    const draftsQuery = query(
      collection(db, 'posts'),
      where('authorId', '==', userId),
      where('isDraft', '==', true)
    );
    
    const snapshot = await getDocs(draftsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[];
  }
};
