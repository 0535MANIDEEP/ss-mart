import React, { useState } from "react";

export default function TestimonialsCarousel({ testimonials }) {
  const [idx, setIdx] = useState(0);
  if (!testimonials || testimonials.length === 0) return null;
  const t = testimonials[idx];

  return (
  <div className="bg-green-50 dark:bg-gray-900 rounded-xl shadow p-6 max-w-xl mx-auto flex flex-col items-center">
  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        {/* Placeholder for user image */}
        <span className="text-2xl text-gray-400">🧑</span>
      </div>
  <blockquote className="italic text-gray-800 dark:text-gray-100 text-center mb-2">"{t.text}"</blockquote>
  <div className="text-green-800 dark:text-green-200 font-semibold">{t.author}</div>
      <div className="flex items-center gap-1 mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < t.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          className="px-2 py-1 rounded bg-green-200 dark:bg-gray-800 hover:bg-green-300 dark:hover:bg-gray-700 transition"
          onClick={() => setIdx((idx - 1 + testimonials.length) % testimonials.length)}
          aria-label="Previous testimonial"
        >
          ‹
        </button>
        <button
          className="px-2 py-1 rounded bg-green-100 dark:bg-gray-700 hover:bg-green-200 dark:hover:bg-gray-600 transition"
          onClick={() => setIdx((idx + 1) % testimonials.length)}
          aria-label="Next testimonial"
        >
          ›
        </button>
      </div>
    </div>
  );
}
