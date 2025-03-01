"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Github, ExternalLink, ChevronUp, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Comments } from "@/components/comments";
import { getCurrentUser, getAllPosts } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function PostDetail() {
  const { id } = useParams();
  const router = useRouter();
  const currentUser = getCurrentUser();
  
  const post = useMemo(() => {
    const posts = getAllPosts();
    return posts.find(p => p.id === id);
  }, [id]);

  if (!post) {
    return (
      <main className="w-full flex-1 p-6 md:p-8 max-w-[1200px] mx-auto">
        <div className="mb-6">
          <Link href="/board" className="inline-flex items-center text-[#3B475A] hover:text-[#3B475A]/80">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Board
          </Link>
        </div>
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <p className="mb-6">The post you are looking for does not exist or has been removed.</p>
          <Button onClick={() => router.push('/board')}>Go to Board</Button>
        </Card>
      </main>
    );
  }

  // Extract hostname for display
  const getSiteName = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, '');
    } catch (error) {
      return url;
    }
  };

  // Check if the current user is the author of the post
  const isAuthor = currentUser && currentUser.nickname === post.author;

  return (
    <main className="w-full flex-1 p-6 md:p-8 max-w-[1200px] mx-auto">
      <div className="mb-6 flex justify-between">
        <Link href="/board" className="inline-flex items-center text-[#3B475A] hover:text-[#3B475A]/80">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Board
        </Link>
        
        {isAuthor && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/board/post/edit?id=${post.id}`)}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {/* Status and Vote Banner */}
      <div className="mb-6 flex justify-between items-center w-full py-3 px-4 border rounded-md">
        <div className="flex items-center">
          <span className="inline-block px-2 py-0.5 text-xs border rounded-full text-[#3B475A]">
            {post.status === "proposed" ? "Proposed" : 
             post.status === "in_progress" ? "In Progress" : 
             post.status === "completed" ? "Completed" : post.status}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1.5 bg-transparent border text-[#3B475A] h-10 px-4 text-base cursor-pointer hover:text-[#3B475A]/80"
        >
          <ChevronUp className="h-5 w-5" />
          <span>{post.upvotes}</span>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left side - Post details */}
        <div className="flex-1 lg:w-2/3 flex">
          <Card className="p-6 w-full flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-louize)] mb-4 text-[#3B475A]">
              {post.title}
            </h1>
            
            <div className="text-[#3B475A] mb-6">
              {post.description || "No description provided."}
            </div>
            
            <div className="flex flex-col space-y-2 text-sm text-[#3B475A]">
              <div className="flex items-center">
                <span className="font-semibold w-24">Posted by:</span>
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-24">Date:</span>
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right side - Technical details */}
        <div className="lg:w-1/3 flex">
          <Card className="p-6 w-full flex flex-col">
            
            <div className="space-y-4 text-[#3B475A]">
              {post.githubRepo && (
                <div className="flex items-start">
                  <Github className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Repo</div>
                    <a 
                      href={post.githubRepo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-[#3B475A]/80 text-sm flex items-center"
                    >
                      {post.githubRepo.replace('https://github.com/', '')}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
              
              {post.postLink && (
                <div className="flex items-start">
                  <ExternalLink className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">SaaS</div>
                    <a 
                      href={post.postLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-[#3B475A]/80 text-sm flex items-center"
                    >
                      {getSiteName(post.postLink)}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
              
              {post.techStack && post.techStack.length > 0 && (
                <div className="flex items-start">
                  <div className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Tech Stack</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {post.techStack.map((tech, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-gray-100 text-xs rounded-md text-[#3B475A]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Comments section */}
      <div className="mt-8">
        <Card className="p-6">
          <Comments postId={post.id} initialComments={post.comments || []} />
        </Card>
      </div>
    </main>
  );
}
