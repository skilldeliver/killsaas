// Simple client-side auth system
// In a production app, you would use a more secure authentication system

// Types
export interface User {
  nickname: string;
  password: string;
}

// Mock database of users (in real app, this would be on a server)
const STORAGE_KEY = 'killsaas-auth';

// Functions to manage users
export function registerUser(nickname: string, password: string): boolean {
  // Check if user already exists
  const users = getUsers();
  if (users.some(user => user.nickname === nickname)) {
    return false;
  }
  
  // Add new user
  users.push({ nickname, password });
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return true;
}

export function loginUser(nickname: string, password: string): boolean {
  const users = getUsers();
  const user = users.find(user => user.nickname === nickname && user.password === password);
  
  if (user) {
    // Set current user in session
    sessionStorage.setItem('currentUser', JSON.stringify({ nickname }));
    return true;
  }
  
  return false;
}

export function logoutUser(): void {
  sessionStorage.removeItem('currentUser');
}

export function getCurrentUser(): { nickname: string } | null {
  const userJson = sessionStorage.getItem('currentUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    return null;
  }
}

export function getUsers(): User[] {
  const usersJson = localStorage.getItem(STORAGE_KEY);
  if (!usersJson) return [];
  
  try {
    return JSON.parse(usersJson);
  } catch (e) {
    return [];
  }
}

// Mock posts data
export interface Post {
  id: string;
  title: string;
  description?: string;
  githubRepo?: string;
  postLink?: string;
  status: "proposed" | "in_progress" | "completed";
  upvotes: number;
  commentsCount: number;
  author: string;
  createdAt: string;
  techStack?: string[];
  comments?: {
    id: string;
    content: string;
    author: {
      name: string;
      avatar?: string;
    };
    createdAt: Date;
  }[];
}

const POSTS_STORAGE_KEY = 'killsaas-posts';

export function getUserPosts(nickname: string): Post[] {
  const posts = getAllPosts();
  return posts.filter(post => post.author === nickname);
}

export function getAllPosts(): Post[] {
  const postsJson = localStorage.getItem(POSTS_STORAGE_KEY);
  if (!postsJson) return getInitialPosts();
  
  try {
    return JSON.parse(postsJson);
  } catch (e) {
    return getInitialPosts();
  }
}

export function savePost(post: Post): void {
  const posts = getAllPosts();
  const existingPostIndex = posts.findIndex(p => p.id === post.id);
  
  if (existingPostIndex >= 0) {
    // Update existing post
    posts[existingPostIndex] = post;
  } else {
    // Add new post
    posts.push(post);
  }
  
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
}

export function deletePost(postId: string): boolean {
  const posts = getAllPosts();
  const filteredPosts = posts.filter(post => post.id !== postId);
  
  if (filteredPosts.length < posts.length) {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(filteredPosts));
    return true;
  }
  
  return false;
}

// Initial posts data for new installations
function getInitialPosts(): Post[] {
  const initialPosts: Post[] = [
    {
      id: "1",
      title: "Open source alternative to Vercel",
      description: "A self-hosted solution for serverless deployment and automation with similar features to Vercel.",
      githubRepo: "https://github.com/example/vercel-alternative",
      postLink: "https://vercel.com",
      status: "in_progress",
      upvotes: 120,
      commentsCount: 15,
      author: "devuser",
      createdAt: new Date().toISOString(),
      techStack: ["Node.js", "Docker", "Kubernetes"]
    },
    {
      id: "2",
      title: "FOSS Stripe replacement",
      description: "An open-source payment processing system that can be self-hosted as an alternative to Stripe.",
      postLink: "https://stripe.com",
      status: "proposed",
      upvotes: 85,
      commentsCount: 7,
      author: "paymentsguru",
      createdAt: new Date().toISOString(),
      techStack: ["Go", "PostgreSQL"]
    }
  ];
  
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(initialPosts));
  return initialPosts;
}
