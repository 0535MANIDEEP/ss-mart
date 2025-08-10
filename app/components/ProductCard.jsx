// app/components/ProductCard.jsx
"use client";
import React from 'react';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import styles from '../styles/ProductCard.module.css';

export default function ProductCard({ product }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          width={180}
          height={180}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <h2 className={styles.name}>{product.name}</h2>
        <div className={styles.price}>${product.price}</div>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
