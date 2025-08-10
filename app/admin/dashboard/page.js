"use client";
// Admin Dashboard Page
import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AdminDashboardPage() {
  return (
    <div style={{ maxWidth: 800, margin: "4rem auto", padding: "2rem", background: "#e6f9f0", borderRadius: 8 }}>
      <h2 style={{ color: "#155724" }}>Admin Dashboard</h2>
      <p>Welcome, admin! Here you can manage products, orders, and users.</p>
      {/* Add admin features/components here */}
    </div>
  );
}
