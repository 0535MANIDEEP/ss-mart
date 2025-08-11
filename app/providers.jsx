"use client";
import React, { useState, useEffect, createContext, useContext } from 'react';
// Theme context for global dark mode
export const ThemeContext = createContext();
export function useTheme() { return useContext(ThemeContext); }
// Sidebar context for global collapse state
export const SidebarContext = createContext();
export function useSidebar() { return useContext(SidebarContext); }
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import { NotificationsProvider } from './components/NotificationsContext';

export default function Providers({ children }) {
  // Theme state
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setDark(true);
    else if (saved === 'light') setDark(false);
    else setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);
  // Sidebar collapse state
  const [collapsed, setCollapsed] = useState(false);
  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <AuthProvider>
          <NotificationsProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </NotificationsProvider>
        </AuthProvider>
      </SidebarContext.Provider>
    </ThemeContext.Provider>
  );
}
