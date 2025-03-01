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
import { getCurrentUser, getAllPosts } from "@/lib/auth";

export default function PostEdit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const isEditMode = !!postId;
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [postLink, setPostLink] = useState("");
  const [status, setStatus] = useState<"proposed" | "in_progress" | "completed">("proposed");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  
  // Ensure user is logged in
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    
    // If editing, load post data
    if (isEditMode) {
      const posts = getAllPosts();
      const post = posts.find(p => p.id === postId);
      
      if (post) {
        // Check if current user is the author
        if (post.author !== currentUser.nickname) {
          router.push("/board");
          return;
        }
        
        setTitle(post.title);
        setDescription(post.description || "");
        setGithubRepo(post.githubRepo || "");
        setPostLink(post.postLink || "");
        setStatus(post.status);
        setTechStack(post.techStack || []);
      } else {
        // Post not found
        router.push("/board");
      }
    }
  }, [postId, isEditMode, router]);
  
  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput("");
    }
  };
  
  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    
    const posts = getAllPosts();
    
    // Create new post object
    const newPost = {
      id: isEditMode ? postId : Math.random().toString(36).substring(2, 9),
      title,
      description,
      githubRepo,
      postLink,
      status,
      techStack,
      upvotes: isEditMode ? posts.find(p => p.id === postId)?.upvotes || 0 : 0,
      commentsCount: isEditMode ? posts.find(p => p.id === postId)?.commentsCount || 0 : 0,
      comments: isEditMode ? posts.find(p => p.id === postId)?.comments || [] : [],
      author: currentUser.nickname,
      createdAt: isEditMode ? posts.find(p => p.id === postId)?.createdAt || new Date().toISOString() : new Date().toISOString()
    };
    
    if (isEditMode) {
      // Update existing post
      const updatedPosts = posts.map(p => p.id === postId ? newPost : p);
      localStorage.setItem('killsaas-posts', JSON.stringify(updatedPosts));
    } else {
      // Add new post
      localStorage.setItem('killsaas-posts', JSON.stringify([...posts, newPost]));
    }
    
    // Redirect to the post page
    router.push(`/board/post/${newPost.id}`);
  };
  
  return (
    <main className="w-full flex-1 p-6 md:p-8 max-w-[900px] mx-auto">
      <div className="mb-6">
        <Link href="/board" className="inline-flex items-center text-[#3B475A] hover:text-[#3B475A]/80">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Board
        </Link>
      </div>
      
      <Card className="p-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-louize)] mb-6 text-[#3B475A]">
          {isEditMode ? "Edit Post" : "Create New Post"}
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
            <Label htmlFor="postLink">SaaS Link (optional)</Label>
            <Input 
              id="postLink" 
              value={postLink} 
              onChange={(e) => setPostLink(e.target.value)} 
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
            <Button type="submit">
              {isEditMode ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
