// app/admin-routes/dashboard/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthContext";

export default function AdminDashboardPage() {
  const { user, roles, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (!user || !roles.includes("admin"))) {
      setError("403 Forbidden: Admin access required.");
      setTimeout(() => router.push("/auth/sign-in"), 1500);
    }
  }, [user, roles, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red", textAlign: "center", marginTop: "4rem" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: "4rem auto", padding: "2rem", background: "#e6f9f0", borderRadius: 8 }}>
      <h2 style={{ color: "#155724" }}>Admin Dashboard</h2>
      <p>Welcome, admin! Here you can manage products, orders, and users.</p>
      {/* Add admin features/components here */}
    </div>
  );
}

// Comments:
// - Checks admin role client-side before rendering
// - Redirects unauthorized users to login
// - Ready for future server-side middleware integration
