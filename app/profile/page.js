// app/profile/page.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', avatar_url: '', addresses: [] });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', avatar_url: '' });
  const [addressForm, setAddressForm] = useState({ address: '' });
  const [addresses, setAddresses] = useState([]);
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingOrders, setLoadingOrders] = useState(true);
  const router = useRouter();

  // Protect page: only logged-in users
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  // Fetch profile info
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('name, email, phone, avatar_url, addresses')
        .eq('id', user.id)
        .single();
      if (data) {
        setProfile(data);
        setForm({ name: data.name || '', phone: data.phone || '', avatar_url: data.avatar_url || '' });
        setAddresses(data.addresses || []);
      }
    }
    fetchProfile();
  }, [user]);

  // Fetch order history
  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select('order_id, created_at, status, total_price')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setOrders(data || []);
      setLoadingOrders(false);
    }
    fetchOrders();
  }, [user]);

  // Handle profile update
  async function handleProfileUpdate(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.phone) {
      setError('Name and phone are required.');
      return;
    }
    const { error } = await supabase
      .from('profiles')
      .update({ name: form.name, phone: form.phone, avatar_url: form.avatar_url })
      .eq('id', user.id);
    if (error) setError(error.message);
    else setSuccess('Profile updated!');
    setProfile({ ...profile, name: form.name, phone: form.phone, avatar_url: form.avatar_url });
  }

  // Fetch order details
  // Handle avatar upload
  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const { data, error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
    if (error) {
      setError('Avatar upload failed: ' + error.message);
      setAvatarLoading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    setForm({ ...form, avatar_url: urlData.publicUrl });
    setAvatarLoading(false);
    setSuccess('Profile picture updated!');
  }

  // Handle address add
  async function handleAddAddress(e) {
    e.preventDefault();
    setAddressError('');
    setAddressSuccess('');
    if (!addressForm.address) {
      setAddressError('Address required.');
      return;
    }
    const newAddresses = [...addresses, addressForm.address];
    const { error } = await supabase
      .from('profiles')
      .update({ addresses: newAddresses })
      .eq('id', user.id);
    if (error) setAddressError(error.message);
    else {
      setAddresses(newAddresses);
      setAddressForm({ address: '' });
      setAddressSuccess('Address added!');
    }
  }

  // Handle address delete
  async function handleDeleteAddress(idx) {
    const newAddresses = addresses.filter((_, i) => i !== idx);
    const { error } = await supabase
      .from('profiles')
      .update({ addresses: newAddresses })
      .eq('id', user.id);
    if (!error) setAddresses(newAddresses);
  }

  // Handle password change
  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      setPasswordError('Both fields required.');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
    if (error) setPasswordError(error.message);
    else setPasswordSuccess('Password changed!');
    setPasswordForm({ oldPassword: '', newPassword: '' });
  }
  async function fetchOrderDetails(order_id) {
    setSelectedOrder(null);
    const { data, error } = await supabase
      .from('order_items')
      .select('product_id, quantity, price, products(name, image_url)')
      .eq('order_id', order_id);
    const { data: orderData } = await supabase
      .from('orders')
      .select('address, phone, created_at, status, total_price')
      .eq('order_id', order_id)
      .single();
    setSelectedOrder({ items: data || [], ...orderData });
  }

  if (loading || !user) return <div className="text-center mt-16">Loading...</div>;

  return (
    <main className="min-h-screen bg-green-50 font-['Roboto'] text-gray-900">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Profile</h1>
        <form className="bg-white rounded-lg shadow border p-6 mb-8" onSubmit={handleProfileUpdate}>
          <div className="mb-4 flex items-center">
            <label className="block mb-1 font-medium mr-4">Profile Picture</label>
            <img src={form.avatar_url || '/placeholder.png'} alt="avatar" className="w-16 h-16 rounded-full mr-4 object-cover border" />
            <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={avatarLoading} />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input className="w-full p-2 border border-green-700 rounded" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input className="w-full p-2 border border-green-700 rounded bg-gray-100" value={profile.email} disabled />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Phone</label>
            <input className="w-full p-2 border border-green-700 rounded" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {success && <div className="text-green-700 mb-2">{success}</div>}
          <button className="bg-green-700 text-white px-6 py-2 rounded font-medium" type="submit">Update Profile</button>
        </form>
        <div className="bg-white rounded-lg shadow border p-6 mb-8">
          <h2 className="text-lg font-bold text-green-700 mb-2">Saved Addresses</h2>
          <form className="mb-4 flex" onSubmit={handleAddAddress}>
            <input className="w-full p-2 border border-green-700 rounded mr-2" value={addressForm.address} onChange={e => setAddressForm({ address: e.target.value })} placeholder="Add new address" required />
            <button className="bg-green-700 text-white px-4 py-2 rounded font-medium" type="submit">Add</button>
          </form>
          {addressError && <div className="text-red-600 mb-2">{addressError}</div>}
          {addressSuccess && <div className="text-green-700 mb-2">{addressSuccess}</div>}
          <ul>
            {addresses.map((addr, idx) => (
              <li key={idx} className="flex justify-between items-center mb-2">
                <span>{addr}</span>
                <button className="text-red-600 ml-2" onClick={() => handleDeleteAddress(idx)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <form className="bg-white rounded-lg shadow border p-6 mb-8" onSubmit={handleChangePassword}>
          <h2 className="text-lg font-bold text-green-700 mb-2">Change Password</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Current Password</label>
            <input type="password" className="w-full p-2 border border-green-700 rounded" value={passwordForm.oldPassword} onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">New Password</label>
            <input type="password" className="w-full p-2 border border-green-700 rounded" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
          </div>
          {passwordError && <div className="text-red-600 mb-2">{passwordError}</div>}
          {passwordSuccess && <div className="text-green-700 mb-2">{passwordSuccess}</div>}
          <button className="bg-green-700 text-white px-6 py-2 rounded font-medium" type="submit">Change Password</button>
        </form>
        <h2 className="text-xl font-bold text-green-700 mb-4">Order History</h2>
        {loadingOrders ? (
          <div>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <ul className="mb-8">
            {orders.map(order => (
              <li key={order.order_id} className="mb-4 p-4 bg-white rounded shadow border cursor-pointer" onClick={() => fetchOrderDetails(order.order_id)}>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Order #{order.order_id}</span>
                  <span className="text-green-700">{order.status}</span>
                </div>
                <div className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</div>
                <div className="font-bold">Total: ${order.total_price}</div>
              </li>
            ))}
          </ul>
        )}
        {selectedOrder && (
          <div className="bg-white rounded-lg shadow border p-6 mb-8">
            <h3 className="text-lg font-bold mb-2">Order Details</h3>
            <div className="mb-2">Status: <span className="font-medium text-green-700">{selectedOrder.status}</span></div>
            <div className="mb-2">Date: {new Date(selectedOrder.created_at).toLocaleString()}</div>
            <div className="mb-2">Delivery Address: {selectedOrder.address}</div>
            <div className="mb-2">Phone: {selectedOrder.phone}</div>
            <div className="mb-2 font-bold">Total: ${selectedOrder.total_price}</div>
            <h4 className="font-bold mt-4 mb-2">Products</h4>
            <ul>
              {selectedOrder.items.map(item => (
                <li key={item.product_id} className="mb-2 flex items-center">
                  <img src={item.products?.image_url || '/placeholder.png'} alt={item.products?.name} className="w-12 h-12 rounded mr-3 bg-green-100 object-cover" />
                  <span className="font-medium">{item.products?.name}</span> x {item.quantity} @ ${item.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
