'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerUser, loginUser } from '@/lib/api';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // For signup, validate all fields
        if (!nickname || !email || !password) {
          setError('Please fill in all fields');
          return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError('Please enter a valid email address');
          return;
        }
        
        const success = await registerUser(nickname, password, email);
        if (success) {
          router.push('/profile');
        } else {
          setError('Registration failed. Username or email may already be in use.');
        }
      } else {
        // For login, validate email and password
        if (!email || !password) {
          setError('Please fill in all fields');
          return;
        }
        
        const success = await loginUser(email, password);
        if (success) {
          router.push('/profile');
        } else {
          setError('Invalid email or password');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {mode === 'signup' && (
        <div className="space-y-2">
          <label htmlFor="nickname" className="block text-sm font-medium text-[#3B475A]">
            Nickname
          </label>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            className="text-[#3B475A]"
            disabled={isLoading}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-[#3B475A]">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="text-[#3B475A]"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-[#3B475A]">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="text-[#3B475A]"
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
      </Button>
    </form>
  );
}
