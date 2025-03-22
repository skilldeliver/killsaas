import { use } from 'react';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Params = Promise<{
  slug: string;
}>;

export default function Post(props: { params: Params }) {
  const params = use(props.params);
  const slug = params.slug;

  const content = fs.readFileSync(
    path.join(process.cwd(), 'posts', `${slug}.md`),
    'utf-8'
  );

  // Get post metadata
  const posts = [
    {
      title: "From 0 to 5 users",
      date: "23.03.2025",
      slug: "from-0-to-5", 
      thumbnail: "/posts/from-0-to-5.png",
      excerpt: "A journey of acquiring the first users for an open source project, and the lessons learned along the way."
    },
    {
      title: "Domain snipe in the day of launch",
      date: "17.03.2025",
      slug: "domain-snipe",
      thumbnail: "/posts/domain-snipe.png",
      excerpt: "A story about how someone sniped the domain name I wanted on launch day, and how I turned it into an opportunity."
    }
  ];

  const post = posts.find(p => p.slug === slug);

  return (
    <main className="flex-1 flex flex-col items-center p-8 text-[#3B475A]">
      <article className="max-w-3xl py-24 mx-auto prose prose-slate">
        {post?.thumbnail && (
          <div className="relative w-full h-24 overflow-hidden rounded-lg mb-8">
            <img 
              src={post.thumbnail}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ node, ...props }) => (
              <a {...props} className="underline hover:text-[#3B475A]/80" target="_blank" rel="noopener noreferrer" />
            ),
            strong: ({ node, ...props }) => (
              <strong {...props} className="font-bold" />
            ),
            img: ({ node, ...props }) => (
              <img {...props} className="w-full rounded-lg shadow-md my-8" />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className="my-4" />
            ),
            h1: ({ node, ...props }) => (
              <h1 {...props} className="text-4xl font-bold font-[family-name:var(--font-louize)] mb-8" />
            ),
            h2: ({ node, ...props }) => (
              <h2 {...props} className="text-2xl font-bold font-[family-name:var(--font-louize)] mb-4" />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc pl-4 my-4" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="list-decimal pl-4 my-4" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
      <div className="flex items-center gap-4">
        <p className="text-[#7A8B9C]">{post?.date}</p>
        <p className="text-[#7A8B9C]">Skilldeliver</p>
      </div>
    </main>
  );
}