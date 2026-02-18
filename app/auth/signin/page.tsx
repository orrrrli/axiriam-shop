'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Coffee, Wind as Wing } from 'lucide-react';
import { setDemoSession } from '@/lib/demoAuth';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // DEMO MODE: Use demo authentication
      if (DEMO_MODE) {
        const res = await fetch('/api/auth/demo-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          setDemoSession({ user: data.user });
          toast.success('Signed in successfully! (Demo Mode)');
          router.push('/');
          router.refresh();
        } else {
          toast.error(data.error || 'Invalid credentials');
        }
        setLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Signed in successfully!');
        router.push('/');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="relative">
              <Coffee className="h-12 w-12 text-brown-700" />
              <Wing className="h-7 w-7 text-cream-500 absolute -top-1 -right-2 transform rotate-12" />
              <Wing className="h-7 w-7 text-cream-500 absolute -top-1 -left-2 transform -scale-x-100 rotate-12" />
            </div>
            <span className="ml-3 text-3xl font-heading font-semibold text-brown-800">Bean Haven Café</span>
          </Link>
          <h1 className="text-2xl font-heading">Sign In</h1>
          <p className="text-brown-700 mt-2">Welcome back! Please sign in to your account.</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-brown-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-brown-700 mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-brown-700">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-brown-600 hover:text-brown-800 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
