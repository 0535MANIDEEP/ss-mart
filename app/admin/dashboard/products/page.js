

"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PAGE_SIZE = 12;

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "", image_url: "", description: "" });
  const [csvFile, setCsvFile] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, success]);

  async function fetchProducts() {
    setLoading(true);
    setError("");
    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    if (error) setError(error.message);
    setProducts(data || []);
    setTotal(count || 0);
    setLoading(false);
  }

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("name");
    setCategories(data ? data.map(c => c.name) : []);
  }

  function openModal(type, product = null) {
    setModalType(type);
    setShowModal(true);
    if (type === "edit" && product) {
      setEditProduct(product);
      setForm({ ...product });
    } else {
      setEditProduct(null);
      setForm({ name: "", price: "", stock: "", category: "", image_url: "", description: "" });
    }
  }

  function closeModal() {
    setShowModal(false);
    setEditProduct(null);
    setForm({ name: "", price: "", stock: "", category: "", image_url: "", description: "" });
    setCsvFile(null);
    setModalType("");
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.price || !form.category || !form.stock) {
      setError("All fields except image and description are required.");
      return;
    }
    let imageUrl = form.image_url;
    if (form.image_url && typeof form.image_url !== "string") {
      // Upload image to Supabase Storage (bucket: product-images)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(`public/${Date.now()}-${form.image_url.name}`, form.image_url);
      if (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        return;
      }
      imageUrl = uploadData.path;
    }
    if (modalType === "edit" && editProduct) {
      const { error } = await supabase.from("products").update({ ...form, image_url: imageUrl }).eq("id", editProduct.id);
      if (error) setError(error.message);
      else setSuccess("Product updated.");
    } else {
      const { error } = await supabase.from("products").insert([{ ...form, image_url: imageUrl }]);
      if (error) setError(error.message);
      else setSuccess("Product added.");
    }
    closeModal();
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete product ${product.name}?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) setError(error.message);
    else setSuccess("Product deleted.");
  }

  function handleInputChange(e) {
    const { name, value, files } = e.target;
    if (name === "image_url" && files && files[0]) {
      setForm(f => ({ ...f, image_url: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  async function handleCsvUpload(e) {
    e.preventDefault();
    if (!csvFile) return;
    // Simple CSV upload: expects columns matching product fields
    const text = await csvFile.text();
    const rows = text.split("\n").map(r => r.split(","));
    const [header, ...dataRows] = rows;
    const productsToInsert = dataRows
      .filter(r => r.length === header.length)
      .map(r => Object.fromEntries(header.map((h, i) => [h.trim(), r[i].trim()])));
    const { error } = await supabase.from("products").insert(productsToInsert);
    if (error) setError(error.message);
    else setSuccess("Bulk products uploaded.");
    closeModal();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-green-800">Products</h2>
        <div className="flex gap-2">
          <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition" onClick={() => openModal("add")}>Add Product</button>
          <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition" onClick={() => openModal("csv")}>Bulk CSV Upload</button>
        </div>
      </div>
      {success && <div className="text-green-700 mb-2">{success}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-gray-400 text-center py-12">No products found.<br />Add a new product to get started.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <img src={typeof product.image_url === "string" && product.image_url ? product.image_url : "/placeholder.png"} alt={product.name} className="w-32 h-32 object-cover rounded mb-2 border" />
              <div className="font-bold text-lg mb-1">{product.name}</div>
              <div className="text-green-700 font-semibold mb-1">${product.price}</div>
              <div className="text-gray-600 mb-1">{product.category}</div>
              <div className="text-gray-500 text-sm mb-2">{product.description}</div>
              <div className="text-gray-500 text-xs mb-2">Stock: {product.stock}</div>
              <div className="flex gap-2 mt-auto">
                <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" onClick={() => openModal("edit", product)}>Edit</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition" onClick={() => handleDelete(product)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mt-6">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-green-200 rounded">Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page * PAGE_SIZE >= total} className="px-4 py-2 bg-green-200 rounded">Next</button>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (modalType === "add" || modalType === "edit") && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{modalType === "edit" ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Name</label>
                <input name="name" value={form.name} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Price</label>
                <input name="price" type="number" value={form.price} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Stock</label>
                <input name="stock" type="number" value={form.stock} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Category</label>
                <select name="category" value={form.category} onChange={handleInputChange} className="w-full p-2 border rounded" required>
                  <option value="">Select category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Image</label>
                <input name="image_url" type="file" accept="image/*" onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Description</label>
                <textarea name="description" value={form.description} onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={closeModal}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showModal && modalType === "csv" && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Bulk CSV Upload</h3>
            <form onSubmit={handleCsvUpload}>
              <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} className="w-full p-2 border rounded mb-4" required />
              <div className="flex gap-2 justify-end">
                <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={closeModal}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded">Upload</button>
              </div>
            </form>
            <div className="text-xs text-gray-500 mt-2">CSV columns: name,price,stock,category,description,image_url</div>
          </div>
        </div>
      )}
    </div>
  );
}
