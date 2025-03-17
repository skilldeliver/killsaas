export default function Posts() {
  const posts = [
    {
      title: "Domain snipe in the day of launch",
      date: "17.03.2025",
      slug: "domain-snipe"
    }
  ];

  return (
    <main className="flex-1 flex flex-col items-center p-8">
      <section className="max-w-3xl w-full mx-auto">
        <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-louize)] text-[#3B475A]">
          Blog Posts
        </h1>
        <div className="space-y-4">
          {posts.map((post) => (
            <a 
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="flex justify-between items-center p-4 border rounded-lg hover:bg-slate-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-[#3B475A] font-[family-name:var(--font-louize)]">{post.title}</h2>
              <span className="text-[#7A8B9C]">{post.date}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
