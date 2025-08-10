// app/components/NotificationsIcon.jsx
"use client";
import React from 'react';
import { useNotifications } from './NotificationsContext';

export default function NotificationsIcon({ onClick }) {
  const { unreadCount } = useNotifications();

  return (
    <button
      aria-label="Notifications"
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        position: 'relative',
        marginLeft: 16,
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: 24, color: '#fff' }}>🔔</span>
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: -4,
          right: -8,
          background: '#d32f2f',
          color: '#fff',
          borderRadius: '50%',
          padding: '2px 7px',
          fontSize: '0.9rem',
          fontWeight: 700,
        }}>
          {unreadCount}
        </span>
      )}
    </button>
  );
}
