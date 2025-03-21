"use client";

import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SaasItem {
  id: string;
  url: string;
  created: string;
  updated: string;
}

export default function Alternatives() {
  const [saasItems, setSaasItems] = useState<SaasItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaasItems = async () => {
      try {
        const records = await pb.collection('saas').getList(1, 50);
        setSaasItems(records.items as unknown as SaasItem[]);
      } catch (error) {
        console.error('Error fetching SaaS items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaasItems();
  }, []);

  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch {
      return '/default-favicon.png';
    }
  };

  const renderContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {loading ? (
        [...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
          </Card>
        ))
      ) : (
        saasItems.map((item) => (
          <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4"
            >
              <div className="relative w-8 h-8 overflow-hidden">
                <img 
                  src={getFaviconUrl(item.url)}
                  alt="Website favicon"
                  width={32}
                  height={32}
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-favicon.png';
                  }}
                />
              </div>
              <span className="text-[#3B475A] font-medium truncate">
                {new URL(item.url).hostname.replace(/^www\./, '')}
              </span>
            </a>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <main className="w-full flex-1 flex flex-col items-start p-8">
      <div className="text-left mb-12 w-full max-w-[900px] mx-auto">
        <h1 className="text-4xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A]">
          Alternatives
        </h1>
        <p className="text-[#3B475A]/70 mt-2">
          Browse existing SaaS alternatives
        </p>
      </div>
      <div className="w-full max-w-[900px] mx-auto">
        {renderContent()}
      </div>
    </main>
  );
} 