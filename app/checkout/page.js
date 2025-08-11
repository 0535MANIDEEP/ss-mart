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
    return <div className="text-center mt-16">Loading...</div>;
  }
  if (!user) {
    return null;
  }

  // Progress indicator
  const steps = ['Shipping', 'Payment', 'Review', 'Confirmation'];

  return (
    <main className="font-sans bg-green-50 min-h-screen text-gray-900">
      <div className="max-w-md mx-auto p-8">
        <h1 className="text-green-700 font-bold text-2xl mb-6 text-center">Checkout</h1>
        <div className="flex justify-center mb-6 gap-4">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`pb-1 text-base border-b-2 ${step === i + 1 ? 'font-bold text-green-700 border-green-700' : 'font-normal text-gray-400 border-green-100'} ${i < steps.length - 1 ? 'mr-4' : ''}`}
            >
              {s}
            </div>
          ))}
        </div>
        {step === 1 && (
          <form onSubmit={handleNext} className="bg-white rounded-xl shadow border border-green-100 p-8">
            <div className="mb-4">
              <label className="block mb-1 font-medium">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded border border-green-700" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full p-2 rounded border border-green-700" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Delivery Address</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full p-2 rounded border border-green-700" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 rounded border border-green-700" required />
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="flex justify-between mt-4">
              <span />
              <button type="submit" className="bg-green-700 text-white py-3 px-6 rounded-lg font-medium text-base hover:bg-green-800 transition-colors">Next</button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleNext} className="bg-white rounded-xl shadow border border-green-100 p-8">
            <div className="mb-4">
              <label className="block mb-1 font-medium">Payment Method</label>
              <select name="payment" value={form.payment} onChange={handleChange} className="w-full p-2 rounded border border-green-700">
                <option value="COD">Cash on Delivery</option>
                <option value="UPI">UPI</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>
            {form.payment === 'card' && (
              <>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Card Number</label>
                  <input name="card" value={form.card} onChange={handleChange} className="w-full p-2 rounded border border-green-700" maxLength={16} required />
                </div>
                <div className="mb-4 flex gap-4">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Expiry (MM/YY)</label>
                    <input name="expiry" value={form.expiry} onChange={handleChange} className="w-full p-2 rounded border border-green-700" maxLength={5} required />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">CVV</label>
                    <input name="cvv" value={form.cvv} onChange={handleChange} className="w-full p-2 rounded border border-green-700" maxLength={3} required />
                  </div>
                </div>
              </>
            )}
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="flex justify-between mt-4">
              <button type="button" onClick={handlePrev} className="bg-green-100 text-green-700 py-3 px-6 rounded-lg font-medium text-base hover:bg-green-200 transition-colors">Back</button>
              <button type="submit" className="bg-green-700 text-white py-3 px-6 rounded-lg font-medium text-base hover:bg-green-800 transition-colors">Next</button>
            </div>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={e => { e.preventDefault(); handleOrder(); }} className="bg-white rounded-xl shadow border border-green-100 p-8">
            <h2 className="text-green-800 text-lg font-semibold mb-4">Order Review</h2>
            <div className="mb-4">
              <b>Name:</b> {form.name}<br />
              <b>Email:</b> {form.email}<br />
              <b>Address:</b> {form.address}<br />
              <b>Phone:</b> {form.phone}<br />
              <b>Payment:</b> {form.payment}
            </div>
            <ul className="list-none p-0 mb-4">
              {items.map(item => (
                <li key={item.id} className="mb-2">
                  {item.name} x {item.quantity} - ${item.price * item.quantity}
                </li>
              ))}
            </ul>
            <div className="text-right font-bold text-lg text-green-700 mt-4">
              Subtotal: ${items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}<br />
              Tax (5%): ${(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.05).toFixed(2)}<br />
              Total: ${(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.05).toFixed(2)}
            </div>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="flex justify-between mt-4">
              <button type="button" onClick={handlePrev} className="bg-green-100 text-green-700 py-3 px-6 rounded-lg font-medium text-base hover:bg-green-200 transition-colors">Back</button>
              <button type="submit" disabled={loadingOrder} className="bg-green-700 text-white py-3 px-6 rounded-lg font-medium text-base hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">{loadingOrder ? 'Placing Order...' : 'Confirm & Place Order'}</button>
            </div>
          </form>
        )}
        {step === 4 && (
          <div className="bg-white rounded-xl shadow border border-green-100 p-8 text-center">
            <h1 className="text-green-700 text-2xl font-bold mb-2">Order Placed!</h1>
            <p>Thank you for your order.</p>
            <p>Your groceries will be delivered to: <b>{form.address}</b></p>
            <p>Order ID: <b>{orderId || 'N/A'}</b></p>
            <a href="/products" className="text-green-700 underline hover:text-green-800">Continue Shopping</a>
          </div>
        )}
      </div>
    </main>
  );
}
