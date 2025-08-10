"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('Verifying...');
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setMessage('Verification failed: ' + error.message);
      } else if (data?.user?.email_confirmed_at) {
        setMessage('Email verified! Redirecting...');
        setTimeout(() => router.push('/'), 2000);
      } else {
        setMessage('Please check your email for the verification link.');
      }
    }
    verify();
  }, [router]);

  return (
    <main style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f6fff6', minHeight: '100vh', color: '#222', textAlign: 'center', paddingTop: '4rem' }}>
      <h1 style={{ color: '#43a047', fontWeight: 700, fontSize: '2rem' }}>Email Verification</h1>
      <p>{message}</p>
    </main>
  );
}
