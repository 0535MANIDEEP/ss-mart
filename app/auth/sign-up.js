// app/auth/sign-up.js
"use client";
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      router.push('/auth/verify-email');
    }
  }

  async function handleSocialLogin(provider) {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <main style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f6fff6', minHeight: '100vh', color: '#222' }}>
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(67,160,71,0.08)', border: '1px solid #e0f2f1' }}>
        <h1 style={{ color: '#43a047', fontWeight: 700, fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Sign Up</h1>
        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047' }} />
          </div>
          {error && <div style={{ color: '#d32f2f', marginBottom: '1rem' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ background: '#43a047', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer', width: '100%' }}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div style={{ margin: '1rem 0', textAlign: 'center' }}>
          <button type="button" onClick={() => handleSocialLogin('google')} style={{ background: '#fff', color: '#43a047', border: '1px solid #43a047', padding: '0.5rem 1rem', borderRadius: 8, fontWeight: 500, marginRight: 8, cursor: 'pointer' }}>Sign up with Google</button>
          <button type="button" onClick={() => handleSocialLogin('facebook')} style={{ background: '#fff', color: '#43a047', border: '1px solid #43a047', padding: '0.5rem 1rem', borderRadius: 8, fontWeight: 500, cursor: 'pointer' }}>Sign up with Facebook</button>
        </div>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a href="/auth/sign-in" style={{ color: '#43a047', textDecoration: 'underline' }}>Already have an account? Sign In</a>
        </div>
        <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
          <a href="/auth/reset-password" style={{ color: '#388e3c', textDecoration: 'underline' }}>Forgot password?</a>
        </div>
      </div>
    </main>
  );
}
