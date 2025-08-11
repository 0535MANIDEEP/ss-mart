
"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState({ users: 0, orders: 0, sales: 0, topProducts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    setLoading(true);
    setError("");
    try {
      const [{ count: userCount }, { count: orderCount, data: orders }, { data: products }] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total", { count: "exact" }),
        supabase.from("products").select("id, name, sales")
      ]);
      const sales = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
      const topProducts = (products || []).sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 5);
      setMetrics({ users: userCount || 0, orders: orderCount || 0, sales, topProducts });
    } catch (e) {
      setError("Failed to load analytics.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Analytics</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-500">Loading analytics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl font-bold text-green-700 mb-2">{metrics.users}</div>
              <div className="text-gray-700">Users</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl font-bold text-green-700 mb-2">{metrics.orders}</div>
              <div className="text-gray-700">Orders</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl font-bold text-green-700 mb-2">${metrics.sales}</div>
              <div className="text-gray-700">Total Sales</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-bold mb-4">Top Products</h3>
            {metrics.topProducts.length === 0 ? (
              <div className="text-gray-500">No product sales data.</div>
            ) : (
              <ul>
                {metrics.topProducts.map(p => (
                  <li key={p.id} className="flex justify-between items-center mb-2">
                    <span>{p.name}</span>
                    <span className="font-bold text-green-700">{p.sales || 0} sold</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Simple sales trend chart (text-based fallback) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Sales Trend (Top 5 Products)</h3>
            <div className="flex gap-2 items-end h-32">
              {(metrics.sales > 0 && Array.isArray(metrics.topProducts)) ? metrics.topProducts.map((p, i) => (
                <div key={i} className="flex flex-col items-center justify-end h-full">
                  <div style={{ height: `${(p.sales || 0) * 10}px` }} className="w-6 bg-green-500 rounded-t"></div>
                  <span className="text-xs mt-1">{p.name}</span>
                </div>
              )) : <div className="text-gray-400">No data</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
