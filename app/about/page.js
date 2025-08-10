// app/about/page.js
import React from 'react';

export const metadata = {
  title: 'About SS Mart',
  description: 'SS Mart (Sai Sangameshwara mart) - Shankarpally: Located in Shankarpally, Hyderabad, next to the Vegetable Market and near Gowtham Traders & BNR Hospital Lane.',
};

export default function AboutPage() {
  return (
    <main style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f6fff6', minHeight: '100vh', color: '#222' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(67,160,71,0.08)', border: '1px solid #e0f2f1' }}>
        <h1 style={{ color: '#43a047', fontWeight: 700, fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
          About SS Mart
        </h1>
        <p style={{ color: '#388e3c', fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          SS Mart (Sai Sangameshwara mart) - Shankarpally: Located in Shankarpally, Hyderabad, next to the Vegetable Market and near Gowtham Traders & BNR Hospital Lane.
        </p>
        <div style={{ color: '#222', fontSize: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
          <b>Contact Info:</b><br />
          Phone: <span style={{ color: '#888' }}>[Add phone here]</span><br />
          Email: <span style={{ color: '#888' }}>[Add email here]</span>
        </div>
      </div>
    </main>
  );
}
