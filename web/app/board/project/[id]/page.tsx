"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Github, ExternalLink, ChevronUp, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Comments } from "@/components/comments";
import { getCurrentUser, getProjectById, voteForProject, ProjectWithVotes } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [project, setProject] = useState<ProjectWithVotes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVoting, setIsVoting] = useState(false);
  
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const user = getCurrentUser();
        setCurrentUser(user);
        
        if (!id || typeof id !== 'string') {
          setError('Invalid project ID');
          return;
        }
        
        const projectData = await getProjectById(id);
        setProject(projectData);
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [id]);

  const handleVote = async () => {
    if (!project || isVoting) return;
    
    // Check if user is authenticated
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    try {
      setIsVoting(true);
      // Call the vote API
      const result = await voteForProject(project.id);
      
      if (result.success) {
        // Update the local state without fetching the whole project again
        setProject(prev => {
          if (!prev) return null;
          return {
            ...prev,
            hasVoted: result.hasVoted,
            upvotes: result.upvoteCount
          };
        });
      }
    } catch (err) {
      console.error('Error voting for project:', err);
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="w-full flex-1 p-6 md:p-8 max-w-[1200px] mx-auto">
        <div className="mb-6">
          <Link href="/board" className="inline-flex items-center text-[#3B475A] hover:text-[#3B475A]/80">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Board
          </Link>
        </div>
        <Card className="p-6 text-center">
          <p>Loading project details...</p>
        </Card>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="w-full flex-1 p-6 md:p-8 max-w-[1200px] mx-auto">
        <div className="mb-6">
          <Link href="/board" className="inline-flex items-center text-[#3B475A] hover:text-[#3B475A]/80">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Board
          </Link>
        </div>
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <p className="mb-6">{error || 'The project you are looking for does not exist or has been removed.'}</p>
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

  // Check if the current user is the author of the project
  const isAuthor = currentUser && currentUser.nickname && currentUser.nickname === project.author;

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
            onClick={() => router.push(`/board/project/edit?id=${project.id}`)}
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
            {project.status === "proposed" ? "Proposed" : 
             project.status === "in_progress" ? "In Progress" : 
             project.status === "completed" ? "Completed" : project.status}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-1.5 bg-transparent border h-10 px-4 text-base cursor-pointer ${project.hasVoted ? 'text-blue-600 border-blue-600' : 'text-[#3B475A] hover:text-[#3B475A]/80'}`}
          onClick={handleVote}
          disabled={isVoting || !currentUser}
        >
          <ChevronUp className="h-5 w-5" />
          <span>{project.upvotes}</span>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Left side - Post details */}
        <div className="flex-1 lg:w-2/3 flex">
          <Card className="p-6 w-full flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-louize)] mb-4 text-[#3B475A]">
              {project.title}
            </h1>
            
            <div className="text-[#3B475A] mb-6">
              {project.description || "No description provided."}
            </div>
            
            <div className="flex flex-col space-y-2 text-sm text-[#3B475A]">
              <div className="flex items-center">
                <span className="font-semibold w-24">Posted by:</span>
                <span>{project.author}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-24">Date:</span>
                <span>{new Date(project.created).toLocaleDateString('en-US', {
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
              {project.githubRepo && (
                <div className="flex items-start">
                  <Github className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Repo</div>
                    <a 
                      href={project.githubRepo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-[#3B475A]/80 text-sm flex items-center"
                    >
                      {project.githubRepo.replace('https://github.com/', '')}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
              
              {(project.postLink || project.saasTarget) && (
                <div className="flex items-start">
                  <ExternalLink className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">SaaS</div>
                    <a 
                      href={project.postLink || project.saasTarget} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-[#3B475A]/80 text-sm flex items-center"
                    >
                      {getSiteName(project.postLink || project.saasTarget)}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
              
              {project.techStack && project.techStack.length > 0 && (
                <div className="flex items-start">
                  <div className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Tech Stack</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.techStack.map((tech, index) => (
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
          <Comments postId={project.id} initialComments={project.comments || []} />
        </Card>
      </div>
    </main>
  );
}
