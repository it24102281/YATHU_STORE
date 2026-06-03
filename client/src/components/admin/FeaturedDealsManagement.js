import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Edit2,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const CATEGORY_OPTIONS = [
  'PUBG Services',
  'Premium Subscriptions',
  'Social Media Boosters',
];

const STOCK_OPTIONS = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'limited_stock', label: 'Limited Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];

const inputClass =
  'w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all duration-200';
const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
};

const defaultForm = {
  title: '',
  category: 'PUBG Services',
  subCategory: '',
  price: '',
  oldPrice: '',
  description: '',
  image: '',
  badge: '',
  isActive: true,
  stockStatus: 'in_stock',
  displayOrder: 0,
};

const buildPayload = (deal) => ({
  title: deal.title?.trim() || '',
  category: deal.category || 'PUBG Services',
  subCategory: deal.subCategory?.trim() || '',
  price: Number(deal.price || 0),
  oldPrice: deal.oldPrice === '' || deal.oldPrice === null || deal.oldPrice === undefined ? null : Number(deal.oldPrice),
  description: deal.description?.trim() || '',
  image: deal.image || '',
  badge: deal.badge?.trim() || '',
  isActive: Boolean(deal.isActive),
  stockStatus: deal.stockStatus || 'in_stock',
  displayOrder: Number(deal.displayOrder || 0),
});

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const ConfirmDeleteModal = ({ open, onClose, onConfirm, itemName }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[220] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.8)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          className="w-full max-w-md rounded-2xl p-6"
          style={{ background: '#101018', border: '1px solid rgba(239,68,68,0.28)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold text-white mb-2">Delete Featured Deal</h3>
          <p className="text-sm text-gray-400 mb-6">
            Delete <span className="text-white font-semibold">{itemName}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-300"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const FeaturedDealsManagement = () => {
  const { api, getAuthHeaders } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/featured-deals?includeInactive=true', { headers: getAuthHeaders() });
      setDeals(res.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load featured deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const filteredDeals = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return deals;

    return deals.filter((deal) =>
      [deal.title, deal.category, deal.subCategory, deal.badge, deal.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [deals, search]);

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const openCreate = () => {
    setEditingDeal(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const openEdit = (deal) => {
    setEditingDeal(deal);
    setForm({
      title: deal.title || '',
      category: deal.category || 'PUBG Services',
      subCategory: deal.subCategory || '',
      price: deal.price ?? '',
      oldPrice: deal.oldPrice ?? '',
      description: deal.description || '',
      image: deal.image || '',
      badge: deal.badge || '',
      isActive: Boolean(deal.isActive),
      stockStatus: deal.stockStatus || 'in_stock',
      displayOrder: deal.displayOrder ?? 0,
    });
    setShowForm(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setField('image', e.target?.result || '');
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.title.trim() || form.price === '') {
      toast.error('Title and price are required');
      return;
    }

    setSaving(true);

    try {
      const payload = buildPayload(form);

      if (editingDeal?._id) {
        await api.put(`/featured-deals/${editingDeal._id}`, payload, { headers: getAuthHeaders() });
        toast.success('Featured deal updated');
      } else {
        await api.post('/featured-deals', payload, { headers: getAuthHeaders() });
        toast.success('Featured deal added');
      }

      setShowForm(false);
      setEditingDeal(null);
      setForm(defaultForm);
      fetchDeals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save featured deal');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (deal) => {
    try {
      await api.put(
        `/featured-deals/${deal._id}`,
        buildPayload({ ...deal, isActive: !deal.isActive }),
        { headers: getAuthHeaders() }
      );
      toast.success(deal.isActive ? 'Deal disabled' : 'Deal enabled');
      fetchDeals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update deal status');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      await api.delete(`/featured-deals/${deleteTarget._id}`, { headers: getAuthHeaders() });
      toast.success('Featured deal deleted');
      setDeleteTarget(null);
      fetchDeals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete featured deal');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Featured Deals</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add, update, sort, and control what appears in the homepage Featured Deals section.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search featured deals..."
              className={`${inputClass} pl-10`}
              style={inputStyle}
            />
          </div>

          <button
            onClick={fetchDeals}
            className="p-3 rounded-xl text-gray-300 hover:text-white transition-colors"
            style={inputStyle}
            aria-label="Refresh featured deals"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}
          >
            <Plus className="w-4 h-4" />
            Add Deal
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
        </div>
      ) : filteredDeals.length === 0 ? (
        <div
          className="rounded-3xl p-12 text-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.15)' }}
        >
          <CheckCircle2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No featured deals found</h3>
          <p className="text-gray-500">Create your first item or adjust the search to see more results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredDeals.map((deal) => (
            <div
              key={deal._id}
              className="rounded-3xl p-5"
              style={{ background: 'linear-gradient(145deg, rgba(139,92,246,0.08), rgba(12,12,18,0.95))', border: '1px solid rgba(139,92,246,0.14)' }}
            >
              <div className="flex gap-4">
                <div
                  className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {deal.image ? (
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-purple-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-white">{deal.title}</h3>
                      <p className="text-sm text-purple-300">{deal.category}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(deal)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={
                        deal.isActive
                          ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }
                          : { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }
                      }
                    >
                      {deal.isActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                      {deal.isActive ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <p className="text-sm text-gray-400 mt-3 line-clamp-2">{deal.description || 'No description added yet.'}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(139,92,246,0.12)', color: '#d8b4fe' }}>
                      {deal.subCategory || 'No sub category'}
                    </span>
                    {deal.badge ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd' }}>
                        {deal.badge}
                      </span>
                    ) : null}
                    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
                      {STOCK_OPTIONS.find((option) => option.value === deal.stockStatus)?.label || 'In Stock'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.07)', color: '#d1d5db' }}>
                      Order #{deal.displayOrder ?? 0}
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-4 mt-5">
                    <div>
                      <div className="text-lg font-black text-white">LKR {Number(deal.price || 0).toLocaleString()}</div>
                      {deal.oldPrice ? (
                        <div className="text-sm text-gray-500 line-through">LKR {Number(deal.oldPrice).toLocaleString()}</div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(deal)} className="p-2.5 rounded-xl text-blue-400 hover:bg-blue-500/10 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(deal)} className="p-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] flex items-start justify-center p-4 overflow-y-auto"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="w-full max-w-3xl my-8 rounded-3xl overflow-hidden"
              style={{ background: '#0f0f16', border: '1px solid rgba(139,92,246,0.25)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ background: 'rgba(139,92,246,0.1)', borderBottom: '1px solid rgba(139,92,246,0.18)' }}
              >
                <div>
                  <h3 className="text-lg font-bold text-white">{editingDeal ? 'Edit Featured Deal' : 'Add Featured Deal'}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">All user-side cards are rendered from this inventory data.</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Title *">
                    <input value={form.title} onChange={(e) => setField('title', e.target.value)} className={inputClass} style={inputStyle} />
                  </Field>
                  <Field label="Category *">
                    <select value={form.category} onChange={(e) => setField('category', e.target.value)} className={inputClass} style={inputStyle}>
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option} value={option} style={{ background: '#111827' }}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Sub Category">
                    <input value={form.subCategory} onChange={(e) => setField('subCategory', e.target.value)} className={inputClass} style={inputStyle} />
                  </Field>
                  <Field label="Badge Text">
                    <input value={form.badge} onChange={(e) => setField('badge', e.target.value)} placeholder="Popular, New, Best Value..." className={inputClass} style={inputStyle} />
                  </Field>
                  <Field label="Price *">
                    <input type="number" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} className={inputClass} style={inputStyle} />
                  </Field>
                  <Field label="Old Price">
                    <input type="number" min="0" value={form.oldPrice} onChange={(e) => setField('oldPrice', e.target.value)} className={inputClass} style={inputStyle} />
                  </Field>
                  <Field label="Stock Status">
                    <select value={form.stockStatus} onChange={(e) => setField('stockStatus', e.target.value)} className={inputClass} style={inputStyle}>
                      {STOCK_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value} style={{ background: '#111827' }}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Display Order">
                    <input type="number" value={form.displayOrder} onChange={(e) => setField('displayOrder', e.target.value)} className={inputClass} style={inputStyle} />
                  </Field>
                </div>

                <Field label="Description">
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                    placeholder="Short product description for customers"
                  />
                </Field>

                <Field label="Image Upload">
                  <div className="space-y-3">
                    <label
                      className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/15 px-4 py-5 text-center transition-all hover:border-purple-400/60 hover:bg-white/5"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      <div>
                        <div className="text-sm font-semibold text-white">Upload featured deal image</div>
                        <div className="mt-1 text-xs text-gray-400">PNG, JPG, or WEBP</div>
                      </div>
                    </label>

                    <input
                      value={form.image}
                      onChange={(e) => setField('image', e.target.value)}
                      placeholder="Or paste an image URL"
                      className={inputClass}
                      style={inputStyle}
                    />

                    {form.image ? (
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                        <img src={form.image} alt="Featured deal preview" className="h-44 w-full object-cover" />
                      </div>
                    ) : null}
                  </div>
                </Field>

                <Field label="Visibility">
                  <button
                    type="button"
                    onClick={() => setField('isActive', !form.isActive)}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
                    style={
                      form.isActive
                        ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }
                        : { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }
                    }
                  >
                    {form.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {form.isActive ? 'Enabled on user side' : 'Hidden from user side'}
                  </button>
                </Field>
              </div>

              <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-300"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}
                >
                  {saving ? 'Saving...' : editingDeal ? 'Update Deal' : 'Create Deal'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.title}
      />
    </div>
  );
};

export default FeaturedDealsManagement;
