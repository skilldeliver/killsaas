import pb from './pocketbase';
import { getCurrentUser } from './auth';
import { Vote, getUserVotes } from './votes';

// Project/Post types mapped to PocketBase collection
export interface Project {
  id: string;
  title: string;
  description?: string;
  githubRepo?: string;
  postLink?: string;
  status: "proposed" | "in_progress" | "completed";
  author: string;
  authorId: string;
  created: string;
  updated: string;
  techStack?: string[];
}

export interface ProjectWithVotes extends Project {
  upvotes: number;
  commentsCount: number;
  hasVoted?: boolean;
}

export async function getUserProjects(userId: string): Promise<ProjectWithVotes[]> {
  try {
    const records = await pb.collection('projects').getList(1, 50, {
      filter: `author="${userId}"`,
      sort: '-created',
      expand: 'author',
      requestKey: `user-projects-${userId}`
    });
    
    return await addVotesAndCommentsCount(records.items);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return [];
  }
}

export async function getAllProjects(): Promise<ProjectWithVotes[]> {
  try {
    const records = await pb.collection('projects').getList(1, 50, {
      sort: '-created',
      expand: 'author',
      requestKey: 'all-projects'
    });
    
    return await addVotesAndCommentsCount(records.items);
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<ProjectWithVotes | null> {
  try {
    const record = await pb.collection('projects').getOne(id, {
      expand: 'author',
      requestKey: `project-${id}`
    });
    
    const projectsWithVotes = await addVotesAndCommentsCount([record]);
    return projectsWithVotes[0] || null;
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    return null;
  }
}

export async function saveProject(project: Partial<Project>): Promise<Project | null> {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const formData = {
      ...project,
      author: currentUser.id
    };
    
    let result;
    
    if (project.id) {
      // Update existing project
      result = await pb.collection('projects').update(project.id, formData);
    } else {
      // Create new project
      result = await pb.collection('projects').create(formData);
    }
    
    return result;
  } catch (error) {
    console.error('Error saving project:', error);
    return null;
  }
}

export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    await pb.collection('projects').delete(projectId);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}

async function addVotesAndCommentsCount(projects: any[]): Promise<ProjectWithVotes[]> {
  const currentUser = getCurrentUser();
  const userVotes = currentUser ? await getUserVotes(currentUser.id) : [];
  
  return Promise.all(projects.map(async (project) => {
    // Count votes for this project
    const votes = await pb.collection('votes').getList(1, 1, {
      filter: `project="${project.id}"`,
      requestKey: `votes-count-${project.id}`
    });
    
    // Count comments for this project
    const comments = await pb.collection('comments').getList(1, 1, {
      filter: `project="${project.id}"`,
      requestKey: `comments-count-${project.id}`
    });

    // Check if current user has voted for this project
    const hasVoted = userVotes.some(vote => vote.project === project.id);
    
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      githubRepo: project.githubRepo,
      postLink: project.postLink,
      status: project.status,
      author: project.expand?.author ? project.expand.author.username : project.author,
      authorId: project.author,
      created: project.created,
      updated: project.updated,
      techStack: project.techStack,
      upvotes: votes.totalItems,
      commentsCount: comments.totalItems,
      hasVoted: hasVoted
    };
  }));
}
