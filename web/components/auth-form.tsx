'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerUser, loginUser } from '@/lib/auth';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (mode === 'signup') {
      const success = registerUser(nickname, password);
      if (success) {
        // Auto-login after successful registration
        loginUser(nickname, password);
        router.push('/profile');
      } else {
        setError('Username already exists');
      }
    } else {
      const success = loginUser(nickname, password);
      if (success) {
        router.push('/profile');
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
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
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button type="submit" className="w-full">
        {mode === 'login' ? 'Sign In' : 'Sign Up'}
      </Button>
    </form>
  );
}
