// app/admin/users/page.js
"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        let query = supabase.from("auth.users").select("id, email, created_at");
        if (search) query = query.ilike("email", `%${search}%`);
        const { data, error } = await query.range((page - 1) * pageSize, page * pageSize - 1);
        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        setError("Failed to fetch users.");
      }
      setLoading(false);
    }
    fetchUsers();
  }, [search, page]);

  async function handleDelete(id) {
    // Implement user delete logic (Supabase admin API)
    alert("Delete user " + id);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-800 mb-6">User Management</h2>
      <input
        type="text"
        placeholder="Search by email"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      {loading ? <div>Loading...</div> : error ? <div className="text-red-600">{error}</div> : (
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-green-100">
              <th className="p-2">Email</th>
              <th className="p-2">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="bg-white shadow rounded">
                <td className="p-2">{user.email}</td>
                <td className="p-2">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="p-2">
                  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-green-200 rounded">Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={users.length < pageSize} className="px-4 py-2 bg-green-200 rounded">Next</button>
      </div>
    </div>
  );
}
