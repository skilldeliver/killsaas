import { ProjectCard } from "@/components/project-card";

export function ProjectExamples() {
  return (
    <div className="w-full flex flex-col gap-6 p-4">
      <ProjectCard
        id="1"
        title="Open Source Alternative to Notion"
        githubRepo="https://github.com/username/notion-alternative"
        postLink="https://www.notion.so/"
        status="proposed"
        upvotes={42}
        commentsCount={7}
      />
      
      <ProjectCard
        id="2"
        title="Self-hosted Email Service"
        githubRepo="https://github.com/username/email-service"
        postLink="https://www.producthunt.com/"
        status="in_progress"
        upvotes={128}
        commentsCount={24}
      />
      
      <ProjectCard
        id="3"
        title="Privacy-focused Analytics"
        githubRepo="https://github.com/username/privacy-analytics"
        postLink="https://analytics.google.com/"
        status="completed"
        upvotes={256}
        commentsCount={18}
      />
    </div>
  );
}
