// app/components/Sidebar.jsx
"use client";


import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { useAuth } from './AuthContext';


/**
 * Sidebar: Fixed below the header, never above it, never scrolls with content.
 * - On desktop: fixed left, starts below header (top-16), full height minus header/footer.
 * - On mobile: togglable drawer, always below header.
 * - Never overlaps header, never scrolls with main content.
 */

/**
 * Sidebar: Modern, fixed, collapsible, and mobile-friendly navigation.
 * - Active link highlighting, SVG icons, clean hover, no duplication.
 * - Hamburger for mobile, collapsible for desktop (future-ready).
 * - Fully documented and accessible.
 */


function Sidebar() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { roles, user, loading } = useAuth();

  // Define links for each role
  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/admin/products', label: 'Products', icon: ShoppingBagIcon },
    { href: '/admin/orders', label: 'Orders', icon: ClipboardDocumentListIcon },
    { href: '/admin/users', label: 'Users', icon: UsersIcon },
    { href: '/admin/analytics', label: 'Analytics', icon: ChartBarIcon },
    { href: '/admin/settings', label: 'Settings', icon: Cog6ToothIcon },
  ];
  const userLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/products', label: 'Products', icon: ShoppingBagIcon },
    { href: '/cart', label: 'Cart', icon: ClipboardDocumentListIcon },
    { href: '/profile', label: 'Profile', icon: UsersIcon },
  ];
  const guestLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/products', label: 'Products', icon: ShoppingBagIcon },
    { href: '/auth/sign-in', label: 'Sign In', icon: UsersIcon },
  ];

  let navLinks = [];
  let showAdminSection = false;
  let showUserSection = false;
  let showGuestSection = false;
  if (roles?.includes('admin')) {
    navLinks = adminLinks;
    showAdminSection = true;
  } else if (user) {
    navLinks = userLinks;
    showUserSection = true;
  } else {
    navLinks = guestLinks;
    showGuestSection = true;
  }


  // Show loading skeleton while auth/roles are loading
  if (loading) {
    return (
      <aside
        className="fixed left-0 top-16 h-[calc(100vh-4rem-3rem)] w-64 bg-white shadow-lg z-40 animate-pulse"
        aria-label="Sidebar loading"
      >
        <div className="px-4 py-6">
          <div className="h-8 w-32 bg-green-100 rounded mb-4" />
          <div className="h-6 w-40 bg-green-50 rounded mb-2" />
          <div className="h-6 w-28 bg-green-50 rounded mb-2" />
          <div className="h-6 w-36 bg-green-50 rounded mb-2" />
        </div>
      </aside>
    );
  }

  // If no links, hide sidebar entirely
  if (!showAdminSection && !showUserSection && !showGuestSection) {
    return null;
  }

  return (
    <>
      <aside
        className={`
          fixed z-40 md:z-40
          top-0 left-0 md:top-16
          h-screen md:h-[calc(100vh-4rem-3rem)]
          w-4/5 max-w-xs md:w-64 md:max-w-none
          bg-white dark:bg-gray-950 dark:text-white shadow-2xl md:shadow-lg
          transition-all duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:block
          ${collapsed ? 'md:w-16' : 'md:w-64'}
          will-change-transform will-change-width
        `}
        style={{ minHeight: 0 }}
        aria-label="Sidebar"
      >
        {/* Collapse/Expand button for desktop only */}
        <div className="hidden md:flex items-center justify-between px-2 py-2 border-b border-green-100">
          {/* User avatar only when expanded, icon only when collapsed */}
          {user && (
            <div className="flex items-center gap-2 w-full">
              <div className="bg-green-200 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  (user.user_metadata?.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()
                )}
              </div>
              {!collapsed && (
                <span className="text-green-900 font-semibold text-sm">Hello, {user.user_metadata?.first_name || user.email?.split('@')[0]}</span>
              )}
            </div>
          )}
          {/* Collapse button: vertical center, right edge */}
        </div>
        {/* Collapse button absolutely positioned at right edge, vertical center */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-50 w-8 h-8 bg-green-100 border border-green-300 rounded-full shadow hover:bg-green-200 focus:outline-none transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setCollapsed(!collapsed); }}
        >
          {collapsed ? (
            <span aria-hidden="true">&#9654;</span>
          ) : (
            <span aria-hidden="true">&#9664;</span>
          )}
  </button>
        {/* Mobile Sidebar header: user info and close button, styled for mobile */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-green-100 bg-white sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="bg-green-200 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                (user?.user_metadata?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()
              )}
            </div>
            <span className="text-green-900 font-semibold text-base">{user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Guest'}</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-green-700 text-3xl font-bold focus:outline-none active:scale-95 transition-transform duration-150"
            aria-label="Close sidebar"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(false); }}
            style={{ touchAction: 'manipulation' }}
          >
            ×
          </button>
        </div>
  <nav className={`flex flex-col gap-3 p-4 ${collapsed ? 'items-center' : ''}`} role="navigation" aria-label="Sidebar navigation">
          {showAdminSection && (
            <>
              {!collapsed && <div className="text-xs text-green-500 font-bold uppercase px-2 pt-2 pb-1">Admin</div>}
              {adminLinks.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-2 rounded font-medium transition-colors text-base
                      ${isActive ? 'bg-green-200 text-green-900 font-bold border-l-4 border-green-600 shadow-sm' : 'text-green-900 hover:bg-green-50'}
                      focus:outline-none focus:bg-green-200`}
                    tabIndex={0}
                    aria-current={isActive ? 'page' : undefined}
                    title={link.label}
                  >
                    {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                    {!collapsed && <span>{link.label}</span>}
                  </Link>
                );
              })}
              {!collapsed && <hr className="my-2 border-green-200" />}
            </>
          )}
          {showUserSection && (
            <>
              {!collapsed && <div className="text-xs text-green-500 font-bold uppercase px-2 pt-2 pb-1">User</div>}
              {userLinks.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-2 rounded font-medium transition-colors text-base
                      ${isActive ? 'bg-green-200 text-green-900 font-bold border-l-4 border-green-600 shadow-sm' : 'text-green-900 hover:bg-green-50'}
                      focus:outline-none focus:bg-green-200`}
                    tabIndex={0}
                    aria-current={isActive ? 'page' : undefined}
                    title={link.label}
                  >
                    {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                    {!collapsed && <span>{link.label}</span>}
                  </Link>
                );
              })}
              {!collapsed && <hr className="my-2 border-green-200" />}
            </>
          )}
          {showGuestSection && (
            <>
              {!collapsed && <div className="text-xs text-green-500 font-bold uppercase px-2 pt-2 pb-1">Guest</div>}
              {guestLinks.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-2 rounded font-medium transition-colors text-base
                      ${isActive ? 'bg-green-200 text-green-900 font-bold border-l-4 border-green-600 shadow-sm' : 'text-green-900 hover:bg-green-50'}
                      focus:outline-none focus:bg-green-200`}
                    tabIndex={0}
                    aria-current={isActive ? 'page' : undefined}
                    title={link.label}
                  >
                    {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                    {!collapsed && <span>{link.label}</span>}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </aside>
      {/* Overlay for mobile drawer */}
      {/* Overlay only on mobile when drawer is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
          aria-label="Sidebar overlay"
        />
      )}
    </>
  );
}

export default Sidebar;
