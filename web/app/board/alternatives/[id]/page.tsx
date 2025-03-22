"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import pb from "@/lib/pocketbase";
import { LinkPreview } from "@/components/link-preview";
import { GitHubRepoCard } from "@/components/github-repo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface SaasItem {
  id: string;
  url: string;
  created: string;
  updated: string;
  title?: string;
  description?: string;
  ogImage?: string;
}

interface GitHubRepoData {
  name: string;
  description: string;
  forks: number;
  stargazers_count: number;
  language: string;
  html_url: string;
  owner: {
    login: string;
  };
}

interface Alternative {
  id: string;
  title: string;
  description?: string;
  techStack?: string[];
  status: string;
  author: string;
  url?: string;
}

export default function SaasAlternativeDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saasItem, setSaasItem] = useState<SaasItem | null>(null);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [githubData, setGithubData] = useState<Record<string, GitHubRepoData>>({});
  const [newAlternativeUrl, setNewAlternativeUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const record = await pb.collection('saas').getOne(id as string);
        setSaasItem(record as unknown as SaasItem);

        // Fetch alternatives
        const alternativesList = await pb.collection('alternatives').getList(1, 50, {
          filter: `saas = "${id}"`,
        });
        const typedAlternatives = alternativesList.items.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          techStack: item.techStack,
          status: item.status,
          author: item.author,
          url: item.url,
        })) as Alternative[];
        setAlternatives(typedAlternatives);

        // Fetch GitHub data for each alternative with a GitHub URL
        const githubPromises = typedAlternatives
          .filter((alt) => {
            if (!alt.url) return false;
            try {
              const url = new URL(alt.url);
              return url.hostname === 'github.com' && url.pathname.split('/').length >= 3;
            } catch {
              return false;
            }
          })
          .map(async (alt) => {
            try {
              const [owner, repo] = alt.url!.replace('https://github.com/', '').split('/');
              const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
              if (response.ok) {
                const data = await response.json();
                return { [alt.id]: data };
              }
            } catch (error) {
              console.error(`Error fetching GitHub data for ${alt.url}:`, error);
            }
            return null;
          });

        const githubResults = await Promise.all(githubPromises);
        const githubDataMap: Record<string, GitHubRepoData> = githubResults.reduce((acc: Record<string, GitHubRepoData>, curr) => {
          if (curr) {
            return { ...acc, ...curr };
          }
          return acc;
        }, {});
        setGithubData(githubDataMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getSiteName = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  const handleCreateAlternative = async () => {
    if (!newAlternativeUrl || !saasItem) return;

    try {
      const newAlternative = {
        title: newAlternativeUrl, // This will be updated with metadata later
        url: newAlternativeUrl,
        saas: saasItem.id,
        status: "pending",
        author: "anonymous", // You might want to get this from user context
      };

      const createdAlternative = await pb.collection('alternatives').create(newAlternative);
      
      // Refresh the alternatives list
      const alternativesList = await pb.collection('alternatives').getList(1, 50, {
        filter: `saas = "${id}"`,
      });
      const typedAlternatives = alternativesList.items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        techStack: item.techStack,
        status: item.status,
        author: item.author,
        url: item.url,
      })) as Alternative[];
      setAlternatives(typedAlternatives);

      // If the new alternative is a GitHub URL, fetch its data
      if (newAlternativeUrl.includes('github.com')) {
        try {
          const [owner, repo] = newAlternativeUrl.replace('https://github.com/', '').split('/');
          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
          if (response.ok) {
            const data = await response.json();
            setGithubData(prev => ({
              ...prev,
              [createdAlternative.id]: data
            }));
          }
        } catch (error) {
          console.error(`Error fetching GitHub data for ${newAlternativeUrl}:`, error);
        }
      }

      // Reset form and close dialog
      setNewAlternativeUrl("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating alternative:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/board/alternatives" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft className="w-4 h-4" />
          Back to Alternatives
        </Link>
      </div>
      <div className="px-4 sm:px-6 md:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 md:p-8">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-48 w-full" />
            </Card>
            <Card className="p-6 md:p-8">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </Card>
          </div>
        ) : saasItem ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - OG/Meta information */}
            <Card className="p-6 md:p-8">
              <h1 className="text-2xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A] mb-4">
                {saasItem.title || getSiteName(saasItem.url)}
              </h1>
              {saasItem.description && (
                <p className="text-[#3B475A]/70 mb-4">{saasItem.description}</p>
              )}
              {saasItem.ogImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                  <img
                    src={saasItem.ogImage}
                    alt={saasItem.title || getSiteName(saasItem.url)}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="mb-4">
                <LinkPreview 
                  url={saasItem.url} 
                  width={300}
                  fallback={
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-[#3B475A]/70">Unable to load preview</p>
                      <a
                        href={saasItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#3B475A] hover:text-[#3B475A]/80"
                      >
                        Visit Website
                      </a>
                    </div>
                  }
                />
              </div>
            </Card>

            {/* Right side - Related alternatives */}
            <Card className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A]">
                  Open Source Alternatives
                </h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="bg-[#3B475A] hover:bg-[#3B475A]/90">
                      <Plus className="w-4 h-4 text-white" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Alternative</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="url">Alternative URL</Label>
                        <Input
                          id="url"
                          placeholder="https://example.com"
                          value={newAlternativeUrl}
                          onChange={(e) => setNewAlternativeUrl(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleCreateAlternative} className="w-full">
                        Create Alternative
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="h-[450px] overflow-y-auto pr-2">
                {alternatives.length > 0 ? (
                  <div className="space-y-4">
                    {alternatives.map((alt) => (
                      alt.url && alt.url.includes('github.com') && githubData[alt.id] && (
                        <GitHubRepoCard
                          key={alt.id}
                          name={githubData[alt.id].name}
                          description={githubData[alt.id].description}
                          forks={githubData[alt.id].forks}
                          stars={githubData[alt.id].stargazers_count}
                          language={githubData[alt.id].language}
                          url={githubData[alt.id].html_url}
                          author={githubData[alt.id].owner.login}
                        />
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-[#3B475A]/70">No open source alternatives found yet.</p>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <div className="text-center text-[#3B475A] p-8">
            <p>Alternative not found</p>
          </div>
        )}
      </div>
    </div>
  );
}