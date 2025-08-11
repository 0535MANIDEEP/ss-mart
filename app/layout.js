// app/layout.js



import React from 'react';
import '../styles/globals.css';
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import { NotificationsProvider } from './components/NotificationsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCart from './components/FloatingCart';

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
      <body className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <AuthProvider>
          <NotificationsProvider>
            <CartProvider>
              <Header />
              <main className="flex-1 w-full mx-auto px-4 sm:px-6 md:px-8 py-6">
                {children}
              </main>
              <Footer />
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
