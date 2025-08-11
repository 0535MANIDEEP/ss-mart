
"use client";



import React, { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

function AdminSidebar({ open, onClose, collapsed, onToggle }) {
  return (
    <nav
      className={`
        bg-green-900 text-white flex flex-col shadow-lg transition-all duration-200
        fixed z-40 top-0 left-0 h-full w-64
        lg:static lg:z-auto lg:shadow-none lg:h-[calc(100vh-64px-48px)] lg:w-64 lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
        ${collapsed ? "lg:w-20" : "lg:w-64"}
      `}
      aria-label="Admin Sidebar"
      tabIndex={-1}
      style={{ top: 64, bottom: 48 }}
    >
      <div className="flex items-center justify-between mb-8 px-4">
        <h1 className={`text-2xl font-bold tracking-tight transition-all duration-200 ${collapsed ? "lg:hidden" : ""}`}>SS Mart Admin</h1>
        <button
          className="lg:hidden text-white text-2xl focus:outline-none"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          &times;
        </button>
      </div>
      <button
        className="hidden lg:block mb-6 mx-4 px-2 py-1 rounded bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? ">" : "<"}
      </button>
      <ul className="flex-1 overflow-y-auto px-2" aria-label="Sidebar navigation">
        {navLinks.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block px-4 py-2 rounded hover:bg-green-800 focus:bg-green-700 focus:outline-none transition font-medium"
              tabIndex={0}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function AdminHeader({ onMenu }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow flex items-center justify-between px-6 py-4 z-50" style={{ height: 64 }}>
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-green-900 text-2xl focus:outline-none"
          onClick={onMenu}
          aria-label="Open sidebar"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <span className="text-green-900 text-xl font-semibold tracking-tight">Admin Panel</span>
      </div>
      <div>
        <Link href="/" className="text-green-700 hover:underline font-medium">Back to Store</Link>
      </div>
    </header>
  );
}

function AdminFooter() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-green-900 text-white text-center py-3 z-50 shadow-inner" style={{ height: 48 }}>
      &copy; {new Date().getFullYear()} SS Mart Admin Panel
    </footer>
  );
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-green-50">
      <AdminHeader onMenu={() => setSidebarOpen(true)} />
      <div className="flex pt-[64px] pb-[48px] min-h-screen">
        {/* Sidebar for desktop & drawer for mobile */}
        <div className={sidebarCollapsed ? "hidden lg:block" : "block"}>
          <AdminSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(c => !c)}
          />
        </div>
        {/* Overlay for mobile drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Sidebar overlay"
          />
        )}
        {/* Main content area */}
        <main
          className={`flex-1 px-4 md:px-8 w-full max-w-screen-2xl mx-auto transition-all duration-200 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}
          style={{ minHeight: "calc(100vh - 64px - 48px)", paddingBottom: "2rem" }}
          tabIndex={0}
        >
          {children}
        </main>
      </div>
      <AdminFooter />
    </div>
  );
}
