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
    
    return records.items.map(record => ({
      id: record.id,
      user: record.user,
      project: record.project,
      created: record.created
    }));
  } catch (error) {
    console.error('Error fetching user votes:', error);
    return [];
  }
}

export interface VoteResult {
  success: boolean;
  hasVoted: boolean;
  upvoteCount: number;
}

export async function voteForProject(projectId: string): Promise<VoteResult> {
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
    
    let hasVoted = false;
    
    if (existingVotes.items.length > 0) {
      // User has already voted, so remove the vote
      await pb.collection('votes').delete(existingVotes.items[0].id);
      hasVoted = false; // No longer voted
    } else {
      // User has not voted, so add a new vote
      console.log("Voting for project:", projectId)
      console.log("User", currentUser.id)

      await pb.collection('votes').create({
        user: currentUser.id,
        project: projectId
      });
      hasVoted = true; // Now voted
    }
    
    // Get the updated vote count
    const votes = await pb.collection('votes').getList(1, 1, {
      filter: `project="${projectId}"`,
      requestKey: `votes-count-${projectId}`
    });
    
    return {
      success: true,
      hasVoted: hasVoted,
      upvoteCount: votes.totalItems
    };
  } catch (error) {
    console.error('Error voting for project:', error);
    return {
      success: false,
      hasVoted: false,
      upvoteCount: 0
    };
  }
}
