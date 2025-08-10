// app/components/ProductGrid.jsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ProductCard from './ProductCard';
import styles from '../styles/ProductGrid.module.css';

export default function ProductGrid() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchTimeout = useRef(null);
  const [sort, setSort] = useState('popularity');
  const [filters, setFilters] = useState({ price: [0, 1000], available: false, discount: false });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('products').select('category');
      if (data) {
        setCategories(['All', ...Array.from(new Set(data.map(p => p.category).filter(Boolean)))]);
      }
    }
    fetchCategories();
  }, []);

  // Debounce search input
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  // Fetch products with filters, debounced search, sort, pagination
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError('');
      let query = supabase.from('products').select('*', { count: 'exact' });
      if (selectedCategory !== 'All') query = query.eq('category', selectedCategory);
      if (debouncedSearch) {
        query = query.or(`name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`);
      }
      if (filters.available) query = query.eq('available', true);
      if (filters.discount) query = query.gt('discount', 0);
      query = query.gte('price', filters.price[0]).lte('price', filters.price[1]);
      // Sorting
      if (sort === 'priceLow') query = query.order('price', { ascending: true });
      else if (sort === 'priceHigh') query = query.order('price', { ascending: false });
      else query = query.order('popularity', { ascending: false });
      // Pagination
      const pageSize = 12;
      query = query.range((page - 1) * pageSize, page * pageSize - 1);
      const { data, error: fetchError, count } = await query;
      if (fetchError) {
        setError('Failed to fetch products.');
        setProducts([]);
        setHasMore(false);
      } else {
        setProducts(data || []);
        setHasMore((page * pageSize) < (count || 0));
      }
      setLoading(false);
    }
    fetchProducts();
  }, [selectedCategory, debouncedSearch, sort, filters, page]);

  // Infinite scroll
  useEffect(() => {
    function handleScroll() {
      if (!hasMore || loading) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setPage(p => p + 1);
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  // Filter UI handlers
  function handleFilterChange(type, value) {
    setFilters(f => ({ ...f, [type]: value }));
    setPage(1);
  }

  function handleSortChange(e) {
    setSort(e.target.value);
    setPage(1);
  }

  function handleCategoryChange(cat) {
    setSelectedCategory(cat);
    setPage(1);
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  // Sidebar/collapsible filter UI
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Products</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
            aria-label="Search products"
            style={{ width: '100%', maxWidth: 320, padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047', fontSize: '1rem' }}
          />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          style={{ marginLeft: 16, background: '#43a047', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
          aria-expanded={showFilters}
          aria-controls="product-filters"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      <div
        id="product-filters"
        style={{
          maxHeight: showFilters ? 400 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(.4,0,.2,1)',
          marginBottom: showFilters ? 24 : 0,
          background: '#e8f5e9',
          borderRadius: 12,
          padding: showFilters ? '1rem' : '0 1rem',
        }}
        aria-hidden={!showFilters}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Category</div>
            {categories.map(cat => (
              <button
                key={cat}
                className={cat === selectedCategory ? styles.activeFilter : styles.filter}
                onClick={() => handleCategoryChange(cat)}
                style={{ marginRight: 8, marginBottom: 8 }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Price Range</div>
            <input
              type="range"
              min={0}
              max={1000}
              value={filters.price[1]}
              onChange={e => handleFilterChange('price', [filters.price[0], Number(e.target.value)])}
              style={{ width: 120 }}
            />
            <span style={{ marginLeft: 8 }}>${filters.price[0]} - ${filters.price[1]}</span>
          </div>
          <div>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Availability</div>
            <label style={{ marginRight: 16 }}>
              <input type="checkbox" checked={filters.available} onChange={e => handleFilterChange('available', e.target.checked)} /> In Stock Only
            </label>
            <label>
              <input type="checkbox" checked={filters.discount} onChange={e => handleFilterChange('discount', e.target.checked)} /> Discount
            </label>
          </div>
          <div>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Sort</div>
            <select value={sort} onChange={handleSortChange} style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #43a047' }}>
              <option value="popularity">Popularity</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 16, fontWeight: 500, color: '#388e3c' }}>
        {loading ? 'Searching...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
      </div>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : products.length === 0 ? (
        <div className={styles.error}>No results found.</div>
      ) : (
        <div className={styles.grid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {!loading && hasMore && (
        <div className={styles.loading}>Scroll down to load more...</div>
      )}
    </div>
  );
}
