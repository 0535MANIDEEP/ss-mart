
// app/admin/layout.js
"use client";
import React from "react";
import Link from "next/link";

function AdminSidebar() {
  return (
    <aside className="w-72 bg-green-900 text-white flex flex-col py-8 px-6 min-h-screen shadow-lg">
      <h1 className="text-3xl font-bold mb-10 tracking-tight">SS Mart Admin</h1>
      <nav aria-label="Admin Navigation" className="flex flex-col gap-4">
        <Link href="/admin/dashboard" className="px-4 py-2 rounded hover:bg-green-800 focus:bg-green-700 focus:outline-none transition">Dashboard</Link>
        <Link href="/admin/users" className="px-4 py-2 rounded hover:bg-green-800 focus:bg-green-700 focus:outline-none transition">Users</Link>
        <Link href="/admin/products" className="px-4 py-2 rounded hover:bg-green-800 focus:bg-green-700 focus:outline-none transition">Products</Link>
        <Link href="/admin/orders" className="px-4 py-2 rounded hover:bg-green-800 focus:bg-green-700 focus:outline-none transition">Orders</Link>
      </nav>
    </aside>
  );
}

function AdminHeader() {
  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-8 py-4 mb-8">
      <div className="text-green-900 text-xl font-semibold tracking-tight">Admin Panel</div>
      <div>
        <Link href="/" className="text-green-700 hover:underline font-medium">Back to Store</Link>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-green-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
