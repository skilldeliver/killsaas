'use client';

import { useEffect, useState } from 'react';
import { ProjectCard } from "@/components/project-card";
import { getAllProjects, ProjectWithVotes } from "@/lib/api";

export function ProjectExamples() {
  const [projects, setProjects] = useState<ProjectWithVotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const projectData = await getAllProjects();
        setProjects(projectData);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4 py-12">
        <p className="text-[#3B475A]/70">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4 py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-4 py-12">
        <p className="text-[#3B475A]/70">No projects found. Be the first to add one!</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 p-4">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.title}
          githubRepo={project.githubRepo}
          postLink={project.postLink}
          status={project.status}
          upvotes={project.upvotes}
          commentsCount={project.commentsCount}
          author={project.author}
        />
      ))}
    </div>
  );
}
