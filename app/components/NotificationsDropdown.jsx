// app/components/NotificationsDropdown.jsx
import React from 'react';
import { useNotifications } from './NotificationsContext';

export default function NotificationsDropdown({ open, onClose }) {
  const { notifications, loading, error, markAsRead, markAllAsRead } = useNotifications();
  if (!open) return null;
  return (
    <div className="absolute top-14 right-6 w-[340px] bg-white shadow-2xl rounded-xl z-[3000] p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-green-700 text-base">Notifications</span>
        <button
          onClick={markAllAsRead}
          className="bg-transparent border-none text-green-700 font-medium hover:text-green-900 transition-colors cursor-pointer focus:outline-none"
        >
          Mark all as read
        </button>
      </div>
      {loading ? (
        <div className="text-gray-500 text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="text-gray-500 text-center">No notifications.</div>
      ) : (
        <ul className="list-none p-0 m-0">
          {notifications.map(n => (
            <li
              key={n.id}
              className={`py-3 px-2 border-b border-green-100 cursor-pointer ${n.read ? 'bg-green-50' : 'bg-green-100'}`}
              onClick={() => markAsRead(n.id)}
            >
              <div className={`font-${n.read ? 'normal' : 'bold'} ${n.read ? 'text-gray-900' : 'text-green-700'}`}>{n.message}</div>
              <div className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={onClose}
        className="mt-3 bg-green-700 text-white border-none rounded-lg py-2 px-4 font-medium cursor-pointer w-full hover:bg-green-800 transition-colors focus:outline-none"
      >
        Close
      </button>
    </div>
  );
}
