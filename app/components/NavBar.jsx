// NavBar.jsx
"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';

export default function NavBar() {
  const { user, roles, signOut, loading } = useAuth();

  return (
    <nav style={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link href="/" style={{ marginRight: '1rem', fontWeight: 'bold', color: '#155724' }}>SS Mart</Link>
        {user && (
          <>
            <Link href="/products" style={{ marginRight: '1rem', color: '#155724' }}>Products</Link>
            <Link href="/cart" style={{ marginRight: '1rem', color: '#155724' }}>Cart</Link>
            <Link href="/profile" style={{ marginRight: '1rem', color: '#155724' }}>Profile</Link>
            {roles.includes('admin') && (
              <Link href="/admin/dashboard" style={{ marginRight: '1rem', color: '#155724' }}>Admin Dashboard</Link>
            )}
          </>
        )}
      </div>
      <div>
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <button onClick={signOut} style={{ background: '#155724', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>Logout</button>
        ) : (
          <Link href="/auth/sign-in" style={{ color: '#155724' }}>Login</Link>
        )}
      </div>
    </nav>
  );
}
