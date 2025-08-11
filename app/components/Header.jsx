"use client";
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { CartContext } from './CartContext';
import { useAuth } from './AuthContext';
import NotificationsIcon from './NotificationsIcon';
import NotificationsDropdown from './NotificationsDropdown';
import { usePathname } from 'next/navigation';
import { ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../providers';

export default function Header() {
  const { items } = useContext(CartContext);
  const { user, loading, firstName } = useAuth();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const { dark, setDark } = useTheme();

  function getPageTitle() {
    if (pathname === '/') return 'Home';
    if (pathname.startsWith('/products')) return 'Products';
    if (pathname.startsWith('/cart')) return 'Cart';
    if (pathname.startsWith('/admin/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/admin/orders')) return 'Orders';
    if (pathname.startsWith('/admin/users')) return 'Users';
    if (pathname.startsWith('/admin/analytics')) return 'Analytics';
    if (pathname.startsWith('/profile')) return 'Profile';
    return '';
  }

  return (
    <header className="bg-green-800 text-white shadow-md h-16 sticky top-0 z-30 flex items-center w-full dark:bg-gray-950 dark:text-white transition-colors duration-300">
      {/* Theme toggle: single professional toggle button */}
      <button
        className={`ml-2 sm:ml-4 p-2 rounded-full border-2 transition-colors duration-200 focus:outline-none ${dark ? 'bg-gray-800 border-yellow-400 text-yellow-200 hover:bg-gray-700' : 'bg-green-200 border-green-600 text-green-800 hover:bg-green-300'}`}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setDark(d => !d)}
      >
        {dark ? (
          // Moon icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
        ) : (
          // Sun icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>
      <div className="relative w-full h-full flex items-center">
        {/* Mobile menu icon: absolute, never overlaps logo */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-40 md:hidden flex items-center"></div>
        {/* Logo and site name: always visible, never overlapped */}
        <div className="flex items-center gap-2 pl-16 md:pl-0 h-full min-w-0">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 10-8 0v4M5 11h14l-1.38 9.03A2 2 0 0115.64 22H8.36a2 2 0 01-1.98-1.97L5 11z" /></svg>
            <span className="font-bold text-lg sm:text-2xl tracking-wide truncate block max-w-[120px] xs:max-w-[160px] sm:max-w-none">FreshMart</span>
          </Link>
        </div>
        {/* Center: Dynamic page title */}
        <div className="flex-1 flex justify-center items-center min-w-0">
          <span className="text-base sm:text-xl font-semibold capitalize truncate w-full text-center block max-w-[120px] xs:max-w-[180px] sm:max-w-none">{getPageTitle()}</span>
        </div>
        {/* Right: Notification bell, greeting, auth icons */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 relative min-w-0 pr-2 sm:pr-4">
          {user && (
            <button
              type="button"
              aria-label="Show notifications"
              className="focus:outline-none ml-2 sm:ml-4"
              onClick={() => setNotifOpen(v => !v)}
            >
              <NotificationsIcon className="h-6 w-6" />
            </button>
          )}
          {user && firstName && (
            <span className="ml-2 sm:ml-4 font-medium hidden xs:inline truncate max-w-[60px] sm:max-w-none">Hi, {firstName}</span>
          )}
          {loading ? null : user ? (
            <Link
              href="/auth/sign-out"
              className="ml-2 sm:ml-4 flex items-center group"
              title="Log Out"
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6 text-white group-hover:text-green-200 transition" />
            </Link>
          ) : (
            <Link
              href="/auth/sign-in"
              className="ml-2 sm:ml-4 flex items-center group"
              title="Sign In"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-white group-hover:text-green-200 transition" />
            </Link>
          )}
        </div>
      </div>
      {/* Notification dropdown: covers width on mobile if needed */}
      <NotificationsDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
    </header>
  );
}
