// app/components/ProductCard.jsx
"use client";
import React from 'react';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';



/**
 * ProductCard: Modern, clean, and interactive product display.
 * - Rounded corners, shadow, hover animation, clean typography.
 * - Primary button, responsive, and documented.
 */
export default function ProductCard({ product }) {
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-md border border-green-100 dark:border-gray-800 p-3 sm:p-4 flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.03] group w-full max-w-xs mx-auto" role="region" aria-label={`Product: ${product.name}`}> 
      <div className="w-full flex justify-center mb-3 sm:mb-4">
        <Image
          src={product.image_url || '/placeholder.png'}
          alt={product.image_url ? product.name : `Placeholder image for ${product.name}`}
          width={180}
          height={180}
          className="rounded-lg bg-green-50 object-cover group-hover:scale-105 transition-transform duration-200 w-32 h-32 sm:w-44 sm:h-44"
        />
      </div>
      <div className="flex-1 w-full">
        <h2 className="text-green-800 text-base sm:text-lg font-semibold mb-1 truncate max-w-full break-words" title={product.name}>{product.name}</h2>
        <div className="text-green-600 font-bold text-base mb-2">${product.price}</div>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
