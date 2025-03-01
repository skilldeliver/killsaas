'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ProjectCard } from '@/components/project-card';
import { getCurrentUser, getUserPosts, logoutUser, Post } from '@/lib/auth';
import { PlusCircle } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<{ nickname: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    
    // Get user's posts
    const userPosts = getUserPosts(currentUser.nickname);
    setPosts(userPosts);
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  const handleNewPost = () => {
    router.push('/board/post/edit');
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <main className="flex-1 flex flex-col items-center p-8">
      <div className="w-full max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-8 p-6 rounded-lg border">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <div className="bg-gray-300 h-full w-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-700">
                  {user.nickname.charAt(0).toUpperCase()}
                </span>
              </div>
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
            <h2 className="text-xl font-semibold text-[#3B475A]">My Posts</h2>
            <Button 
              onClick={handleNewPost}
              className="flex items-center gap-2"
              size="sm"
            >
              <PlusCircle className="h-4 w-4" />
              New Post
            </Button>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-12 rounded-lg border">
              <p className="text-[#3B475A]/70 mb-4">You haven't created any posts yet</p>
              <Button
                onClick={handleNewPost}
              >
                Create First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <ProjectCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  githubRepo={post.githubRepo}
                  postLink={post.postLink}
                  status={post.status}
                  upvotes={post.upvotes}
                  commentsCount={post.commentsCount}
                  author={post.author}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
