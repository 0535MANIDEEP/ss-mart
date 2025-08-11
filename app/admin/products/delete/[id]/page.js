// Delete Product Page for Admin Panel
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient.js';


export default function DeleteProductPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
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

  async function handleDelete() {
    setLoading(true);
    setError('');
    // Soft delete: mark status as inactive
    const { error } = await supabase
      .from('products')
      .update({ status: 'inactive' })
      .eq('id', id);
    if (error) setError(error.message);
    setLoading(false);
    router.push('/admin/products');
  }

  if (loading) return <div className="text-gray-500 text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;
  if (!product) return <div className="text-red-600 text-center py-8">Product not found.</div>;

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">Delete Product</h1>
      <p className="mb-4 text-center">Are you sure you want to delete <b>{product.name}</b>?</p>
      <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition w-full mb-2" onClick={() => setConfirm(true)}>Confirm Delete</button>
      {confirm && (
        <div className="flex gap-2 justify-center mt-4">
          <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition" onClick={handleDelete}>Yes, Delete</button>
          <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition" onClick={() => setConfirm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
