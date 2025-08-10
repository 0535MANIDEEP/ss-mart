// ProtectedRoute.jsx
"use client";
import React from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;
  if (!user) {
    router.push('/auth/sign-in');
    return null;
  }
  if (requiredRole && !hasRole(requiredRole)) {
    router.push('/access-denied');
    return null;
  }
  return children;
}
