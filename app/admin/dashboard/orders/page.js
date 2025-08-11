
"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PAGE_SIZE = 12;
const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "canceled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [filter, page, success]);

  async function fetchOrders() {
    setLoading(true);
    setError("");
    let query = supabase
      .from("orders")
      .select("*, user:users(name, email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    if (filter) query = query.eq("status", filter);
    const { data, error, count } = await query;
    if (error) setError(error.message);
    setOrders(data || []);
    setTotal(count || 0);
    setLoading(false);
  }

  async function handleStatusUpdate(order, status) {
    setError("");
    const { error } = await supabase.from("orders").update({ status }).eq("id", order.id);
    if (error) setError(error.message);
    else setSuccess("Order status updated.");
  }

  function openOrderDetails(order) {
    setSelectedOrder(order);
  }

  function closeOrderDetails() {
    setSelectedOrder(null);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-green-800">Orders</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      {success && <div className="text-green-700 mb-2">{success}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-400 text-center py-12">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-green-100 text-green-900">
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">Customer</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Placed</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-green-50">
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">{order.user?.name || order.user?.email || "N/A"}</td>
                  <td className="py-2 px-4">
                    <select value={order.status} onChange={e => handleStatusUpdate(order, e.target.value)} className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td className="py-2 px-4">${order.total}</td>
                  <td className="py-2 px-4">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" onClick={() => openOrderDetails(order)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between items-center mt-6">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-green-200 rounded">Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page * PAGE_SIZE >= total} className="px-4 py-2 bg-green-200 rounded">Next</button>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Order #{selectedOrder.id}</h3>
            <div className="mb-2">Customer: {selectedOrder.user?.name || selectedOrder.user?.email || "N/A"}</div>
            <div className="mb-2">Status: <span className="font-semibold text-green-700">{selectedOrder.status}</span></div>
            <div className="mb-2">Total: <span className="font-semibold">${selectedOrder.total}</span></div>
            <div className="mb-2">Placed: {new Date(selectedOrder.created_at).toLocaleString()}</div>
            {/* TODO: Fetch and display order items, shipping info, etc. */}
            <div className="flex gap-2 justify-end mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition" onClick={closeOrderDetails}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
