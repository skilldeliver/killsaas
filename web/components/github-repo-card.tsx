import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Github, Star, GitFork, Code } from "lucide-react";

interface GitHubRepoCardProps extends React.ComponentProps<typeof Card> {
  name: string;
  description: string;
  forks: number;
  stars: number;
  language: string;
  url: string;
  author: string;
}

export function GitHubRepoCard({
  name,
  description,
  forks,
  stars,
  language,
  url,
  author,
  className,
  ...props
}: GitHubRepoCardProps) {
  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-shadow cursor-pointer gap-2 p-2",
        className
      )} 
      onClick={() => window.open(url, '_blank')}
      {...props}
    >
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-base font-[family-name:var(--font-louize)] text-[#3B475A] flex items-center gap-2">
          <Github className="h-4 w-4" />
          <span className="hover:text-[#3B475A]/80 truncate">
            {author}/{name}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <p className="text-[#3B475A]/70 text-sm mb-2 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-3 text-sm text-[#3B475A]/70">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            <span>{stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5" />
            <span>{forks}</span>
          </div>
          {language && (
            <div className="flex items-center gap-1">
              <Code className="h-3.5 w-3.5" />
              <span>{language}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}