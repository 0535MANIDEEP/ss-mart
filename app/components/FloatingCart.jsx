// app/components/FloatingCart.jsx
"use client";
import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext';
import CartDrawer from './CartDrawer';

export default function FloatingCart() {
  const { items } = useContext(CartContext);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: '#43a047',
          color: '#fff',
          borderRadius: '50%',
          width: 56,
          height: 56,
          boxShadow: '0 2px 8px rgba(67,160,71,0.18)',
          border: 'none',
          fontWeight: 700,
          fontSize: '1.3rem',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        aria-label="View cart"
        onClick={() => setOpen(true)}
      >
        🛒
        {cartCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#fff',
            color: '#43a047',
            borderRadius: '50%',
            padding: '2px 8px',
            fontSize: '0.9rem',
            fontWeight: 700,
          }}>
            {cartCount}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
