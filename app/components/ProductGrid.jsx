// app/components/ProductGrid.jsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ProductCard from './ProductCard';

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
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex-1 min-w-[220px]">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full max-w-[320px] p-2 rounded border border-green-500 text-base"
          />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className="ml-4 bg-green-500 text-white rounded px-4 py-2 font-medium transition duration-200"
          aria-expanded={showFilters}
          aria-controls="product-filters"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      <div
        id="product-filters"
        className={`transition-max-height duration-400 overflow-hidden ${showFilters ? 'max-h-[400px]' : 'max-h-0'}`}
        aria-hidden={!showFilters}
      >
        <div className="flex flex-wrap gap-4">
          <div>
            <div className="font-medium mb-2">Category</div>
            {categories.map(cat => (
              <button
                key={cat}
                className={`mr-2 mb-2 ${cat === selectedCategory ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div>
            <div className="font-medium mb-2">Price Range</div>
            <input
              type="range"
              min={0}
              max={1000}
              value={filters.price[1]}
              onChange={e => handleFilterChange('price', [filters.price[0], Number(e.target.value)])}
              className="w-30"
            />
            <span className="ml-2">${filters.price[0]} - ${filters.price[1]}</span>
          </div>
          <div>
            <div className="font-medium mb-2">Availability</div>
            <label className="mr-4">
              <input type="checkbox" checked={filters.available} onChange={e => handleFilterChange('available', e.target.checked)} /> In Stock Only
            </label>
            <label>
              <input type="checkbox" checked={filters.discount} onChange={e => handleFilterChange('discount', e.target.checked)} /> Discount
            </label>
          </div>
          <div>
            <div className="font-medium mb-2">Sort</div>
            <select value={sort} onChange={handleSortChange} className="p-2 rounded border border-green-500">
              <option value="popularity">Popularity</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mb-4 font-medium text-green-700">
        {loading ? 'Searching...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
      </div>
      {loading ? (
        <div className="text-green-700">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-red-600">No results found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {!loading && hasMore && (
        <div className="text-green-700">Scroll down to load more...</div>
      )}
    </div>
  );
}
