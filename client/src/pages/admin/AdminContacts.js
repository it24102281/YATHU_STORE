import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Reply, Trash2, MailOpen, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminContacts = () => {
  const { api, getAuthHeaders } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/contacts', { headers: getAuthHeaders() });
      if (res.data && res.data.data) {
        setContacts(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-500" />
            Manage Contacts
          </h1>
          <p className="text-gray-400 mt-1">
            Review and reply to user inquiries
          </p>
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div className="text-sm font-medium text-gray-400">
            Total Messages: <span className="text-white">{filteredContacts.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0a0a0a] text-gray-400 font-semibold border-b border-white/5 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Message Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                      Loading messages...
                    </div>
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-500 font-medium">
                    <MailOpen className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact, i) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={contact._id || i}
                    className={`transition-colors group ${contact.status === 'read' ? 'bg-transparent hover:bg-white/[0.02]' : 'bg-purple-500/[0.03] hover:bg-purple-500/[0.06]'}`}
                  >
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${contact.status === 'read' ? 'bg-transparent' : 'bg-purple-500'}`} />
                        <span className={contact.status === 'read' ? 'text-gray-300' : 'text-white'}>
                          {contact.name || 'Anonymous User'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2"><Mail className="w-3 h-3" /> {contact.email}</span>
                        {contact.phone && <span className="text-xs">{contact.phone}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(contact.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-lg font-bold ${contact.status === 'read'
                          ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                        {contact.status === 'read' ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-purple-400 rounded-lg transition-colors inline-block" title="Reply">
                        <Reply className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors inline-block" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;
