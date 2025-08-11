// app/admin/dashboard/layout.js
import React from 'react';


export default function AdminDashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      {/* Sidebar: collapses on mobile, never overlaps, always visible on desktop */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-gray-300 h-screen sticky top-0 p-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Admin</h2>
        <ul className="flex flex-col gap-2 mt-4">
          <li><a href="/admin/dashboard/users" className="block px-4 py-2 rounded hover:bg-green-800 focus:bg-green-700 focus:outline-none font-medium transition">Users</a></li>
          <li><a href="/admin/dashboard/products" className="block px-4 py-2 rounded hover:bg-green-800 focus:bg-green-700 focus:outline-none font-medium transition">Products</a></li>
          <li><a href="/admin/dashboard/orders" className="block px-4 py-2 rounded hover:bg-green-800 focus:bg-green-700 focus:outline-none font-medium transition">Orders</a></li>
          <li><a href="/admin/dashboard/analytics" className="block px-4 py-2 rounded hover:bg-green-800 focus:bg-green-700 focus:outline-none font-medium transition">Analytics</a></li>
        </ul>
      </nav>
      {/* Main content area: always visible, never overlapped, perfect spacing */}
      <main className="flex-1 flex flex-col items-stretch p-6 max-w-screen-2xl mx-auto">
        {children}
      </main>
    </div>
  );
}
