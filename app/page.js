// app/page.js
import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] bg-green-50">
      <section className="w-full max-w-xl mx-auto p-8 text-center bg-white rounded-xl shadow-md border border-green-100">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-700 mb-4 font-sans">SS Mart (Sai Sangameshwara Mart) — Shankarpally</h1>
        <p className="text-base sm:text-lg text-green-800 mb-6">
          Located next to the Vegetable Market on BNR Road, beside Gokul Suraksha Clinic and near BNR Hospital lane in Shankarpally, Hyderabad.<br />
          Your neighbourhood kirana & grocery store for everyday essentials — staples, packaged foods, household items and trusted local brands.
        </p>
        {/* TODO: Add shop photo here if available */}
        <Link href="/products" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 mb-2">Shop Now</Link>
      </section>
    </main>
  );
}
