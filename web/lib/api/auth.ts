import pb from './pocketbase';

// Types
export interface User {
  id: string;
  nickname: string;
  email: string;
  avatar?: string;
}

// Functions to manage users
export async function registerUser(nickname: string, password: string, email: string): Promise<boolean> {
  try {
    // Create a new user record in PocketBase
    const data = {
      username: nickname,
      name: nickname,        // Add name field for redundancy
      nickname: nickname,    // Add nickname field for redundancy
      password: password,
      passwordConfirm: password,
      email: email,
      emailVisibility: true,
    };

    await pb.collection('users').create(data);
    
    // Auto-login after successful registration
    return await loginUser(email, password);
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
}

export async function loginUser(email: string, password: string): Promise<boolean> {
  try {
    // Login with PocketBase - this automatically sets the auth cookie
    await pb.collection('users').authWithPassword(email, password);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

export function logoutUser(): void {
  pb.authStore.clear();
}

export function getCurrentUser(): User | null {
  if (!pb.authStore.isValid) {
    return null;
  }
  
  const userData = pb.authStore.model;
  
  if (!userData) {
    return null;
  }
  
  return {
    id: userData.id,
    nickname: userData.username || userData.nickname || userData.name || userData.id,
    email: userData.email,
    avatar: userData.avatar ? pb.getFileUrl(userData, userData.avatar) : undefined
  };
}

export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}
