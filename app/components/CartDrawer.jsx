// app/components/CartDrawer.jsx
"use client";
import React, { useContext } from 'react';
import { CartContext } from './CartContext';

export default function CartDrawer({ open, onClose }) {
  const { items, removeFromCart, updateQuantity } = useContext(CartContext);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: 340,
      height: '100vh',
      background: '#fff',
      boxShadow: '-2px 0 12px rgba(67,160,71,0.18)',
      zIndex: 2000,
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <button
        style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#43a047' }}
        onClick={onClose}
        aria-label="Close cart"
      >
        ×
      </button>
      <h2 style={{ color: '#43a047', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem', textAlign: 'center' }}>Your Cart</h2>
      {items.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>Your cart is empty.</div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e0f2f1', paddingBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ color: '#43a047', fontWeight: 500 }}>${item.price}</div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                    style={{ width: 48, padding: '0.25rem', borderRadius: 4, border: '1px solid #43a047', textAlign: 'center', marginRight: 8 }}
                  />
                  <button
                    style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer' }}
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
      <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', color: '#43a047', marginTop: '1rem' }}>
        Subtotal: ${subtotal.toFixed(2)}
      </div>
      {items.length > 0 && (
        <a href="/checkout" style={{ background: '#43a047', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, textDecoration: 'none', fontWeight: 500, display: 'block', textAlign: 'center', marginTop: '2rem' }}>
          Checkout
        </a>
      )}
    </div>
  );
}
