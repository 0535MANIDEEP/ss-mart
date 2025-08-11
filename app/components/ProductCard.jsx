// app/components/ProductCard.jsx
"use client";
import React from 'react';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';


export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-green-100 p-4 flex flex-col items-center text-center transition hover:shadow-lg">
      <div className="w-full flex justify-center mb-4">
        <Image
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          width={180}
          height={180}
          className="rounded-lg bg-green-50 object-cover"
        />
      </div>
      <div className="flex-1 w-full">
        <h2 className="text-green-800 text-lg font-semibold mb-1">{product.name}</h2>
        <div className="text-green-600 font-bold text-base mb-2">${product.price}</div>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
