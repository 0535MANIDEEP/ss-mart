// NavBar.jsx
"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';

export default function NavBar() {
  const { user, roles, signOut, loading } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-green-400 via-green-300 to-teal-200 px-4 py-3 flex justify-between items-center shadow-md sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <Link href="/" className="mr-4 font-bold text-green-900 text-lg tracking-wide hover:underline focus:outline-none">SS Mart</Link>
        {user && (
          <>
            <Link href="/products" className="mr-4 text-green-900 hover:text-green-700 transition-colors">Products</Link>
            <Link href="/cart" className="mr-4 text-green-900 hover:text-green-700 transition-colors">Cart</Link>
            <Link href="/profile" className="mr-4 text-green-900 hover:text-green-700 transition-colors">Profile</Link>
            {roles.includes('admin') && (
              <Link href="/admin/dashboard" className="mr-4 text-green-900 hover:text-green-700 transition-colors">Admin Dashboard</Link>
            )}
          </>
        )}
      </div>
      <div>
        {loading ? (
          <span className="text-green-900">Loading...</span>
        ) : user ? (
          <button
            onClick={signOut}
            className="bg-green-900 text-white border-none px-4 py-2 rounded hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            Logout
          </button>
        ) : (
          <Link href="/auth/sign-in" className="text-green-900 hover:text-green-700 transition-colors">Login</Link>
        )}
      </div>
    </nav>
  );
}
