// app/components/AddToCartButton.jsx
"use client";
import React, { useContext } from 'react';
import { CartContext } from './CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <button
      className={`bg-green-700 text-white py-3 px-6 rounded-lg font-medium text-base mt-4 transition-opacity hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${product.available ? '' : 'opacity-50 cursor-not-allowed'}`}
      disabled={!product.available}
      onClick={() => addToCart(product)}
    >
      Add to Cart
    </button>
  );
}
