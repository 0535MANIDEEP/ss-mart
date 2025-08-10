// app/components/Header.jsx
"use client";

import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext';
import { useAuth } from './AuthContext';
import NotificationsIcon from './NotificationsIcon';
import NotificationsDropdown from './NotificationsDropdown';


export default function Header() {
  const { items } = useContext(CartContext);
  const { user, loading } = useAuth();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header style={{ background: '#43a047', color: '#fff', padding: '1rem 0', marginBottom: '2rem', position: 'relative' }}>
      <nav style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: '1.3rem', letterSpacing: 1 }}>FreshMart</div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Home</a>
          <a href="/products" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Products</a>
          <a href="/cart" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, position: 'relative' }}>
            Cart
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -8, right: -18, background: '#fff', color: '#43a047', borderRadius: '50%', padding: '2px 8px', fontSize: '0.9rem', fontWeight: 700 }}>
                {cartCount}
              </span>
            )}
          </a>
          <NotificationsIcon onClick={() => setNotifOpen(v => !v)} />
          {loading ? null : user ? (
            <>
              <span style={{ color: '#fff', fontWeight: 500, marginLeft: '1rem' }}>Hi, {user.email}</span>
              <a href="/auth/sign-out" style={{ color: '#fff', textDecoration: 'underline', marginLeft: '1rem' }}>Sign Out</a>
            </>
          ) : (
            <a href="/auth/sign-in" style={{ color: '#fff', textDecoration: 'underline', marginLeft: '1rem' }}>Sign In</a>
          )}
        </div>
      </nav>
      <NotificationsDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
    </header>
  );
}
