"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}

interface CommentsProps {
  postId: string;
  initialComments?: Comment[];
}

export function Comments({ postId, initialComments = [] }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    // In a real app, you would send this to your API
    const comment: Comment = {
      id: Math.random().toString(36).substring(2, 9), // Simple ID generation
      content: newComment,
      author: {
        name: "Current User", // In a real app, get from auth
        avatar: "/placeholder-avatar.png", // In a real app, get from auth
      },
      createdAt: new Date(),
    };
    
    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A]">
        Comments ({comments.length})
      </h2>
      
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] w-full text-[#3B475A]"
        />
        <Button 
          type="submit"
          disabled={!newComment.trim()}
          className="font-[family-name:var(--font-geist-sans)]"
        >
          Post Comment
        </Button>
      </form>
      
      {/* Comments list */}
      <div className="space-y-6 mt-8">
        {comments.length === 0 ? (
          <p className="text-[#3B475A]/70 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-[#3B475A]">{comment.author.name}</h3>
                    <time className="text-sm text-[#3B475A]/70">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </time>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-[#3B475A]">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
