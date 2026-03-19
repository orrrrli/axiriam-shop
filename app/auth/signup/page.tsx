'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { TransitionLink } from '@/components/transitions/NavigationEvents';

type AuthStatus = { type: 'success' | 'error'; message: string };

function PasswordStrength({ password }: { password: string }): React.ReactElement | null {
  if (!password) return null;
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
  const score = checks.filter(Boolean).length;
  const levels = [
    { label: 'Muy débil', color: '#ef4444' },
    { label: 'Débil',     color: '#f97316' },
    { label: 'Regular',   color: '#eab308' },
    { label: 'Fuerte',    color: '#22c55e' },
  ];
  const level = levels[score - 1] ?? levels[0];
  return (
    <div style={{ marginTop: '6px' }}>
      <div style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '9999px', background: i <= score ? level.color : 'rgba(0,0,0,0.08)', transition: 'background 0.3s ease' }} />
        ))}
      </div>
      <span style={{ fontFamily: 'var(--font-geist)', fontSize: '1.1rem', color: level.color }}>{level.label}</span>
    </div>
  );
}

export default function SignUpPage(): React.ReactElement {
  const router = useRouter();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
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

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-montserrat)',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#101010',
    marginBottom: '5px',
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

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setAuthStatus(null);
    if (formData.password !== formData.confirmPassword) {
      setAuthStatus({ type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }
    if (formData.password.length < 8) {
      setAuthStatus({ type: 'error', message: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });
      const data = await res.json() as { error?: string };
      if (res.ok) {
        setAuthStatus({ type: 'success', message: '¡Cuenta creada! Redirigiendo...' });
        toast.success('¡Bienvenido a Axiriam!');
        setTimeout(() => router.push('/auth/signin'), 1500);
      } else {
        setAuthStatus({ type: 'error', message: data.error ?? 'No se pudo crear la cuenta' });
        toast.error(data.error ?? 'No se pudo crear la cuenta');
      }
    } catch {
      setAuthStatus({ type: 'error', message: 'Algo salió mal. Intenta de nuevo.' });
      toast.error('Algo salió mal');
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <TransitionLink href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '0.12em', color: '#101010' }}>
              AXIRIAM
            </span>
          </TransitionLink>
          <p style={{ fontFamily: 'var(--font-geist)', fontSize: '1.25rem', color: 'rgba(0,0,0,0.45)', marginTop: '4px' }}>
            Crea tu cuenta
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 24px rgba(0,0,0,0.06)', padding: '20px 24px' }}>

          {authStatus && (
            <div style={{
              marginBottom: '14px', padding: '10px 14px', borderRadius: '10px',
              fontSize: '1.3rem', fontFamily: 'var(--font-geist)', fontWeight: 500,
              background: authStatus.type === 'success' ? 'rgba(59,150,32,0.08)' : 'rgba(247,45,45,0.08)',
              color: authStatus.type === 'success' ? '#2d7a18' : '#d42020',
              border: `1px solid ${authStatus.type === 'success' ? 'rgba(59,150,32,0.2)' : 'rgba(247,45,45,0.2)'}`,
            }}>
              {authStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Nombre + Apellido */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Tu nombre" required minLength={2} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
              <div>
                <label style={labelStyle}>Apellido</label>
                <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Tu apellido" required minLength={2} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '10px' }}>
              <label style={labelStyle}>Correo electrónico</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu@correo.com" required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '10px' }}>
              <label style={labelStyle}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres" required minLength={8}
                  style={{ ...inputStyle, paddingRight: '44px' }} onFocus={handleFocus} onBlur={handleBlur} />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', padding: '4px' }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <PasswordStrength password={formData.password} />
            </div>

            {/* Confirm */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Confirmar contraseña</label>
              <div style={{ position: 'relative' }}>
                <input type={showConfirm ? 'text' : 'password'} value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repite tu contraseña" required
                  style={{ ...inputStyle, paddingRight: '44px', borderColor: formData.confirmPassword && formData.confirmPassword !== formData.password ? 'rgba(239,68,68,0.6)' : 'rgba(0,0,0,0.12)' }}
                  onFocus={handleFocus} onBlur={handleBlur} />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', padding: '4px' }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                <span style={{ fontFamily: 'var(--font-geist)', fontSize: '1.1rem', color: '#ef4444', marginTop: '3px', display: 'block' }}>
                  Las contraseñas no coinciden
                </span>
              )}
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px 24px', fontSize: '1.4rem', fontFamily: 'var(--font-montserrat)', fontWeight: 600, color: 'white', background: loading ? 'rgba(0,0,0,0.5)' : '#101010', border: 'none', borderRadius: '9999px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s ease', letterSpacing: '0.02em' }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creando cuenta...</> : <>Crear cuenta <ArrowRight size={15} /></>}
            </button>
          </form>
        </div>

        {/* Iniciar sesión */}
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-geist)', fontSize: '1.3rem', color: 'rgba(0,0,0,0.45)' }}>
            ¿Ya tienes cuenta?
          </span>
          <TransitionLink href="/auth/signin"
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: '1.3rem', fontWeight: 700, color: '#101010', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            Iniciar sesión
          </TransitionLink>
        </div>

      </div>
    </div>
  );
}
