// app/layout.js



import React from 'react';
import '../styles/globals.css';
import './styles/hero-scrollbar.css';
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import { NotificationsProvider } from './components/NotificationsContext';


// Main app layout: fixed header, sidebar, and footer. Content scrolls independently.
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCart from './components/FloatingCart';
import Sidebar from './components/Sidebar';


/**
 * RootLayout: Provides a fixed header, sidebar, and footer for the entire app.
 * - Header: fixed at the top, always visible, contains logo/title/nav.
 * - Sidebar: fixed/collapsible, only one per screen, never overlaps content.
 * - Footer: fixed at the bottom, minimal content.
 * - Main content (hero): scrolls independently, never hidden by header/footer/sidebar.
 * - All navigation is handled in Sidebar and Header, never duplicated.
 * - All styles use Tailwind CSS for consistency and maintainability.
 */
export default function RootLayout({ children }) {
  return (
  <html lang="en" className="font-sans text-gray-900 bg-gray-50">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>FreshMart Grocery Store</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" rel="stylesheet" />
      </head>
  <body className="w-full bg-gray-50 font-sans">
        <AuthProvider>
          <NotificationsProvider>
            <CartProvider>
              {/* Fixed header at the top */}
              <Header />
              {/* Layout grid: sidebar (fixed/collapsible), main content (scrollable), footer (fixed) */}
              <div className="relative w-full pt-16">
                {/* Sidebar: fixed below header, never above, never scrolls with content */}
                <Sidebar
                  links={[
                    { href: '/admin/dashboard', label: 'Dashboard' },
                    { href: '/admin/products', label: 'Products' },
                    { href: '/admin/orders', label: 'Orders' },
                    { href: '/admin/users', label: 'Users' },
                    { href: '/profile', label: 'Profile' },
                    { href: '/cart', label: 'Cart' },
                  ]}
                />
                {/* Main content area: no scroll, only hero section inside scrolls if needed */}
                <main className="ml-0 md:ml-64 px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto"
                  style={{
                    minHeight: 'calc(100vh - 4rem - 3rem)',
                    maxHeight: 'calc(100vh - 4rem - 3rem)',
                  }}
                >
                  {/* Hero section: scrollable if content overflows */}
                  {/* Hero section: scrollable with styled, thin scrollbar */}
                  <div
                    className="hero-scrollbar h-full max-h-full overflow-y-auto"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#22c55e #f3f4f6', overscrollBehavior: 'contain' }}
                  >
                    {children}
                  </div>
                </main>
              </div>
              {/* Fixed footer at the bottom */}
              <Footer />
              {/* Floating cart always available */}
              <div id="floating-cart-root">
                <FloatingCart />
              </div>
            </CartProvider>
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
