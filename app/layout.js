// app/layout.js


import React from 'react';
import '../styles/globals.css';
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import { NotificationsProvider } from './components/NotificationsContext';
import Header from './components/Header';
import Footer from './components/Footer';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>FreshMart Grocery Store</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <NotificationsProvider>
            <CartProvider>
              <Header />
              {children}
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
import FloatingCart from './components/FloatingCart';
