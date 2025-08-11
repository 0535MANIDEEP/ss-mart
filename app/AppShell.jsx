"use client";
import React from 'react';
import { useSidebar } from './providers';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import FloatingCart from './components/FloatingCart';

export default function AppShell({ children }) {
  const { collapsed } = useSidebar();
  // Main content margin matches sidebar width
  const mainMargin = collapsed ? 'md:ml-16' : 'md:ml-64';
  return (
    <>
      <Header />
      <div className="relative w-full pt-16">
        <Sidebar />
        <main className={`ml-0 ${mainMargin} px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto`}
          style={{
            minHeight: 'calc(100vh - 4rem - 3rem)',
            maxHeight: 'calc(100vh - 4rem - 3rem)',
            transition: 'margin-left 0.3s',
          }}
        >
          <div
            className="hero-scrollbar h-full max-h-full overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#22c55e #f3f4f6', overscrollBehavior: 'contain' }}
          >
            {children}
          </div>
        </main>
      </div>
      <Footer />
      <div id="floating-cart-root">
        <FloatingCart />
      </div>
    </>
  );
}
