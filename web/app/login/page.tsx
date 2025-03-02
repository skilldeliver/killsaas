'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/api';
import { AuthForm } from '@/components/auth-form';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to profile
    const user = getCurrentUser();
    if (user) {
      router.push('/profile');
    }
  }, [router]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 min-h-[60vh]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-[family-name:var(--font-louize)] text-[#3B475A] mb-4">
          Sign In
        </h1>
        <p className="text-gray-500">Welcome back to KillSaaS</p>
      </div>
      
      <AuthForm mode="login" />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
