"use client";

import { ProjectExamples } from "@/components/project-examples";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Suggestions() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);
  
  const handleNewPost = () => {
    if (isLoggedIn) {
      router.push("/board/project/edit");
    } else {
      router.push("/login");
    }
  };
  
  return (
    <main className="w-full flex-1 flex flex-col items-start p-8">
      <div className="text-left mb-12 w-full max-w-[900px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A]">
              Suggestions
            </h1>
            <p className="text-[#3B475A]/70 mt-2">
              Post and vote on SaaS products you want to see open-sourced alternatives for
            </p>
          </div>
          <Button 
            onClick={handleNewPost}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <PlusCircle className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
      
      <ProjectExamples />
    </main>
  );
}
