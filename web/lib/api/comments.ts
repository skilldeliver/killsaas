import pb from './pocketbase';
import { getCurrentUser } from './auth';

// Comments
export interface Comment {
  id: string;
  content: string;
  author: string;
  project: string;
  created: string;
  updated: string;
}

export interface CommentWithUser extends Comment {
  authorName: string;
  authorAvatar?: string;
  expand?: {
    author?: {
      id: string;
      nickname: string;
      avatar?: string;
    };
  };
}

export async function getProjectComments(projectId: string): Promise<CommentWithUser[]> {
  try {
    const records = await pb.collection('comments').getList(1, 50, {
      filter: `project="${projectId}"`,
      sort: '-created',
      expand: 'author',
      requestKey: `project-comments-${projectId}`
    });
    
    return records.items.map(comment => {
      const userData = comment.expand?.author;
      const result: CommentWithUser = {
        id: comment.id,
        content: comment.content,
        author: comment.author,
        project: comment.project,
        created: comment.created,
        updated: comment.updated,
        authorName: userData && typeof userData === 'object' ? userData.nickname : 'Unknown User',
        authorAvatar: userData && typeof userData === 'object' && userData.avatar ? pb.getFileUrl(userData, userData.avatar) : undefined,
        expand: comment.expand
      };
      return result;
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
      content,
      author: currentUser.id,
      project: projectId
    });
    
    // Add author info to the comment for immediate display
    const result: CommentWithUser = {
      id: newComment.id,
      content: newComment.content,
      author: newComment.author,
      project: newComment.project,
      created: newComment.created,
      updated: newComment.updated,
      authorName: currentUser.nickname,
      authorAvatar: currentUser.avatar ? pb.getFileUrl(currentUser, currentUser.avatar) : undefined
    };
    return result;
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
}
