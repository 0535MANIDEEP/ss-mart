// app/about/page.js
"use client";
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AboutCard from '../components/AboutCard';
import TestimonialsCarousel from '../components/TestimonialsCarousel';

export const metadata = {
  title: 'About SS Mart',
  description: 'SS Mart (Sai Sangameshwara mart) - Shankarpally: Located in Shankarpally, Hyderabad, next to the Vegetable Market and near Gowtham Traders & BNR Hospital Lane.',
};

// Seeded store_info and testimonials data (replace with Supabase fetch if needed)
const store_info = {
  name: 'SS Mart (Sai Sangameshwara Mart)',
  description: 'A family-run kirana and grocery store serving the Shankarpally community. Located at the Vegetable Market area (BNR Road), we stock a curated selection of groceries, essentials, and local staples. Our aim is quick, friendly service with competitive pricing for households and small businesses.',
  hours: 'Mon–Sun: 8:00 AM — 9:30 PM',
  phone: 'No phone listed — please visit in-store or use Instagram DM.',
  address: 'Shankarpally Vegetable Market / BNR Road, near BNR Hospital Lane, Shankarpally, Telangana 501203.',
  gmaps_url: 'https://maps.app.goo.gl/2Qn1Qw1Qw1Qw1Qw1Q',
};
const testimonials = [
  { author: 'Local customer', rating: 5, text: 'Fast service and good selection of packaged groceries — very convenient for daily shopping.' },
  { author: 'Neighbour', rating: 5, text: 'Friendly staff and quick billing. Great for last-minute needs.' },
  { author: 'Regular shopper', rating: 4, text: 'Competitive prices on staples and household items.' },
];

export default function AboutPage() {
  // Review form state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Simple rate limit: 1 per 24h per IP (localStorage)
  function canSubmitReview() {
    if (typeof window === 'undefined') return true;
    const last = localStorage.getItem('ssmart_last_review');
    if (!last) return true;
    return Date.now() - parseInt(last, 10) > 24 * 60 * 60 * 1000;
  }
  function markReviewSubmitted() {
    if (typeof window !== 'undefined') localStorage.setItem('ssmart_last_review', Date.now().toString());
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewError("");
    if (!canSubmitReview()) {
      setReviewError("You can only submit one review every 24 hours.");
      return;
    }
    if (!reviewMsg.trim()) {
      setReviewError("Please enter your review message.");
      return;
    }
    if (reviewMsg.length > 200) {
      setReviewError("Review message too long (max 200 chars).");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('testimonials').insert({
      author: reviewName || 'Anonymous',
      rating: parseInt(reviewRating, 10),
      text: reviewMsg.trim(),
      source: 'website',
    });
    setSubmitting(false);
    if (error) {
      setReviewError("Could not submit review. Please try again later.");
      return;
    }
    markReviewSubmitted();
    setReviewSuccess(true);
    setReviewName("");
    setReviewRating("5");
    setReviewMsg("");
  }
  return (
    <main className="flex flex-col items-center min-h-[70vh] bg-green-50">
      <section className="w-full max-w-xl mx-auto p-8 bg-white rounded-xl shadow-md border border-green-100 mt-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center font-sans">About SS Mart</h1>
        <AboutCard store={store_info} />

        <div className="my-8">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>

        {/* Nearby stores */}
        <div className="bg-white rounded-lg p-4 my-6 border border-green-100">
          <h2 className="text-lg font-bold text-green-700 mb-2 text-center">You May Also Like (Nearby)</h2>
          <ul className="list-disc list-inside text-green-900">
            <li><b>SB Super Market</b> — Nearby general grocery store</li>
            <li><b>Sri Sangameshwara Kiranam & General Stores</b> — Local kirana</li>
          </ul>
        </div>

        {/* Review form (functional) */}
        <div className="bg-green-50 rounded-lg p-4 my-6 border border-green-100">
          <h2 className="text-lg font-bold text-green-700 mb-2 text-center">Leave a Review</h2>
          <form className="flex flex-col gap-2 max-w-md mx-auto" onSubmit={handleReviewSubmit}>
            <input
              type="text"
              className="p-2 border border-green-300 rounded"
              placeholder="Your Name (optional)"
              maxLength={40}
              value={reviewName}
              onChange={e => setReviewName(e.target.value)}
              disabled={submitting}
            />
            <select
              className="p-2 border border-green-300 rounded"
              value={reviewRating}
              onChange={e => setReviewRating(e.target.value)}
              disabled={submitting}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
            <textarea
              className="p-2 border border-green-300 rounded"
              placeholder="Your review..."
              rows={3}
              maxLength={200}
              value={reviewMsg}
              onChange={e => setReviewMsg(e.target.value)}
              disabled={submitting}
            ></textarea>
            <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded font-medium hover:bg-green-800 transition-colors" disabled={submitting}>Submit Review</button>
            {reviewError && <div className="text-red-600 text-sm mt-1">{reviewError}</div>}
          </form>
          {reviewSuccess && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-xs mx-auto text-center">
                <h3 className="text-green-700 text-xl font-bold mb-2">Thank you for your review!</h3>
                <button className="mt-4 bg-green-700 text-white px-4 py-2 rounded font-medium hover:bg-green-800 transition-colors" onClick={() => setReviewSuccess(false)}>Close</button>
              </div>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">(Reviews are moderated. Only one review per 24 hours per device.)</div>
        </div>
      </section>
    </main>
  );
}
