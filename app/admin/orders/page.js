// app/admin/orders/page.js
"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        let query = supabase.from("orders").select("*, user:auth.users(email)");
        if (filter) query = query.eq("status", filter);
        const { data, error } = await query;
        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        setError("Failed to fetch orders.");
      }
      setLoading(false);
    }
    fetchOrders();
  }, [filter]);

  async function handleStatus(id, status) {
    setLoading(true);
    try {
      await supabase.from("orders").update({ status }).eq("id", id);
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      setError("Failed to update order status.");
    }
    setLoading(false);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-800 mb-6">Order Management</h2>
      <div className="mb-4 flex gap-4">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-600">{error}</div> : (
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-green-100">
              <th className="p-2">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="bg-white shadow rounded">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.user?.email || 'N/A'}</td>
                <td className="p-2">${order.total}</td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">
                  <select value={order.status} onChange={e => handleStatus(order.id, e.target.value)} className="p-1 border rounded">
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
