// app/admin/products/page.js
"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../components/AuthContext';
import Image from 'next/image';
import styles from '../../styles/AdminProduct.module.css';

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
    <div className={styles.list}>
      {loadingProducts ? (
        <div>Loading products...</div>
      ) : products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        products.map(product => (
          <div key={product.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(67,160,71,0.08)', border: '1px solid #e0f2f1', padding: '1rem', textAlign: 'center' }}>
            <Image src={product.image_url || '/placeholder.png'} alt={product.name} width={120} height={120} style={{ borderRadius: 8, marginBottom: '1rem', background: '#e8f5e9', objectFit: 'cover' }} />
            <h2 style={{ color: '#388e3c', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{product.name}</h2>
            <div style={{ color: '#43a047', fontWeight: 500, fontSize: '1rem' }}>${product.price}</div>
            <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{product.category}</div>
            <div style={{ color: '#222', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{product.description}</div>
            <button className={styles.button} onClick={() => handleEdit(product)}>Edit</button>
            <button className={styles.delete} onClick={() => handleDelete(product.id)}>Delete</button>
          </div>
        ))
      )}
      {success && <div style={{ color: 'green', marginTop: '1rem' }}>{success}</div>}
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
    </div>
  );
}
