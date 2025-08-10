// app/admin/dashboard/layout.js
import React from 'react';
import styles from '../../styles/AdminDashboard.module.css';

export default function AdminDashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className={styles.sidebar}>
        <nav>
          <a href="/admin/dashboard/users">Users</a>
          <a href="/admin/dashboard/products">Products</a>
          <a href="/admin/dashboard/orders">Orders</a>
          <a href="/admin/dashboard/analytics">Analytics</a>
        </nav>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
