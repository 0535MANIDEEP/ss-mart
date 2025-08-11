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
    <header className="bg-green-700 text-white shadow-md h-16 flex items-center sticky top-0 z-30">
      <nav className="w-full max-w-5xl mx-auto flex items-center justify-between px-4">
        <div className="font-bold text-xl tracking-wide">FreshMart</div>
        <div className="flex gap-8 items-center relative">
          <a href="/" className="hover:underline font-medium">Home</a>
          <a href="/products" className="hover:underline font-medium">Products</a>
          <a href="/cart" className="relative hover:underline font-medium">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-5 bg-white text-green-700 rounded-full px-2 py-0.5 text-xs font-bold border border-green-700">
                {cartCount}
              </span>
            )}
          </a>
          <button
            type="button"
            aria-label="Show notifications"
            className="focus:outline-none"
            onClick={() => setNotifOpen(v => !v)}
          >
            <NotificationsIcon />
          </button>
          {loading ? null : user ? (
            <>
              <span className="ml-2 font-medium">Hi, {user.email}</span>
              <a href="/auth/sign-out" className="ml-2 underline hover:text-green-200">Sign Out</a>
            </>
          ) : (
            <a href="/auth/sign-in" className="ml-2 underline hover:text-green-200">Sign In</a>
          )}
        </div>
      </nav>
      <NotificationsDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
    </header>
  );
}
