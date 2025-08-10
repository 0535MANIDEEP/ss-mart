// app/page.js
import React from 'react';

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f6fff6', minHeight: '100vh', color: '#222' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#43a047', fontWeight: 700, fontSize: '2.5rem', marginBottom: '1rem' }}>
          Welcome to FreshMart Grocery Store
        </h1>
        <p style={{ color: '#388e3c', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Browse our selection of fresh groceries and healthy products.
        </p>
        <a href="/products" style={{ display: 'inline-block', background: '#43a047', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
          View Products
        </a>
      </div>
    </main>
  );
}
