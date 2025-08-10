// app/components/AddToCartButton.jsx
"use client";
import React, { useContext } from 'react';
import { CartContext } from './CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <button
      style={{
        background: '#43a047',
        color: '#fff',
        padding: '0.75rem 1.5rem',
        borderRadius: 8,
        border: 'none',
        fontWeight: 500,
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '1rem',
        opacity: product.available ? 1 : 0.5,
      }}
      disabled={!product.available}
      onClick={() => addToCart(product)}
    >
      Add to Cart
    </button>
  );
}
