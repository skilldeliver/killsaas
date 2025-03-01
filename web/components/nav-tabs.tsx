'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';

const tabs = [
  { name: 'Board', href: '/board' },
  { name: 'Manifesto', href: '/manifesto' },
];

export function NavTabs() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in on client side
    const user = getCurrentUser();
    setIsLoggedIn(!!user);
  }, [pathname]); // Re-check when pathname changes

  return (
    <div className="border-b">
      <nav className="flex max-w-screen-xl mx-auto px-4 justify-between">
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  'inline-flex items-center px-6 py-4 border-b-2 text-sm font-medium',
                  isActive
                    ? 'border-[#3B475A] text-[#3B475A]'
                    : 'border-transparent text-[#3B475A]/70 hover:text-[#3B475A] hover:border-[#3B475A]/30'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>

        <div className="flex">
          {isLoggedIn ? (
            <Link
              href="/profile"
              className={cn(
                'inline-flex items-center px-6 py-4 border-b-2 text-sm font-medium',
                pathname === '/profile'
                  ? 'border-[#3B475A] text-[#3B475A]'
                  : 'border-transparent text-[#3B475A]/70 hover:text-[#3B475A] hover:border-[#3B475A]/30'
              )}
            >
              Profile
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  'inline-flex items-center px-6 py-4 border-b-2 text-sm font-medium',
                  pathname === '/login'
                    ? 'border-[#3B475A] text-[#3B475A]'
                    : 'border-transparent text-[#3B475A]/70 hover:text-[#3B475A] hover:border-[#3B475A]/30'
                )}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={cn(
                  'inline-flex items-center px-6 py-4 border-b-2 text-sm font-medium',
                  pathname === '/signup'
                    ? 'border-[#3B475A] text-[#3B475A]'
                    : 'border-transparent text-[#3B475A]/70 hover:text-[#3B475A] hover:border-[#3B475A]/30'
                )}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
