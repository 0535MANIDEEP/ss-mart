// Delete Product Page for Admin Panel
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import styles from '../../../styles/AdminProduct.module.css';

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

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!product) return <div className={styles.error}>Product not found.</div>;

  return (
    <div className={styles.form}>
      <h1 className={styles.title}>Delete Product</h1>
      <p>Are you sure you want to delete <b>{product.name}</b>?</p>
      <button className={styles.button} onClick={() => setConfirm(true)}>Confirm Delete</button>
      {confirm && (
        <div>
          <button className={styles.button} onClick={handleDelete}>Yes, Delete</button>
          <button className={styles.button} onClick={() => setConfirm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
