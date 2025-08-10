// app/checkout/page.js
"use client";

import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartContext } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export default function CheckoutPage() {
  const { items, clearCart } = useContext(CartContext);
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    payment: 'COD',
    card: '',
    expiry: '',
    cvv: '',
  });
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step validation
  function validateStep() {
    if (step === 1) {
      if (!form.name || !form.address || !form.phone || !form.email) {
        setError('Please fill in all shipping fields.');
        return false;
      }
      setError('');
      return true;
    }
    if (step === 2) {
      if (!form.payment) {
        setError('Select a payment method.');
        return false;
      }
      if (form.payment === 'card') {
        if (!/^\d{16}$/.test(form.card)) {
          setError('Card number must be 16 digits.');
          return false;
        }
        if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
          setError('Expiry must be MM/YY.');
          return false;
        }
        if (!/^\d{3}$/.test(form.cvv)) {
          setError('CVV must be 3 digits.');
          return false;
        }
      }
      setError('');
      return true;
    }
    return true;
  }

  async function handleOrder() {
    setLoadingOrder(true);
    setError('');
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxRate = 0.05;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    // Save order to Supabase
    const { data, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          total_price: total,
          status: 'placed',
          address: form.address,
          phone: form.phone,
          name: form.name,
          email: form.email,
          payment_method: form.payment,
        },
      ])
      .select();
    if (orderError) {
      setError(orderError.message);
      setLoadingOrder(false);
      return;
    }
    const order_id = data?.[0]?.order_id;
    // Insert order items
    for (const item of items) {
      await supabase.from('order_items').insert({
        order_id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      });
    }
    setOrderId(order_id || null);
    setLoadingOrder(false);
    clearCart();
    setStep(4);
  }

  function handleNext(e) {
    e.preventDefault();
    if (validateStep()) setStep(s => s + 1);
  }
  function handlePrev(e) {
    e.preventDefault();
    setStep(s => s - 1);
  }

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;
  }
  if (!user) {
    return null;
  }

  // Progress indicator
  const steps = ['Shipping', 'Payment', 'Review', 'Confirmation'];

  return (
    <main style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f6fff6', minHeight: '100vh', color: '#222' }}>
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#43a047', fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Checkout</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          {steps.map((s, i) => (
            <div key={s} style={{
              fontWeight: step === i + 1 ? 700 : 400,
              color: step === i + 1 ? '#43a047' : '#888',
              marginRight: i < steps.length - 1 ? 16 : 0,
              borderBottom: step === i + 1 ? '2px solid #43a047' : '2px solid #e0f2f1',
              paddingBottom: 4,
              fontSize: '1rem',
              transition: 'color 0.2s',
            }}>{s}</div>
          ))}
        </div>
        {step === 1 && (
          <form onSubmit={handleNext} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(67,160,71,0.08)', border: '1px solid #e0f2f1', padding: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Name</label>
              <input name="name" value={form.name} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047' }} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Email</label>
              <input name="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047' }} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Delivery Address</label>
              <input name="address" value={form.address} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047' }} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047' }} required />
            </div>
            {error && <div style={{ color: '#d32f2f', marginBottom: '1rem' }}>{error}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <span />
              <button type="submit" style={{ background: '#43a047', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>Next</button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleNext} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(67,160,71,0.08)', border: '1px solid #e0f2f1', padding: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Payment Method</label>
              <select name="payment" value={form.payment} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047' }}>
                <option value="COD">Cash on Delivery</option>
                <option value="UPI">UPI</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>
            {form.payment === 'card' && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Card Number</label>
                  <input name="card" value={form.card} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047' }} maxLength={16} required />
                </div>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Expiry (MM/YY)</label>
                    <input name="expiry" value={form.expiry} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047' }} maxLength={5} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>CVV</label>
                    <input name="cvv" value={form.cvv} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047' }} maxLength={3} required />
                  </div>
                </div>
              </>
            )}
            {error && <div style={{ color: '#d32f2f', marginBottom: '1rem' }}>{error}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button type="button" onClick={handlePrev} style={{ background: '#e0f2f1', color: '#43a047', padding: '0.75rem 1.5rem', borderRadius: 8, border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>Back</button>
              <button type="submit" style={{ background: '#43a047', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>Next</button>
            </div>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={e => { e.preventDefault(); handleOrder(); }} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(67,160,71,0.08)', border: '1px solid #e0f2f1', padding: '2rem' }}>
            <h2 style={{ color: '#388e3c', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Order Review</h2>
            <div style={{ marginBottom: '1rem' }}>
              <b>Name:</b> {form.name}<br />
              <b>Email:</b> {form.email}<br />
              <b>Address:</b> {form.address}<br />
              <b>Phone:</b> {form.phone}<br />
              <b>Payment:</b> {form.payment}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
              {items.map(item => (
                <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                  {item.name} x {item.quantity} - ${item.price * item.quantity}
                </li>
              ))}
            </ul>
            <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', color: '#43a047', marginTop: '1rem' }}>
              Subtotal: ${items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}<br />
              Tax (5%): ${(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.05).toFixed(2)}<br />
              Total: ${(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.05).toFixed(2)}
            </div>
            {error && <div style={{ color: '#d32f2f', marginBottom: '1rem' }}>{error}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button type="button" onClick={handlePrev} style={{ background: '#e0f2f1', color: '#43a047', padding: '0.75rem 1.5rem', borderRadius: 8, border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>Back</button>
              <button type="submit" disabled={loadingOrder} style={{ background: '#43a047', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, border: 'none', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>{loadingOrder ? 'Placing Order...' : 'Confirm & Place Order'}</button>
            </div>
          </form>
        )}
        {step === 4 && (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(67,160,71,0.08)', border: '1px solid #e0f2f1', padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ color: '#43a047' }}>Order Placed!</h1>
            <p>Thank you for your order.</p>
            <p>Your groceries will be delivered to: <b>{form.address}</b></p>
            <p>Order ID: <b>{orderId || 'N/A'}</b></p>
            <a href="/products" style={{ color: '#43a047', textDecoration: 'underline' }}>Continue Shopping</a>
          </div>
        )}
      </div>
    </main>
  );
}
