// app/products/page.js


"use client";
import React, { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';

export default function ProductsPage() {
  // ProductGrid handles all listing, search, filters, sorting, pagination
  return (
    <main style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f6fff6', minHeight: '100vh', color: '#222' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
        <ProductGrid />
      </div>
    </main>
  );
}
