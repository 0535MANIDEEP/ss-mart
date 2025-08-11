// app/about/page.js
import React from 'react';

export const metadata = {
  title: 'About SS Mart',
  description: 'SS Mart (Sai Sangameshwara mart) - Shankarpally: Located in Shankarpally, Hyderabad, next to the Vegetable Market and near Gowtham Traders & BNR Hospital Lane.',
};

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center min-h-[70vh] bg-green-50">
      <section className="w-full max-w-xl mx-auto p-8 bg-white rounded-xl shadow-md border border-green-100 mt-8">
        <h1 className="text-3xl font-bold text-green-700 mb-4 text-center font-sans">About SS Mart</h1>
        <p className="text-green-800 text-lg mb-6 text-center">
          SS Mart (Sai Sangameshwara mart) - Shankarpally: Located in Shankarpally, Hyderabad, next to the Vegetable Market and near Gowtham Traders & BNR Hospital Lane.
        </p>
        <div className="text-gray-900 text-base mb-2 text-center">
          <b>Contact Info:</b><br />
          Phone: <span className="text-gray-500">[Add phone here]</span><br />
          Email: <span className="text-gray-500">[Add email here]</span>
        </div>
      </section>
    </main>
  );
}
