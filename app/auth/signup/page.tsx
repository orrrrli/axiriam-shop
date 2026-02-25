'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStatus(null);

    if (formData.password !== formData.confirmPassword) {
      setAuthStatus({ type: 'error', message: 'Passwords do not match' });
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setAuthStatus({ type: 'error', message: 'Password must be at least 8 characters' });
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAuthStatus({ type: 'success', message: 'Account created! Redirecting to sign in...' });
        toast.success('Account created! Please sign in.');
        setTimeout(() => router.push('/auth/signin'), 1500);
      } else {
        setAuthStatus({ type: 'error', message: data.error || 'Failed to create account' });
        toast.error(data.error || 'Failed to create account');
      }
    } catch {
      setAuthStatus({ type: 'error', message: 'Something went wrong' });
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-body flex items-center justify-center">
      <div className="w-[80rem] max-md:w-full max-md:px-[1.6rem]">
        <div className="flex border border-border max-md:flex-col animate-slide-up">
          {/* Left side — Form */}
          <div className="flex-1 p-[3rem]">
            {/* Status messages */}
            {authStatus && (
              <div
                className={`mb-[2rem] p-[1.2rem] text-[1.3rem] font-bold border
                  ${authStatus.type === 'success'
                    ? 'text-success border-success bg-success/10'
                    : 'text-danger border-danger bg-danger/10'
                  }`}
              >
                {authStatus.message}
              </div>
            )}

            <h3 className="text-heading text-[2rem] mb-[0.5rem]">Sign Up</h3>
            <p className="text-paragraph text-[1.3rem] mb-[2rem]">
              Create an account to get started.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-[1.5rem]">
                <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                  * Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input capitalize"
                  placeholder="Enter your full name"
                  required
                  minLength={4}
                />
              </div>
              <div className="mb-[1.5rem]">
                <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                  * Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  placeholder="test@example.com"
                  required
                />
              </div>
              <div className="mb-[1.5rem]">
                <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                  * Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input"
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                />
              </div>
              <div className="mb-[2rem]">
                <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                  * Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input"
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-between max-md:flex-col max-md:gap-[1rem]">
                <button
                  type="submit"
                  disabled={loading}
                  className="button max-md:w-full"
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                  {!loading && <ArrowRight size={14} className="ml-[0.5rem]" />}
                </button>
              </div>
            </form>
          </div>

          {/* Divider */}
          <div className="w-px bg-border flex items-center justify-center relative max-md:w-full max-md:h-px">
            <span className="bg-body px-[1rem] py-[0.5rem] text-gray-10 text-[1.2rem] absolute">
              OR
            </span>
          </div>

          {/* Right side — Social + Sign In redirect */}
          <div className="flex-1 p-[3rem] flex flex-col justify-center">
            <div className="mb-[3rem]">
              <h5 className="text-heading text-[1.4rem] mb-[1.5rem]">Sign up with</h5>

              {/* Social login buttons */}
              <button
                type="button"
                className="w-full flex items-center p-[1.2rem] mb-[1rem] border border-border bg-white text-heading text-[1.3rem] font-bold transition-all duration-300 hover:bg-body-alt relative"
                disabled
              >
                <svg className="w-[1.8rem] h-[1.8rem] absolute left-[1.2rem]" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="flex-grow text-center">Google</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center p-[1.2rem] border border-github bg-github text-white text-[1.3rem] font-bold transition-all duration-300 hover:opacity-90 relative"
                disabled
              >
                <svg className="w-[1.8rem] h-[1.8rem] absolute left-[1.2rem]" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="flex-grow text-center">GitHub</span>
              </button>
            </div>

            {/* Sign in message */}
            <div className="border-t border-border pt-[2rem] flex items-center justify-between max-md:flex-col max-md:text-center max-md:gap-[1rem]">
              <span className="text-paragraph text-[1.3rem]">
                Already have an account?
              </span>
              <Link href="/auth/signin" className="button button-muted">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
