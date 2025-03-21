'use client';

export default function Analytics() {
  return (
    <main className="w-full flex-1 flex flex-col items-start p-8">
      <div className="text-left mb-12 w-full max-w-[1200px] mx-auto">
        <h1 className="text-4xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A]">
          Analytics
        </h1>
        <p className="text-[#3B475A]/70 mt-2">
          View site analytics and user behavior
        </p>
      </div>
      <div className="w-full max-w-[1200px] mx-auto">
        <iframe 
          width="100%" 
          height="800" 
          frameBorder="0" 
          allowFullScreen 
          src="https://us.posthog.com/embedded/V0FjGxpMQ1NS4wHRvrnb_auaFGxakg"
        />
      </div>
    </main>
  );
} 