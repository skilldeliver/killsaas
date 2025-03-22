'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getCurrentUser, logoutUser, isAuthenticated } from '@/lib/auth';
import { Menu, X } from 'lucide-react';

const tabs = [
  { name: 'Board', href: '/board/suggestions' },
  { name: 'Posts', href: '/posts' },
  { name: 'Manifesto', href: '/manifesto' },
  { name: 'Analytics', href: '/analytics' },
];

export function NavTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in on client side
    setIsLoggedIn(isAuthenticated());
    const user = getCurrentUser();
    if (user) {
      setNickname(user.nickname);
    }
    // Close mobile menu when changing pages
    setMobileMenuOpen(false);
  }, [pathname]); // Re-check when pathname changes
  
  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    router.push('/');
  }

  const renderNavLinks = () => {
    return (
      <>
        <div className="flex flex-col md:flex-row">
          {tabs.map((tab) => {
            const isActive = tab.href === '/board/suggestions' 
              ? pathname.startsWith('/board/')
              : pathname === tab.href;
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  'inline-flex items-center px-6 py-4 text-sm font-medium',
                  'md:border-b-2',
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

        <div className="flex flex-col md:flex-row">
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className={cn(
                  'inline-flex items-center px-6 py-4 text-sm font-medium',
                  'md:border-b-2',
                  pathname === '/profile'
                    ? 'border-[#3B475A] text-[#3B475A]'
                    : 'border-transparent text-[#3B475A]/70 hover:text-[#3B475A] hover:border-[#3B475A]/30'
                )}
              >
                {nickname || 'Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-6 py-4 border-transparent text-sm font-medium text-[#3B475A]/70 hover:text-[#3B475A] hover:border-[#3B475A]/30 md:border-b-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  'inline-flex items-center px-6 py-4 text-sm font-medium',
                  'md:border-b-2',
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
                  'inline-flex items-center px-6 py-4 text-sm font-medium',
                  'md:border-b-2',
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
      </>
    );
  };

  return (
    <div className="border-b">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex max-w-screen-xl mx-auto px-4 justify-between">
        {renderNavLinks()}
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#3B475A] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <div className="text-sm font-medium text-[#3B475A]">
            {isLoggedIn ? nickname || 'Menu' : 'Menu'}
          </div>
          <div className="w-6"></div> {/* Empty div for balance */}
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="px-2 pt-2 pb-4 border-t">
            {renderNavLinks()}
          </div>
        )}
      </nav>
    </div>
  );
}
