// Edit Product Page for Admin Panel
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import styles from '../../../styles/AdminProduct.module.css';

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

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!product) return <div className={styles.error}>Product not found.</div>;

  return (
    <form className={styles.form} onSubmit={handleUpdate}>
      <h1 className={styles.title}>Edit Product</h1>
      {/* ...form fields prefilled with product data... */}
      <button className={styles.button} type="submit">Update Product</button>
    </form>
  );
}
