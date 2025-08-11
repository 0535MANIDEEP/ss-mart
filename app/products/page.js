// app/products/page.js


"use client";
import React from 'react';
import ProductGrid from '../components/ProductGrid';

export default function ProductsPage() {
  return (
    <main className="flex flex-col items-center min-h-[70vh] bg-green-50">
      <section className="w-full max-w-6xl mx-auto p-8 md:p-12 bg-white rounded-xl shadow-md border border-green-100 mt-4">
        <ProductGrid />
      </section>
    </main>
  );
}
