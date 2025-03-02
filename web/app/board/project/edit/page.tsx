"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, PlusCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentUser, getProjectById, saveProject } from "@/lib/api";

export default function ProjectEdit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const isEditMode = !!projectId;
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [saasTarget, setSaasTarget] = useState("");
  const [status, setStatus] = useState<"proposed" | "in_progress" | "completed">("proposed");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Ensure user is logged in and load project data if editing
  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          router.push("/login");
          return;
        }
        
        // If editing, load project data
        if (isEditMode && projectId) {
          const project = await getProjectById(projectId);
          
          if (project) {
            // Check if current user is the author
            if (!currentUser.nickname || project.author !== currentUser.nickname) {
              router.push("/board");
              return;
            }
            
            setTitle(project.title);
            setDescription(project.description || "");
            setGithubRepo(project.githubRepo || "");
            setSaasTarget(project.postLink || project.saasTarget || "");
            setStatus(project.status);
            setTechStack(project.techStack || []);
          } else {
            // Project not found
            setError('Project not found');
            setTimeout(() => router.push("/board"), 3000);
          }
        }
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [projectId, isEditMode, router]);
  
  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput("");
    }
  };
  
  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Create new project object
      const projectData = {
        id: isEditMode && projectId ? projectId : undefined,
        title,
        description,
        githubRepo,
        saasTarget,
        status,
        techStack
      };
      
      // Save project to PocketBase
      const savedProject = await saveProject(projectData);
      
      // Redirect to the project page
      router.push(`/board/project/${savedProject?.id}`);
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <main className="w-full flex-1 p-6 md:p-8 max-w-[900px] mx-auto">
        <div className="mb-6">
          <Link href="/board" className="inline-flex items-center text-[#3B475A] hover:text-[#3B475A]/80">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Board
          </Link>
        </div>
        <Card className="p-6 text-center">
          <p className="text-[#3B475A]/70">Loading...</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="w-full flex-1 p-6 md:p-8 max-w-[900px] mx-auto">
      <div className="mb-6">
        <Link href="/board" className="inline-flex items-center text-[#3B475A] hover:text-[#3B475A]/80">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Board
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md border border-red-200">
          {error}
        </div>
      )}
      
      <Card className="p-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-louize)] mb-6 text-[#3B475A]">
          {isEditMode ? "Edit Project" : "Create New Project"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="E.g., Open Source Alternative to Notion"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe what you're looking for..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="githubRepo">GitHub Repository URL (optional)</Label>
            <Input 
              id="githubRepo" 
              value={githubRepo} 
              onChange={(e) => setGithubRepo(e.target.value)} 
              placeholder="https://github.com/username/repo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="saasTarget">SaaS Link (optional)</Label>
            <Input 
              id="saasTarget" 
              value={saasTarget} 
              onChange={(e) => setSaasTarget(e.target.value)} 
              placeholder="https://example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={status} 
              onValueChange={(value: "proposed" | "in_progress" | "completed") => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proposed">Proposed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Tech Stack (optional)</Label>
            <div className="flex gap-2">
              <Input 
                value={techInput} 
                onChange={(e) => setTechInput(e.target.value)} 
                placeholder="Add technology..."
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddTech}
                variant="outline"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {techStack.map((tech, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm text-[#3B475A]"
                  >
                    <span>{tech}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTech(tech)}
                      className="text-[#3B475A]/70 hover:text-red-500"
                    >
                      <Trash className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : isEditMode ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
