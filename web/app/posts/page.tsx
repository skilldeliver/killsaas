export default function Posts() {
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

  return (
    <main className="flex-1 flex flex-col items-center p-8">
      <section className="max-w-3xl w-full mx-auto">
        <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-louize)] text-[#3B475A]">
          Blog Posts
        </h1>
        <div className="grid gap-6">
          {posts.map((post) => (
            <a 
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group block"
            >
              <div className="flex flex-col gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-all duration-200 hover:shadow-md">
                <div className="relative w-full h-24 overflow-hidden rounded-lg">
                  <img 
                    src={post.thumbnail}
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#3B475A] font-[family-name:var(--font-louize)] mb-2 group-hover:text-[#3B475A]/80 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[#7A8B9C] mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="text-sm text-[#7A8B9C]">{post.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
