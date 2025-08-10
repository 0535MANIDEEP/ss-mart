
// Cart Page
// TODO: Upgrade Node.js to v20+ for Supabase compatibility (see Supabase deprecation warning)
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

export default function CartPage() {
  const { items, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = typeof window !== "undefined" ? require('next/navigation').useRouter() : null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleCheckout() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      clearCart();
      if (router) router.push('/checkout');
    }, 1000);
  }

  return (
    <>
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto my-8 p-6 bg-green-50 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-green-800 mb-6">Your Cart</h2>
          {items.length === 0 ? (
            <div className="text-center text-green-700 mt-8">Your cart is empty.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-green-100">
                    <th className="p-2 rounded-l">Image</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Total</th>
                    <th className="p-2 rounded-r">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="bg-white shadow rounded">
                      <td className="p-2">
                        <Image
                          src={item.image_url || '/placeholder.png'}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-2 font-medium text-green-900">{item.name}</td>
                      <td className="p-2 text-green-700">${item.price.toFixed(2)}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <button
                            className="bg-green-200 text-green-800 px-2 py-1 rounded hover:bg-green-300"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >-</button>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={e => {
                              const qty = Math.max(1, Number(e.target.value));
                              if (isNaN(qty)) setError('Invalid quantity');
                              else {
                                setError('');
                                updateQuantity(item.id, qty);
                              }
                            }}
                            className="w-12 p-1 border border-green-700 rounded text-center"
                          />
                          <button
                            className="bg-green-200 text-green-800 px-2 py-1 rounded hover:bg-green-300"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >+</button>
                        </div>
                      </td>
                      <td className="p-2 font-semibold text-green-900">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="p-2">
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-col items-end mt-6">
                <div className="text-lg font-bold text-green-800 mb-2">Subtotal: ${subtotal.toFixed(2)}</div>
                <button
                  className={`bg-green-700 text-white px-6 py-2 rounded font-medium transition hover:bg-green-800 ${items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleCheckout}
                  disabled={items.length === 0 || loading}
                >
                  {loading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
              {error && <div className="text-red-600 mt-4 text-right">{error}</div>}
            </div>
          )}
        </div>
      </ProtectedRoute>
    </>
  );
}