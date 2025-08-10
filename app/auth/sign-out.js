// app/auth/sign-out.js
"use client";
import React, { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignOutPage() {
  const router = useRouter();
  useEffect(() => {
    async function signOut() {
      await supabase.auth.signOut();
      router.push('/');
    }
    signOut();
  }, [router]);

  return (
    <main style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f6fff6', minHeight: '100vh', color: '#222', textAlign: 'center', paddingTop: '4rem' }}>
      <h1 style={{ color: '#43a047', fontWeight: 700, fontSize: '2rem' }}>Signing Out...</h1>
    </main>
  );
}
