
"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PAGE_SIZE = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ role: "", active: true });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError("");
      let query = supabase.from("users").select("id, email, name, role, active, created_at", { count: "exact" });
      if (search) query = query.ilike("email", `%${search}%`);
      const { data, error, count } = await query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
      if (error) setError(error.message);
      setUsers(data || []);
      setTotal(count || 0);
      setLoading(false);
    }
    fetchUsers();
  }, [search, page, success]);

  function openEditModal(user) {
    setEditUser(user);
    setEditForm({ role: user.role, active: user.active });
    setModalType("edit");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditUser(null);
    setEditForm({ role: "", active: true });
    setModalType("");
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setError("");
    const { error } = await supabase
      .from("users")
      .update({ role: editForm.role, active: editForm.active })
      .eq("id", editUser.id);
    if (error) setError(error.message);
    else setSuccess("User updated successfully.");
    closeModal();
  }

  async function handleDelete(user) {
    if (!window.confirm(`Are you sure you want to delete user ${user.email}?`)) return;
    setError("");
    const { error } = await supabase.from("users").delete().eq("id", user.id);
    if (error) setError(error.message);
    else setSuccess("User deleted.");
  }

  function handleInputChange(e) {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-6">User Management</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-2 border rounded w-64"
        />
      </div>
      {success && <div className="text-green-700 mb-2">{success}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No users found.<br />Invite or add new users to get started.</div>
      ) : (
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-green-100">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="bg-white shadow rounded">
                <td className="p-2">{user.name || <span className="text-gray-400">N/A</span>}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{user.active ? "Active" : <span className="text-red-600">Inactive</span>}</td>
                <td className="p-2">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="p-2 flex gap-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" onClick={() => openEditModal(user)}>Edit</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleDelete(user)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-green-200 rounded">Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page * PAGE_SIZE >= total} className="px-4 py-2 bg-green-200 rounded">Next</button>
      </div>

      {/* Edit Modal */}
      {showModal && modalType === "edit" && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Role</label>
                <select name="role" value={editForm.role} onChange={handleInputChange} className="w-full p-2 border rounded">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Status</label>
                <select name="active" value={editForm.active} onChange={e => setEditForm(f => ({ ...f, active: e.target.value === "true" }))} className="w-full p-2 border rounded">
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={closeModal}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
