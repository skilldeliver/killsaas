"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { getCurrentUser, getProjectComments, createComment, CommentWithUser } from "@/lib/api";

// Using the Comment interface from auth.ts

interface CommentsProps {
  postId: string;
  initialComments?: CommentWithUser[];
}

export function Comments({ postId, initialComments = [] }: CommentsProps) {
  const [comments, setComments] = useState<CommentWithUser[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    async function loadComments() {
      try {
        setIsLoading(true);
        const user = getCurrentUser();
        setCurrentUser(user);
        
        const fetchedComments = await getProjectComments(postId);
        setComments(fetchedComments);
      } catch (err) {
        console.error('Error loading comments:', err);
        setError('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !currentUser) return;
    
    try {
      setIsSending(true);
      
      // Send comment to PocketBase
      const newCommentData = {
        projectId: postId,
        content: newComment
      };
      
      const createdComment = await createComment(newCommentData);
      
      // Update local comments state
      if (createdComment) {
        setComments([...comments, createdComment]);
        setNewComment("");
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment');
    } finally {
      setIsSending(false);
    }
  };

  if (error) {
    return (
      <div className="w-full space-y-6">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A]">
          Comments
        </h2>
        <div className="p-3 bg-red-50 text-red-500 rounded-md border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A]">
        Comments ({comments.length})
      </h2>
      
      {/* Comment form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] w-full text-[#3B475A]"
            disabled={isSending}
          />
          <Button 
            type="submit"
            disabled={!newComment.trim() || isSending}
            className="font-[family-name:var(--font-geist-sans)] w-full sm:w-auto"
          >
            {isSending ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      ) : (
        <div className="p-4 bg-gray-50 rounded-md text-[#3B475A]/70 text-center">
          Please <a href="/login" className="text-blue-500 hover:underline">login</a> to post a comment.
        </div>
      )}
      
      {/* Comments list */}
      <div className="space-y-6 mt-8">
        {isLoading ? (
          <p className="text-[#3B475A]/70 text-center py-8">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-[#3B475A]/70 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                  <AvatarFallback>{comment.authorName && comment.authorName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0"> {/* min-w-0 prevents overflow on small screens */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <h3 className="font-semibold text-[#3B475A] text-sm sm:text-base truncate">{comment.authorName}</h3>
                    <time className="text-xs sm:text-sm text-[#3B475A]/70">
                      {formatDistanceToNow(new Date(comment.created), { addSuffix: true })}
                    </time>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-[#3B475A] text-sm sm:text-base break-words">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
