
"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      let query = supabase.from("users").select("*");
      if (search) query = query.ilike("email", `%${search}%`);
      const { data, error } = await query;
      if (error) setError(error.message);
      setUsers(data || []);
      setLoading(false);
    }
    fetchUsers();
  }, [search]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Users</h2>
      <input
        type="text"
        placeholder="Search by email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-xs p-2 border border-green-400 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-600 font-medium mb-2">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-gray-400 text-center py-12">No users found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-green-100">
                <th className="p-3 text-left font-semibold text-green-800">Email</th>
                <th className="p-3 text-left font-semibold text-green-800">Name</th>
                <th className="p-3 text-left font-semibold text-green-800">Status</th>
                <th className="p-3 text-left font-semibold text-green-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-green-50">
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">
                    <span className={user.active ? "text-green-700 font-medium" : "text-red-600 font-medium"}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">View</button>
                    <button className={user.active ? "bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition" : "bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"}>
                      {user.active ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
