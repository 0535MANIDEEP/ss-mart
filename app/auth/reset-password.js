"use client";
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password reset email sent!');
    }
    setLoading(false);
  }

  return (
    <main style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f6fff6', minHeight: '100vh', color: '#222' }}>
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(67,160,71,0.08)', border: '1px solid #e0f2f1' }}>
        <h1 style={{ color: '#43a047', fontWeight: 700, fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Reset Password</h1>
        <form onSubmit={handleReset}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047' }} />
          </div>
          {error && <div style={{ color: '#d32f2f', marginBottom: '1rem' }}>{error}</div>}
          {success && <div style={{ color: '#388e3c', marginBottom: '1rem' }}>{success}</div>}
          <button type="submit" disabled={loading} style={{ background: '#43a047', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer', width: '100%' }}>
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a href="/auth/sign-in" style={{ color: '#43a047', textDecoration: 'underline' }}>Back to Sign In</a>
        </div>
      </div>
    </main>
  );
}
