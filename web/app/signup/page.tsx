'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AuthForm } from '@/components/auth-form';

export default function Signup() {
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
          Create Account
        </h1>
        <p className="text-gray-500">Join KillSaaS to post and track services</p>
      </div>
      
      <AuthForm mode="signup" />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
