"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import pb from "@/lib/pocketbase";

interface SaasItem {
  id: string;
  url: string;
  created: string;
  updated: string;
  title?: string;
  description?: string;
  ogImage?: string;
}

interface AlternativeItem {
  id: string;
  title: string;
  description?: string;
  githubRepo?: string;
  status: "proposed" | "in_progress" | "completed";
  author: string;
  created: string;
  updated: string;
  techStack?: string[];
}

export default function SaasAlternativeDetail() {
  const { id } = useParams();
  const [saasItem, setSaasItem] = useState<SaasItem | null>(null);
  const [alternatives, setAlternatives] = useState<AlternativeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the SaaS item
        const saasRecord = await pb.collection('saas').getOne(id as string);
        setSaasItem(saasRecord as unknown as SaasItem);

        // Fetch related alternatives
        const alternativesRecords = await pb.collection('alternatives').getList(1, 10, {
          filter: `saas = "${saasRecord.id}"`,
          sort: '-created'
        });
        setAlternatives(alternativesRecords.items as unknown as AlternativeItem[]);
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

  return (
    <main className="w-full flex-1">
      <div className="p-4 sm:p-6 md:p-8">
        <Link href="/board/alternatives" className="inline-flex items-center text-[#3B475A] hover:text-[#3B475A]/80">
          <ChevronLeft className="h-4 w-4 mr-1" />
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
              <a
                href={saasItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#3B475A] hover:text-[#3B475A]/80"
              >
                Visit Website
              </a>
            </Card>

            {/* Right side - Related alternatives */}
            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A] mb-4">
                Open Source Alternatives
              </h2>
              {alternatives.length > 0 ? (
                <div className="space-y-4">
                  {alternatives.map((alt) => (
                    <Card key={alt.id} className="p-4">
                      <h3 className="font-medium text-[#3B475A] mb-2">{alt.title}</h3>
                      {alt.description && (
                        <p className="text-sm text-[#3B475A]/70 mb-2">{alt.description}</p>
                      )}
                      {alt.techStack && alt.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {alt.techStack.map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 rounded-md text-xs text-[#3B475A]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-[#3B475A]/70">
                        <span>Status: {alt.status}</span>
                        <span>By {alt.author}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-[#3B475A]/70">No open source alternatives found yet.</p>
              )}
            </Card>
          </div>
        ) : (
          <div className="text-center text-[#3B475A] p-8">
            <p>Alternative not found</p>
          </div>
        )}
      </div>
    </main>
  );
} 