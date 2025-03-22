import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LinkPreviewProps {
  url: string;
  width?: number;
  fallback?: React.ReactNode;
}

interface PreviewData {
  title: string;
  description: string;
  image: string;
  siteName: string;
}

export function LinkPreview({ url, width = 300, fallback }: LinkPreviewProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('Failed to fetch preview');
        const data = await response.json();
        setPreview(data);
      } catch (err) {
        console.error('Error fetching preview:', err);
        setError(true);
      }
    };

    fetchPreview();
  }, [url]);

  if (error && fallback) {
    return <>{fallback}</>;
  }

  if (!preview) {
    return (
      <div className="border rounded-lg overflow-hidden w-full animate-pulse" >
        <div className="relative w-full h-64 bg-gray-200"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg overflow-hidden w-full hover:border-[#3B475A]/30 transition-colors"
    >
      {preview.image && !imageError && (
        <div className="relative w-full h-64">
          <Image
            src={preview.image}
            alt={preview.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-medium text-[#3B475A] mb-2 text-lg">{preview.title}</h3>
        <p className="text-sm text-[#3B475A]/70 mb-3 line-clamp-2">{preview.description}</p>
        <p className="text-xs text-[#3B475A]/50">{preview.siteName}</p>
      </div>
    </a>
  );
} 