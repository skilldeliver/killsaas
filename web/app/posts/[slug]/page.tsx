import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function Post() {
  // Make the function async to match Next.js expectations
  
  // For now, we'll only have one post
  const content = fs.readFileSync(
    path.join(process.cwd(), 'posts', 'DOMAIN.md'),
    'utf-8'
  );

  return (
    <main className="flex-1 flex flex-col items-center p-8 text-[#3B475A]">
      <article className="max-w-3xl py-24 mx-auto prose prose-slate">
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
              <h1 {...props} className="text-4xl font-bold mb-8" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
      <div className="flex items-center gap-4">
        <p className="text-[#7A8B9C]">17/03/2025</p>
        <p className="text-[#7A8B9C]">Skilldeliver</p>
      </div>
    </main>
  );
}