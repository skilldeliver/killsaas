"use client";

import { ProjectExamples } from "@/components/project-examples";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Board() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    setIsLoggedIn(!!getCurrentUser());
  }, []);
  
  const handleNewPost = () => {
    if (isLoggedIn) {
      router.push("/board/post/edit");
    } else {
      router.push("/login");
    }
  };
  
  return (
    <main className="w-full flex-1 flex flex-col items-center p-8">
      <div className="text-center mb-12 w-full max-w-[900px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A]">
            Board
          </h1>
          <Button 
            onClick={handleNewPost}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Post
          </Button>
        </div>
        <p className="text-[#3B475A]/70 mt-2 max-w-md mx-auto">
          Post and vote on SaaS products you want to see open-sourced alternatives for
        </p>
      </div>
      
      <ProjectExamples />
    </main>
  );
}
