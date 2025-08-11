// app/components/Footer.jsx
"use client";

import { MapPinIcon } from '@heroicons/react/24/outline';


/**
 * Footer: Always fixed at the bottom, never moves up, never overlaps content.
 * Height: h-12 (48px). No margin-top. Content is always visible.
 */

/**
 * Footer: Minimal, modern, always fixed at the bottom.
 * Responsive, clean, and documented.
 */

export default function Footer() {
  return (
  <footer className="fixed bottom-0 left-0 w-full h-12 bg-green-100 dark:bg-gray-950 text-green-900 dark:text-gray-100 border-t border-green-300 dark:border-gray-800 flex items-center justify-center text-xs md:text-sm z-30 shadow-inner select-none transition-colors duration-300" role="contentinfo" aria-label="Site footer">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between px-4">
        <span className="hidden sm:flex items-center gap-1">
          <MapPinIcon className="h-5 w-5 text-green-700 inline-block" aria-hidden="true" />
          SS Mart (Sai Sangameshwara mart) - Shankarpally
        </span>
        <span className="block mx-auto sm:mx-0">&copy; {new Date().getFullYear()} SS Mart</span>
      </div>
    </footer>
  );
}
