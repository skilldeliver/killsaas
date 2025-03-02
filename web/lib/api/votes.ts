import pb from './pocketbase';
import { getCurrentUser } from './auth';

// Votes
export interface Vote {
  id: string;
  user: string;
  project: string;
  created: string;
}

export async function getUserVotes(userId: string): Promise<Vote[]> {
  try {
    const records = await pb.collection('votes').getList(1, 100, {
      filter: `user="${userId}"`,
      requestKey: `user-votes-${userId}`
    });
    return records.items as Vote[];
  } catch (error) {
    console.error('Error fetching user votes:', error);
    return [];
  }
}

export async function voteForProject(projectId: string): Promise<boolean> {
  try {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Check if user has already voted for this project
    const existingVotes = await pb.collection('votes').getList(1, 1, {
      filter: `user="${currentUser.id}" && project="${projectId}"`,
      requestKey: `check-vote-${projectId}`
    });
    
    if (existingVotes.items.length > 0) {
      // User has already voted, so remove the vote
      await pb.collection('votes').delete(existingVotes.items[0].id);
      return false; // No longer voted
    } else {
      // User has not voted, so add a new vote
      await pb.collection('votes').create({
        user: currentUser.id,
        project: projectId
      });
      return true; // Now voted
    }
  } catch (error) {
    console.error('Error voting for project:', error);
    return false;
  }
}
