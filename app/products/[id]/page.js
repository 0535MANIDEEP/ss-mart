// app/products/[id]/page.js
import React, { Suspense } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import AddToCartButton from '../../components/AddToCartButton';
import Image from 'next/image';

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
      <main className="font-sans bg-green-50 min-h-screen text-gray-900">
        <div className="max-w-xl mx-auto p-8 text-center">
          <h1 className="text-red-700 text-2xl font-bold mb-2">Error</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="font-sans bg-green-50 min-h-screen text-gray-900">
        <div className="max-w-xl mx-auto p-8 text-center">
          <h1 className="text-green-700 text-2xl font-bold mb-2">Loading...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="font-sans bg-green-50 min-h-screen text-gray-900">
      <div className="max-w-xl mx-auto p-8">
        <div className="flex justify-center mb-4">
          <Image
            src={product.image_url || '/placeholder.png'}
            alt={product.name}
            width={220}
            height={220}
            className="w-full max-w-[220px] h-[220px] object-cover rounded-xl bg-green-50 mb-4"
          />
        </div>
        <h1 className="text-green-700 font-bold text-2xl mb-2">{product.name}</h1>
        <div className="text-green-800 font-semibold text-lg mb-2">${product.price}</div>
        <p className="text-gray-900 mb-4">{product.description}</p>
        <div className={`mb-4 font-medium ${product.available ? 'text-green-700' : 'text-red-700'}`}>{product.available ? 'In Stock' : 'Out of Stock'}</div>
        <Suspense fallback={<div>Loading cart...</div>}>
          <AddToCartButton product={product} />
        </Suspense>
      </div>
    </main>
  );
}
