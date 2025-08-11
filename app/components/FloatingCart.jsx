// app/components/FloatingCart.jsx
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
        className="fixed bottom-8 right-8 bg-green-700 text-white rounded-full w-14 h-14 shadow-lg border-none font-bold text-xl cursor-pointer z-[1000] flex items-center justify-center focus:outline-none hover:bg-green-800 transition-colors"
        aria-label="View cart"
        onClick={() => setOpen(true)}
      >
        <span className="relative">
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-white text-green-700 rounded-full px-2 py-0.5 text-xs font-bold border border-green-700">
              {cartCount}
            </span>
          )}
        </span>
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
