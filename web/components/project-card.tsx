"use client";
import * as React from "react";
import { ThumbsUp, MessageSquare, ChevronUp, Link as LinkIcon, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProjectStatus = "proposed" | "in_progress" | "completed";

interface ProjectCardProps extends React.ComponentProps<typeof Card> {
  id: string;
  title: string;
  githubRepo?: string;
  postLink?: string;
  status: ProjectStatus;
  upvotes?: number;
  commentsCount?: number;
  className?: string;
  author?: string;
}

export function ProjectCard({
  id,
  title,
  githubRepo,
  postLink,
  status,
  upvotes = 0,
  commentsCount = 0,
  className,
  author,
  ...props
}: ProjectCardProps) {
  const [siteName, setSiteName] = useState<string>("");
  const [isHovering, setIsHovering] = useState(false);
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (postLink) {
      try {
        const hostname = new URL(postLink).hostname;
        // Remove www. prefix and get the domain name
        setSiteName(hostname.replace(/^www\./, ''));
      } catch (error) {
        console.error("Invalid URL:", error);
      }
    }

    // Check if current user is the author
    const currentUser = getCurrentUser();
    if (currentUser && author && currentUser.nickname === author) {
      setIsCurrentUserAuthor(true);
    }
  }, [postLink, author]);

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case "proposed":
        return "Proposed";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on links or buttons inside the card
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    
    router.push(`/board/post/${id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/board/post/edit?id=${id}`);
  };

  return (
    <Card 
      className={cn(
        "max-w-[900px] w-full mx-auto transition-colors duration-200 hover:bg-gray-50 py-3 cursor-pointer", 
        className
      )} 
      onClick={handleCardClick}
      {...props}
    >
      <CardHeader className="px-4 py-2 pb-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-[family-name:var(--font-louize)] text-[#3B475A]">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {isCurrentUserAuthor && (
              <Button
                variant="ghost"
                size="sm"
                className="px-2 text-[#3B475A]/70 hover:text-[#3B475A]"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1.5 bg-transparent border h-10 px-4 text-base cursor-pointer text-[#3B475A] hover:text-[#3B475A]/80"
            >
              <ChevronUp className="h-5 w-5" />
              <span>{upvotes}</span>
            </Button>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 text-xs border rounded-full text-[#3B475A]">
            {getStatusLabel(status)}
          </span>
          {postLink && (
            <Link 
              href={postLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-[#3B475A] hover:text-[#3B475A]/80 flex items-center gap-1.5 group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="relative w-4 h-4 overflow-hidden">
                <Image 
                  src={`https://www.google.com/s2/favicons?domain=${new URL(postLink).hostname}&sz=64`}
                  alt="Website favicon"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </div>
              <span>{siteName}</span>
              <LinkIcon className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity`} />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardFooter className="px-4 pt-1 pb-2 flex justify-between items-start">
        <div className="flex pl-1 items-center gap-1 text-sm text-[#3B475A]">
          <MessageSquare className="h-4 w-4" />
          <span>{commentsCount}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
