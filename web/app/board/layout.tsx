"use client";


import { usePathname, useRouter } from "next/navigation";
import { Lightbulb, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  description: string;
  isActive?: (pathname: string) => boolean;
}

const navItems: NavItem[] = [
  {
    icon: <Lightbulb className="h-4 w-4" />,
    label: "Suggestions",
    path: "/board/suggestions",
    description: "Post and vote on SaaS products",
    isActive: (pathname) => pathname === "/board/suggestions" || pathname.startsWith("/board/project")
  },
  {
    icon: <GitCompare className="h-4 w-4" />,
    label: "Alternatives",
    path: "/board/alternatives",
    description: "Browse existing alternatives",
    isActive: (pathname) => pathname === "/board/alternatives" || pathname.startsWith("/board/alternatives/")
  }
];

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="border-b">
        <div className="flex gap-2 py-4 max-w-[900px] mx-auto justify-end">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
                (item.isActive ? item.isActive(pathname) : pathname === item.path)
                  ? "border-2 border-[#3B475A] text-black"
                  : "text-[#3B475A] hover:bg-[#3B475A]/5"
              )}
              title={item.description}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}