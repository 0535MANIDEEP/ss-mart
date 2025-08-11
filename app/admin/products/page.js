// app/admin/products/page.js
"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../components/AuthContext';
import Image from 'next/image';


export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image_url: '', description: '', category: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Only allow admin users (RLS policy should enforce this server-side)
  useEffect(() => {
    if (!loading && (!user || !user.email.endsWith('@admin.com'))) {
      window.location.href = '/auth/sign-in';
    }
  }, [user, loading]);

  useEffect(() => {
    async function fetchProducts() {
      setLoadingProducts(true);
      const { data, error } = await supabase.from('products').select('*');
      setProducts(data || []);
      setLoadingProducts(false);
    }
    fetchProducts();
  }, []);

  function handleEdit(product) {
    setEditId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      description: product.description,
      category: product.category
    });
  }

  function handleDelete(id) {
    // Implement delete logic here
    setSuccess('Delete feature not implemented.');
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {loadingProducts ? (
        <div>Loading products...</div>
      ) : products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        products.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md border border-green-100 p-6 flex flex-col items-center text-center"
          >
            <Image
              src={product.image_url || '/placeholder.png'}
              alt={product.name}
              width={120}
              height={120}
              className="rounded-lg mb-4 bg-green-50 object-cover"
            />
            <h2 className="text-green-800 text-lg font-semibold mb-1">{product.name}</h2>
            <div className="text-green-600 font-bold text-base">${product.price}</div>
            <div className="text-gray-500 text-sm mb-1">{product.category}</div>
            <div className="text-gray-800 text-sm mb-2">{product.description}</div>
            <div className="flex gap-2 mt-2">
              <button
                className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700 font-medium transition-colors"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 font-medium transition-colors"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
      {success && <div className="text-green-600 mt-4">{success}</div>}
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
}
