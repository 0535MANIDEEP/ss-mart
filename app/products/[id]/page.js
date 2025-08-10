// app/products/[id]/page.js
import React, { Suspense } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import AddToCartButton from '../../components/AddToCartButton';

export default async function ProductDetailsPage({ params }) {
  let product = null;
  let error = null;
  try {
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('id, name, image_url, price, description, available')
      .eq('id', params.id)
      .single();
    if (fetchError) throw fetchError;
    product = data;
  } catch (err) {
    error = err.message || 'Failed to fetch product details.';
  }

  if (error) {
    return (
      <main style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f6fff6', minHeight: '100vh', color: '#222' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ color: '#d32f2f' }}>Error</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f6fff6', minHeight: '100vh', color: '#222' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ color: '#43a047' }}>Loading...</h1>
        </div>
      </main>
    );
  }

  return (
    <main style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f6fff6', minHeight: '100vh', color: '#222' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
        <img src={product.image_url || '/placeholder.png'} alt={product.name} style={{ width: '100%', maxWidth: 220, height: 220, objectFit: 'cover', borderRadius: 12, background: '#e8f5e9', marginBottom: '1rem' }} />
        <h1 style={{ color: '#43a047', fontWeight: 700, fontSize: '2rem', marginBottom: '0.5rem' }}>{product.name}</h1>
        <div style={{ color: '#388e3c', fontWeight: 500, fontSize: '1.2rem', marginBottom: '0.5rem' }}>${product.price}</div>
        <p style={{ color: '#222', marginBottom: '1rem' }}>{product.description}</p>
        <div style={{ color: product.available ? '#43a047' : '#d32f2f', marginBottom: '1rem' }}>
          {product.available ? 'In Stock' : 'Out of Stock'}
        </div>
        <Suspense fallback={<div>Loading cart...</div>}>
          <AddToCartButton product={product} />
        </Suspense>
      </div>
    </main>
  );
}
