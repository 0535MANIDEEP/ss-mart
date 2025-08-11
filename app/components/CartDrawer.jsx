// app/components/CartDrawer.jsx
"use client";
import React, { useContext } from 'react';
import { CartContext } from './CartContext';

export default function CartDrawer({ open, onClose }) {
  const { items, removeFromCart, updateQuantity } = useContext(CartContext);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed top-0 right-0 w-[340px] h-screen bg-white shadow-2xl z-[2000] p-8 flex flex-col">
      <button
        className="absolute top-4 right-4 bg-transparent border-none text-2xl cursor-pointer text-green-700 hover:text-green-900 focus:outline-none"
        onClick={onClose}
        aria-label="Close cart"
      >
        ×
      </button>
      <h2 className="text-green-700 font-bold text-xl mb-4 text-center">Your Cart</h2>
      {items.length === 0 ? (
        <div className="text-gray-500 text-center mt-8">Your cart is empty.</div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {items.map(item => (
            <div key={item.id} className="flex items-center mb-4 border-b border-green-100 pb-4">
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-green-700 font-medium">${item.price}</div>
                <div className="flex items-center mt-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                    className="w-12 px-1 py-1 rounded border border-green-700 text-center mr-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                  <button
                    className="bg-red-600 text-white border-none rounded px-3 py-1 text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-right font-bold text-lg text-green-700 mt-4">
        Subtotal: ${subtotal.toFixed(2)}
      </div>
      {items.length > 0 && (
        <a
          href="/checkout"
          className="bg-green-700 text-white py-3 px-6 rounded-lg font-medium block text-center mt-8 hover:bg-green-800 transition-colors"
        >
          Checkout
        </a>
      )}
    </div>
  );
}
