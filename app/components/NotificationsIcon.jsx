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
      className="bg-transparent border-none relative ml-4 cursor-pointer focus:outline-none"
    >
      <span className="text-2xl text-white">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
