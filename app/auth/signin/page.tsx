'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { setDemoSession } from '@/lib/demoAuth';
import { getSession } from 'next-auth/react';
import { TransitionLink } from '@/components/transitions/NavigationEvents';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export default function SignInPage(): React.ReactElement {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState<{ name: string; isAdmin: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setAuthStatus(null);

    try {
      if (DEMO_MODE) {
        const res = await fetch('/api/auth/demo-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json() as { user?: unknown; error?: string };

        if (res.ok) {
          setDemoSession({ user: data.user });
          const demoUser = data.user as { role?: string; name?: string };
          const isAdmin = demoUser?.role === 'admin';
          setRedirecting({ name: demoUser?.name?.split(' ')[0] ?? 'Admin', isAdmin });
          const redirectUrl = isAdmin ? '/admin/dashboard' : '/';
          setTimeout(() => { router.push(redirectUrl); router.refresh(); }, 2000);
        } else {
          setAuthStatus({ type: 'error', message: data.error ?? 'Credenciales inválidas' });
          toast.error(data.error ?? 'Credenciales inválidas');
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
        setAuthStatus({ type: 'error', message: result.error });
        toast.error(result.error);
      } else {
        const updatedSession = await getSession();
        const isAdmin = updatedSession?.user?.role === 'admin';
        const name = updatedSession?.user?.name?.split(' ')[0] ?? '';
        setRedirecting({ name, isAdmin });
        const redirectUrl = isAdmin ? '/admin/dashboard' : '/';
        setTimeout(() => router.push(redirectUrl), 2000);
      }
    } catch {
      setAuthStatus({ type: 'error', message: 'Algo salió mal. Intenta de nuevo.' });
      toast.error('Algo salió mal');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 16px',
    fontSize: '1.4rem',
    fontFamily: 'var(--font-geist)',
    border: '1px solid rgba(0,0,0,0.12)',
    borderRadius: '10px',
    outline: 'none',
    color: '#101010',
    background: '#fafafa',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.style.borderColor = '#101010';
    e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.06)';
    e.target.style.background = 'white';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.style.borderColor = 'rgba(0,0,0,0.12)';
    e.target.style.boxShadow = 'none';
    e.target.style.background = '#fafafa';
  };

  if (redirecting) {
    return (
      <div
        className="shop-layout"
        style={{
          position: 'fixed', inset: 0, background: '#101010',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.4rem',
          animation: 'fadeIn 0.4s ease forwards', zIndex: 9999,
        }}
      >
        {/* Logo */}
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '2.4rem', fontWeight: 700, letterSpacing: '0.16em', color: 'white' }}>
          AXIRIAM
        </span>

        {/* Greeting */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '1.8rem', fontWeight: 700, color: 'white', margin: 0 }}>
            Bienvenido{redirecting.name ? `, ${redirecting.name}` : ''}
          </p>
          <p style={{ fontFamily: 'var(--font-geist)', fontSize: '1.3rem', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>
            {redirecting.isAdmin ? 'Entrando al panel de administración...' : 'Preparando tu experiencia...'}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ width: '120px', height: '2px', background: 'rgba(255,255,255,0.12)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'white', borderRadius: '9999px', animation: 'fullWidth 1.8s ease forwards' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="shop-layout"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#f7f7f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 16px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <TransitionLink href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '0.12em', color: '#101010' }}>
              AXIRIAM
            </span>
          </TransitionLink>
          <p style={{ fontFamily: 'var(--font-geist)', fontSize: '1.25rem', color: 'rgba(0,0,0,0.45)', marginTop: '4px' }}>
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 24px rgba(0,0,0,0.06)', padding: '24px' }}>

          {authStatus && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px', borderRadius: '10px',
              fontSize: '1.3rem', fontFamily: 'var(--font-geist)', fontWeight: 500,
              background: authStatus.type === 'success' ? 'rgba(59,150,32,0.08)' : 'rgba(247,45,45,0.08)',
              color: authStatus.type === 'success' ? '#2d7a18' : '#d42020',
              border: `1px solid ${authStatus.type === 'success' ? 'rgba(59,150,32,0.2)' : 'rgba(247,45,45,0.2)'}`,
            }}>
              {authStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: '1.2rem', fontWeight: 600, color: '#101010', marginBottom: '6px' }}>
                Correo electrónico
              </label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu@correo.com" required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: '1.2rem', fontWeight: 600, color: '#101010', marginBottom: '6px' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••" required
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', padding: '4px' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px 24px', fontSize: '1.4rem', fontFamily: 'var(--font-montserrat)', fontWeight: 600, color: 'white', background: loading ? 'rgba(0,0,0,0.5)' : '#101010', border: 'none', borderRadius: '9999px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s ease', letterSpacing: '0.02em' }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Entrando...</> : <>Entrar <ArrowRight size={15} /></>}
            </button>
          </form>

          {/* Divider + Google */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
            <span style={{ fontFamily: 'var(--font-geist)', fontSize: '1.2rem', color: 'rgba(0,0,0,0.35)' }}>o continúa con</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
          </div>

          <button type="button" disabled
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px', fontSize: '1.3rem', fontFamily: 'var(--font-geist)', fontWeight: 500, color: 'rgba(0,0,0,0.5)', background: '#fafafa', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', cursor: 'not-allowed', opacity: 0.6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
        </div>

        {/* ¿Eres nuevo? */}
        <div style={{ marginTop: '14px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '1.3rem', fontWeight: 700, color: '#101010', margin: 0 }}>
              ¿Eres nuevo en Axiriam?
            </p>
            <p style={{ fontFamily: 'var(--font-geist)', fontSize: '1.15rem', color: 'rgba(0,0,0,0.4)', margin: '2px 0 0' }}>
              Crea tu cuenta gratis
            </p>
          </div>
          <TransitionLink href="/auth/signup"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '9px 20px', fontSize: '1.3rem', fontFamily: 'var(--font-montserrat)', fontWeight: 600, color: '#101010', background: 'white', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '9999px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Crear cuenta
          </TransitionLink>
        </div>

      </div>
    </div>
  );
}
