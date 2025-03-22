"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import pb from "@/lib/pocketbase";

export default function NewSaasItem() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      await pb.collection('saas').create({
        url
      });
      router.push("/board/alternatives");
    } catch (err) {
      console.error('Error saving SaaS item:', err);
      setError('Failed to save URL. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="w-full flex-1 p-6 md:p-8 max-w-[900px] mx-auto">
      <div className="mb-6">
        <Link href="/board/alternatives" className="inline-flex items-center text-[#3B475A] hover:text-[#3B475A]/80">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Alternatives
        </Link>
      </div>

      <Card className="p-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A] mb-6">
          Add New Alternative
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input 
              id="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="https://example.com"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </form>
      </Card>
    </main>
  );
} 