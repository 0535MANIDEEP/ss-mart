// app/components/NotificationsDropdown.jsx
"use client";
import React from 'react';
import { useNotifications } from './NotificationsContext';

export default function NotificationsDropdown({ open, onClose }) {
  const { notifications, loading, error, markAsRead, markAllAsRead } = useNotifications();

  if (!open) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 56,
      right: 24,
      width: 340,
      background: '#fff',
      boxShadow: '0 2px 12px rgba(67,160,71,0.18)',
      borderRadius: 12,
      zIndex: 3000,
      padding: '1rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontWeight: 700, color: '#43a047', fontSize: '1.1rem' }}>Notifications</span>
        <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', color: '#388e3c', fontWeight: 500, cursor: 'pointer' }}>Mark all as read</button>
      </div>
      {loading ? (
        <div style={{ color: '#888', textAlign: 'center' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: '#d32f2f', textAlign: 'center' }}>{error}</div>
      ) : notifications.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center' }}>No notifications.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {notifications.map(n => (
            <li key={n.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #e0f2f1', background: n.read ? '#f6fff6' : '#e8f5e9', cursor: 'pointer' }} onClick={() => markAsRead(n.id)}>
              <div style={{ fontWeight: n.read ? 400 : 700, color: n.read ? '#222' : '#43a047' }}>{n.message}</div>
              <div style={{ fontSize: '0.9rem', color: '#888', marginTop: 2 }}>{new Date(n.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={onClose} style={{ marginTop: 12, background: '#43a047', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 500, cursor: 'pointer', width: '100%' }}>Close</button>
    </div>
  );
}
