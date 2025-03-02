import pb from './pocketbase';
import { getCurrentUser } from './auth';

// Comments
export interface Comment {
  id: string;
  content: string;
  user: string;
  project: string;
  created: string;
  updated: string;
}

export interface CommentWithUser extends Comment {
  authorName: string;
  authorAvatar?: string;
}

export async function getProjectComments(projectId: string): Promise<CommentWithUser[]> {
  try {
    const records = await pb.collection('comments').getList(1, 50, {
      filter: `project="${projectId}"`,
      sort: 'created',
      expand: 'user',
      requestKey: `project-comments-${projectId}`
    });
    
    return records.items.map(comment => {
      const userData = comment.expand?.user;
      return {
        ...comment,
        authorName: userData && typeof userData === 'object' ? userData.username : 'Unknown User',
        authorAvatar: userData && typeof userData === 'object' && userData.avatar ? pb.getFileUrl(userData, userData.avatar) : undefined
      };
    });
  } catch (error) {
    console.error('Error fetching project comments:', error);
    return [];
  }
}

export async function createComment({ projectId, content }: { projectId: string, content: string }): Promise<CommentWithUser | null> {
  try {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const newComment = await pb.collection('comments').create({
      content: content,
      user: currentUser.id,
      project: projectId
    });
    
    // Add author info to the comment for immediate display
    return {
      ...newComment,
      authorName: currentUser.nickname,
      authorAvatar: currentUser.avatar
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
}
