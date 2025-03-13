'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ProjectCard } from '@/components/project-card';
import { getCurrentUser, getUserProjects, logoutUser, ProjectWithVotes } from '@/lib/api';
import { PlusCircle } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string, nickname: string, email: string, avatar?: string } | null>(null);
  const [projects, setProjects] = useState<ProjectWithVotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUserData() {
      try {
        // Check if user is logged in
        const currentUser = getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }

        setUser(currentUser);
        
        // Get user's projects
        const userProjects = await getUserProjects(currentUser.id);
        setProjects(userProjects);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserData();
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  const handleNewPost = () => {
    router.push('/board/project/edit');
  };

  if (isLoading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-[#3B475A]/70">Loading profile...</p>
      </main>
    );
  }
  
  if (error) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }
  
  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <main className="flex-1 flex flex-col items-center p-8">
      <div className="w-full max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-8 p-6 rounded-lg border">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              {user.avatar ? (
                <img src={user.avatar} alt={user.nickname} className="h-full w-full object-cover" />
              ) : (
                <div className="bg-gray-300 h-full w-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-gray-700">
                    {user.nickname ? user.nickname.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
              )}
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A]">
                {user.nickname}
              </h1>
              <p className="text-[#3B475A]/70">Member</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-[#3B475A]">
            Sign Out
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#3B475A]">My Projects</h2>
            <Button 
              onClick={handleNewPost}
              className="flex items-center gap-2"
              size="sm"
            >
              <PlusCircle className="h-4 w-4" />
              New Project
            </Button>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-12 rounded-lg border">
              <p className="text-[#3B475A]/70 mb-4">You haven't created any projects yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  githubRepo={project.githubRepo}
                  postLink={project.postLink}
                  status={project.status}
                  upvotes={project.upvotes}
                  commentsCount={project.commentsCount}
                  author={project.author}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
