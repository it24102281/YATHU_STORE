import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Search, Shield, ShieldBan, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const emptyEditForm = {
  fullName: '',
  email: '',
  whatsappNumber: '',
  role: 'customer',
  isBlocked: false,
};

const AdminUsers = () => {
  const { api, getAuthHeaders } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async (term = '') => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users${term ? `?search=${encodeURIComponent(term)}` : ''}`, {
        headers: getAuthHeaders(),
      });
      setUsers(res.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return users;
    return users.filter((user) =>
      [user.fullName, user.email, user.whatsappNumber].some((value) => value?.toLowerCase().includes(term))
    );
  }, [users, search]);

  const openView = async (user) => {
    setSelectedUser(user);
    try {
      const res = await api.get(`/admin/users/${user.id}/orders`, { headers: getAuthHeaders() });
      setUserOrders(res.data?.data || []);
    } catch (error) {
      setUserOrders([]);
      toast.error(error.response?.data?.message || 'Failed to load order history');
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      whatsappNumber: user.whatsappNumber,
      role: user.role,
      isBlocked: user.status === 'Blocked',
    });
  };

  const closeModals = () => {
    setSelectedUser(null);
    setUserOrders([]);
    setEditingUser(null);
    setEditForm(emptyEditForm);
  };

  const saveUser = async () => {
    try {
      setSaving(true);
      const res = await api.put(`/admin/users/${editingUser.id}`, editForm, { headers: getAuthHeaders() });
      setUsers((prev) => prev.map((user) => (user.id === editingUser.id ? res.data.data : user)));
      toast.success('User updated successfully');
      setEditingUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (url, method, successMessage) => {
    try {
      const response =
        method === 'delete'
          ? await api.delete(url, { headers: getAuthHeaders() })
          : await api.put(url, {}, { headers: getAuthHeaders() });

      toast.success(successMessage || response.data?.message);
      fetchUsers(search);
      closeModals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-500" />
            Users Management
          </h1>
          <p className="text-gray-400 mt-1">View, search, update, block, and manage customer accounts.</p>
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search users by name, email, or WhatsApp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div className="text-sm font-medium text-gray-400">
            Total: <span className="text-white">{filteredUsers.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[320px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0a0a0a] text-gray-400 font-semibold border-b border-white/5 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">WhatsApp</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="7" className="py-20 text-center text-gray-500">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="7" className="py-20 text-center text-gray-500">No users found</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{user.fullName}</td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 text-gray-300">{user.whatsappNumber}</td>
                  <td className="px-6 py-4 text-purple-300 font-semibold capitalize">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-lg font-bold border ${user.status === 'Blocked' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openView(user)} className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(user)} className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg"><Shield className="w-4 h-4" /></button>
                      {user.status === 'Blocked' ? (
                        <button onClick={() => runAction(`/admin/users/${user.id}/unblock`, 'put', 'User unblocked successfully')} className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-lg">
                          <Shield className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => runAction(`/admin/users/${user.id}/block`, 'put', 'User blocked successfully')} className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 rounded-lg">
                          <ShieldBan className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => runAction(`/admin/users/${user.id}`, 'delete', 'User deleted successfully')} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#09090d] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">{selectedUser.fullName}</h2>
                <p className="text-gray-400 mt-1">{selectedUser.email}</p>
              </div>
              <button onClick={closeModals} className="text-gray-400 hover:text-white">Close</button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-gray-300">WhatsApp: {selectedUser.whatsappNumber}</div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-gray-300">Role: {selectedUser.role}</div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-gray-300">Status: {selectedUser.status}</div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-gray-300">Created: {new Date(selectedUser.createdAt).toLocaleString()}</div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold text-white">Order History</h3>
              {userOrders.length === 0 ? (
                <p className="mt-4 text-gray-400">No orders found</p>
              ) : (
                <div className="mt-4 grid gap-3">
                  {userOrders.map((order) => (
                    <div key={order._id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-white font-semibold">{order.productName}</p>
                        <p className="text-sm text-gray-400">{order.category || 'General'} • {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm text-right">
                        <p className="text-purple-300 font-bold">LKR {order.price}</p>
                        <p className="text-gray-400">{order.paymentStatus} / {order.orderStatus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#09090d] p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-white">Edit User</h2>
              <button onClick={closeModals} className="text-gray-400 hover:text-white">Close</button>
            </div>

            <div className="mt-6 grid gap-4">
              <input value={editForm.fullName} onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" placeholder="Full name" />
              <input value={editForm.email} onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" placeholder="Email" />
              <input value={editForm.whatsappNumber} onChange={(e) => setEditForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" placeholder="WhatsApp number" />
              <select value={editForm.role} onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="customer">customer</option>
                <option value="admin">admin</option>
              </select>
              <label className="inline-flex items-center gap-3 text-gray-300">
                <input type="checkbox" checked={editForm.isBlocked} onChange={(e) => setEditForm((prev) => ({ ...prev, isBlocked: e.target.checked }))} />
                Block this user
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModals} className="rounded-2xl border border-white/10 px-5 py-3 text-gray-300">Cancel</button>
              <button onClick={saveUser} disabled={saving} className="rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3 text-white font-bold disabled:opacity-60">
                {saving ? 'Saving...' : 'Save User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
