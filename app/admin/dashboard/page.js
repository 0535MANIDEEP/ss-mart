"use client";
// Admin Dashboard Page
import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-3xl mx-auto my-16 p-8 bg-green-50 rounded-lg">
      <h2 className="text-2xl font-bold text-green-900 mb-2">Admin Dashboard</h2>
      <p className="text-green-900">Welcome, admin! Here you can manage products, orders, and users.</p>
      {/* Add admin features/components here */}
    </div>
  );
}
