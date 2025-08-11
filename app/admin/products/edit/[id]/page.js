// Edit Product Page for Admin Panel
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient.js';


export default function EditProductPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) setError(error.message);
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  async function handleUpdate(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    // ...update logic here...
    setLoading(false);
    router.push('/admin/products');
  }

  if (loading) return <div className="text-gray-500 text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;
  if (!product) return <div className="text-red-600 text-center py-8">Product not found.</div>;

  return (
    <form className="bg-white rounded-lg shadow p-8 max-w-lg mx-auto mt-8" onSubmit={handleUpdate}>
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Edit Product</h1>
      {/* ...form fields prefilled with product data... */}
      <button className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition w-full mt-4" type="submit">Update Product</button>
    </form>
  );
}
