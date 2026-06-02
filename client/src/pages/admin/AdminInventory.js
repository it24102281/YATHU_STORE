import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Search, X, CheckCircle, AlertCircle,
  Play, Image, Youtube, HardDrive, ToggleLeft, ToggleRight,
  Star, Package, Gamepad2, RefreshCw,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { extractYouTubeId, getYouTubeThumbnail, getAutoThumbnail } from '../../utils/video';

/* ── Shared helpers ──────────────────────────────────────────── */
const inputCls = {
  base: 'w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200',
  style: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' },
};
const focusStyle = (e) => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; };
const blurStyle  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; };

const Label = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{children}</label>
);
const Field = ({ label, children }) => (
  <div><Label>{label}</Label>{children}</div>
);

/* ── Delete Confirm Modal ────────────────────────────────────── */
const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm rounded-2xl p-6"
          style={{ background: '#111', border: '1px solid rgba(239,68,68,0.3)' }}
          onClick={e => e.stopPropagation()}>
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
            <Trash2 className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-white font-bold text-lg text-center mb-2">Confirm Delete</h3>
          <p className="text-gray-400 text-sm text-center mb-6">{message || 'This action cannot be undone.'}</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-300 transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>Delete</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ══════════════════════════════════════════════════════════════
   ACCOUNTS TAB
══════════════════════════════════════════════════════════════ */

const RANKS      = ['Bronze','Silver','Gold','Platinum','Diamond','Ace','Master','Conqueror'];
const CATEGORIES = ['Standard','Premium','Elite','Rare'];
const SERVERS    = ['Asia','Europe','America','Korea','Taiwan/Hong Kong/Macau','Any'];
const LOGIN_METHODS = ['Facebook','Google','Twitter','Guest','Any','All Logins Cleared'];

const defaultAccount = {
  accountId: '', price: '', level: 1,
  loginMethods: [],
  description: '', videoType: 'none', videoUrl: '', thumbnailUrl: '',
  features: [], skins: [], gunSkins: [],
  status: 'available', featured: false,
};

const AccountsTab = ({ api }) => {
  const [accounts, setAccounts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(defaultAccount);
  const [saving, setSaving]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [customThumbFile, setCustomThumbFile] = useState(null);

  // Dynamic list helpers
  const [featureInput, setFeatureInput] = useState('');
  const [skinInput, setSkinInput]       = useState('');
  const [gunSkinInput, setGunSkinInput] = useState('');

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts?limit=100&status=all&sortBy=createdAt&sortOrder=desc');
      setAccounts(res.data.data || []);
    } catch { toast.error('Failed to load accounts'); }
    finally { setLoading(false); }
  }, [api]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  /* ── Thumbnail auto-resolve ────────────────────────────────── */
  const resolvedThumb = (() => {
    if (customThumbFile) return customThumbFile;
    if (form.thumbnailUrl) return form.thumbnailUrl;
    if (form.videoType === 'youtube' && form.videoUrl) {
      const id = extractYouTubeId(form.videoUrl);
      return id ? getYouTubeThumbnail(id) : null;
    }
    return null;
  })();

  /* ── Form helpers ─────────────────────────────────────────── */
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => {
    setEditing(null);
    setForm(defaultAccount);
    setCustomThumbFile(null);
    setFeatureInput(''); setSkinInput(''); setGunSkinInput('');
    setShowForm(true);
  };

  const openEdit = (acc) => {
    setEditing(acc._id);
    setForm({
      accountId: acc.accountId || '', price: acc.price || '', level: acc.level || 1,
      loginMethods: acc.loginMethods || [],
      description: acc.description || '', videoType: acc.videoType || 'none',
      videoUrl: acc.videoUrl || '', thumbnailUrl: acc.thumbnailUrl || '',
      features: acc.features || [], skins: acc.skins || [], gunSkins: acc.gunSkins || [],
      status: acc.status || 'available', featured: acc.featured || false,
    });
    setCustomThumbFile(null);
    setFeatureInput(''); setSkinInput(''); setGunSkinInput('');
    setShowForm(true);
  };

  const handleThumbUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setCustomThumbFile(ev.target.result);
    reader.readAsDataURL(file);
  };

  const addToList = (key, val, setVal) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    setF(key, [...form[key], trimmed]);
    setVal('');
  };
  const removeFromList = (key, idx) => setF(key, form[key].filter((_, i) => i !== idx));

  const handleSave = async () => {
    if (!form.accountId || !form.price) { toast.error('Account ID and price are required'); return; }
    if (form.loginMethods.length === 0) { toast.error('Select at least one login method'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        level: Number(form.level),
        thumbnailUrl: customThumbFile || form.thumbnailUrl,
      };
      if (editing) {
        await api.put(`/accounts/${editing}`, payload);
        toast.success('Account updated!');
      } else {
        await api.post('/accounts', payload);
        toast.success('Account added!');
      }
      setShowForm(false);
      fetchAccounts();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/accounts/${deleteTarget}`);
      toast.success('Account deleted');
      setDeleteTarget(null);
      fetchAccounts();
    } catch { toast.error('Delete failed'); }
  };

  const toggleStatus = async (acc) => {
    const next = acc.status === 'available' ? 'sold' : 'available';
    try {
      await api.patch(`/accounts/${acc._id}/status`, { status: next });
      toast.success(`Marked as ${next}`);
      fetchAccounts();
    } catch { toast.error('Status update failed'); }
  };

  const filtered = accounts.filter(a =>
    a.accountId?.toLowerCase().includes(search.toLowerCase()) ||
    a.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-52 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search accounts..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
            style={inputCls.style} onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <button onClick={fetchAccounts} className="p-2.5 rounded-xl text-gray-400 hover:text-white transition-colors"
          style={inputCls.style}><RefreshCw className="w-4 h-4" /></button>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
          style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
          <Plus className="w-4 h-4" /> Add Account
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🎮</div>
          <p className="text-gray-400">No accounts found</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.15)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(139,92,246,0.1)', borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
                  {['Thumbnail','Account ID','Login Methods','Price','Level','Status','Featured','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((acc, i) => {
                  const thumb = acc.thumbnailUrl || getAutoThumbnail(acc.videoType, acc.videoUrl) || (acc.images?.[0]);
                  return (
                    <tr key={acc._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'rgba(15,15,22,0.5)' : 'transparent' }}>
                      <td className="px-4 py-3">
                        <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ background: '#1a1028' }}>
                          {thumb
                            ? <img src={thumb} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-xl">🎮</div>
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white font-medium max-w-xs">
                        <div className="truncate">{acc.accountId}</div>
                        {acc.videoType !== 'none' && acc.videoUrl && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Play className="w-3 h-3 text-purple-400" />
                            <span className="text-xs text-purple-400">{acc.videoType === 'youtube' ? 'YouTube' : 'Drive'}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                        <div className="flex gap-1 flex-wrap">
                          {acc.loginMethods?.map((method, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-md" style={{ background: 'rgba(139,92,246,0.2)', color: '#c084fc' }}>{method}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white font-bold whitespace-nowrap">LKR {acc.price?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleStatus(acc)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                          style={acc.status === 'available'
                            ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }
                            : { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }
                          }>
                          {acc.status === 'available' ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                          {acc.status === 'available' ? 'Available' : 'Sold'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {acc.featured && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(acc)}
                            className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(acc._id)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Account Form Modal ──────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-start justify-center p-4 overflow-y-auto"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
              className="w-full max-w-3xl my-8 rounded-2xl overflow-hidden"
              style={{ background: '#0f0f16', border: '1px solid rgba(139,92,246,0.25)' }}
              onClick={e => e.stopPropagation()}>

              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4"
                style={{ background: 'rgba(139,92,246,0.1)', borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
                <div>
                  <h2 className="text-white font-bold text-lg">{editing ? 'Edit Account' : 'Add New Account'}</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Fill in the account details below</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"><X className="w-5 h-5" /></button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Account ID *">
                    <input value={form.accountId} onChange={e => setF('accountId', e.target.value)}
                      placeholder="e.g. ACC123 or 987654"
                      className={inputCls.base} style={inputCls.style} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                  <Field label="Price *">
                    <input type="text" value={form.price} onChange={e => setF('price', e.target.value)}
                      placeholder="e.g. 12000 or 150K"
                      className={inputCls.base} style={inputCls.style} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                  <Field label="Level">
                    <input type="number" value={form.level} onChange={e => setF('level', e.target.value)}
                      min={1} max={100}
                      className={inputCls.base} style={inputCls.style} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                  <Field label="Status">
                    <select value={form.status} onChange={e => setF('status', e.target.value)}
                      className={inputCls.base} style={inputCls.style}>
                      <option value="available" style={{ background: '#1a1a1a' }}>Available</option>
                      <option value="sold" style={{ background: '#1a1a1a' }}>Sold</option>
                    </select>
                  </Field>
                </div>

                {/* Login Methods */}
                <div className="p-4 rounded-2xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <Label>Login Methods * (Select at least one)</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {LOGIN_METHODS.map(method => {
                      const active = form.loginMethods?.includes(method);
                      return (
                        <button key={method} type="button"
                          onClick={() => {
                            if (active) {
                              setF('loginMethods', (form.loginMethods || []).filter(m => m !== method));
                            } else {
                              setF('loginMethods', [...(form.loginMethods || []), method]);
                            }
                          }}
                          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 select-none"
                          style={active
                            ? { background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', color: '#fff', border: '1px solid rgba(139,92,246,0.6)', boxShadow: '0 0 12px rgba(139,92,246,0.4)' }
                            : { background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }
                          }>
                          {method}
                        </button>
                      );
                    })}
                    {/* Clear All button */}
                    <button type="button"
                      onClick={() => setF('loginMethods', [])}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 select-none"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                      ✕ Clear All
                    </button>
                  </div>
                </div>

                {/* Description */}
                <Field label="Description">
                  <textarea value={form.description} onChange={e => setF('description', e.target.value)}
                    rows={3} placeholder="Describe the account..."
                    className={inputCls.base} style={{ ...inputCls.style, resize: 'vertical' }}
                    onFocus={focusStyle} onBlur={blurStyle} />
                </Field>

                {/* Video */}
                <div className="p-4 rounded-2xl space-y-4" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Play className="w-4 h-4 text-purple-400" />
                    <h4 className="text-white font-semibold text-sm">Video & Thumbnail</h4>
                  </div>
                  <Field label="Video Type">
                    <div className="flex gap-2">
                      {[{v:'none',l:'None'},{v:'youtube',l:'YouTube'},{v:'gdrive',l:'Google Drive'}].map(t => (
                        <button key={t.v} onClick={() => setF('videoType', t.v)}
                          className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                          style={form.videoType === t.v
                            ? { background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.5)', color: '#c084fc' }
                            : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
                          {t.l}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {form.videoType !== 'none' && (
                    <Field label={form.videoType === 'youtube' ? 'YouTube URL' : 'Google Drive URL'}>
                      <input value={form.videoUrl} onChange={e => setF('videoUrl', e.target.value)}
                        placeholder={form.videoType === 'youtube'
                          ? 'https://www.youtube.com/watch?v=...'
                          : 'https://drive.google.com/file/d/.../view'}
                        className={inputCls.base} style={inputCls.style} onFocus={focusStyle} onBlur={blurStyle} />
                    </Field>
                  )}

                  {/* Auto thumbnail preview */}
                  {resolvedThumb && (
                    <div className="flex items-center gap-4">
                      <img src={resolvedThumb} alt="Thumbnail preview" className="h-20 w-32 object-cover rounded-xl" style={{ border: '1px solid rgba(139,92,246,0.3)' }} />
                      <div className="text-xs text-gray-400">
                        {customThumbFile ? '📁 Custom upload' : form.videoType === 'youtube' ? '🎬 Auto from YouTube' : '🖼 Saved thumbnail'}
                      </div>
                    </div>
                  )}

                  {/* Custom thumbnail upload */}
                  <Field label="Custom Thumbnail (optional — overrides auto)">
                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all hover:border-purple-500/50"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)' }}>
                      <Image className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">{customThumbFile ? 'Thumbnail selected ✓' : 'Click to upload image'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleThumbUpload} />
                    </label>
                    {customThumbFile && (
                      <button onClick={() => setCustomThumbFile(null)} className="mt-1.5 flex items-center gap-1 text-xs text-gray-500 hover:text-red-400">
                        <X className="w-3 h-3" /> Remove custom thumbnail
                      </button>
                    )}
                  </Field>
                </div>

                {/* Features */}
                <div>
                  <Label>Features / Key Items</Label>
                  <div className="flex gap-2 mb-2">
                    <input value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addToList('features', featureInput, setFeatureInput); }}}
                      placeholder="e.g. Glacier M416, Mythic Set..."
                      className={inputCls.base} style={inputCls.style} onFocus={focusStyle} onBlur={blurStyle} />
                    <button onClick={() => addToList('features', featureInput, setFeatureInput)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                      style={{ background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.4)' }}>Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.features.map((f, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium"
                        style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#c084fc' }}>
                        {f}
                        <button onClick={() => removeFromList('features', i)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skins */}
                <div>
                  <Label>Outfit Skins</Label>
                  <div className="flex gap-2 mb-2">
                    <input value={skinInput} onChange={e => setSkinInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addToList('skins', skinInput, setSkinInput); }}}
                      placeholder="e.g. Ice Ranger Set"
                      className={inputCls.base} style={inputCls.style} onFocus={focusStyle} onBlur={blurStyle} />
                    <button onClick={() => addToList('skins', skinInput, setSkinInput)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                      style={{ background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.4)' }}>Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.skins.map((s, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
                        {s}<button onClick={() => removeFromList('skins', i)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gun Skins */}
                <div>
                  <Label>Gun Skins</Label>
                  <div className="flex gap-2 mb-2">
                    <input value={gunSkinInput} onChange={e => setGunSkinInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addToList('gunSkins', gunSkinInput, setGunSkinInput); }}}
                      placeholder="e.g. Glacier M416"
                      className={inputCls.base} style={inputCls.style} onFocus={focusStyle} onBlur={blurStyle} />
                    <button onClick={() => addToList('gunSkins', gunSkinInput, setGunSkinInput)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                      style={{ background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.4)' }}>Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.gunSkins.map((s, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs"
                        style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', color: '#fbbf24' }}>
                        {s}<button onClick={() => removeFromList('gunSkins', i)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setF('featured', !form.featured)}
                    className="w-10 h-6 rounded-full transition-all duration-300 flex items-center px-1"
                    style={{ background: form.featured ? 'linear-gradient(135deg,#8b5cf6,#a855f7)' : 'rgba(255,255,255,0.1)' }}>
                    <div className="w-4 h-4 rounded-full bg-white transition-transform duration-300"
                      style={{ transform: form.featured ? 'translateX(16px)' : 'translateX(0)' }} />
                  </div>
                  <span className="text-sm text-gray-300 font-medium">Mark as Featured</span>
                  {form.featured && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                </label>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-300 transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
                  {saving ? <><div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> Saving...</> : (editing ? 'Update Account' : 'Add Account')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        message="Are you sure you want to delete this account? This cannot be undone." />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   UC PACKAGES TAB
══════════════════════════════════════════════════════════════ */
const UC_AMOUNTS = [8100, 3850, 1800, 660];
const QR_LOGINS  = ['Facebook','Google','Twitter','Guest','Any'];

const defaultUC = {
  category: 'regular',
  ucAmounts: [],
  price: '', bonus: '', badge: 'none', status: 'available',
  topupMethod: '',   // 'login' | 'tag'
  qrLogin: '',       // which login for QR (only when topupMethod === 'login')
  description: '',
  image: '',
};

const UCTab = ({ api }) => {
  const [packages, setPackages]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(defaultUC);
  const [saving, setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/uc-packages?status=all');
      setPackages(res.data.data || []);
    } catch { toast.error('Failed to load UC packages'); }
    finally { setLoading(false); }
  }, [api]);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => {
    setEditing(null);
    setForm(defaultUC);
    setImagePreview('');
    setShowForm(true);
  };
  const openEdit = (pkg) => {
    setEditing(pkg._id);
    setForm({
      category: pkg.category || 'regular',
      ucAmounts: pkg.ucAmounts || (pkg.ucAmount ? [pkg.ucAmount] : []),
      price: pkg.price,
      bonus: pkg.bonus || '', badge: pkg.badge || 'none',
      status: pkg.status,
      topupMethod: pkg.topupMethod || '',
      qrLogin: pkg.qrLogin || '',
      description: pkg.description || '',
      image: pkg.image || '',
    });
    setImagePreview(pkg.image || '');
    setShowForm(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result || '';
      setF('image', result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.ucAmounts.length) { toast.error('Select at least one UC amount'); return; }
    if (!form.topupMethod) { toast.error('Select Login UC or Tag UC'); return; }
    if (!form.price) { toast.error('Price is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form };
      if (editing) {
        await api.put(`/uc-packages/${editing}`, payload);
        toast.success('UC package updated!');
      } else {
        await api.post('/uc-packages', payload);
        toast.success('UC package added!');
      }
      setShowForm(false);
      fetchPackages();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/uc-packages/${deleteTarget}`);
      toast.success('UC package deleted');
      setDeleteTarget(null);
      fetchPackages();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-white font-bold text-base">{packages.length} UC Packages</h3>
        <div className="flex gap-3">
          <button onClick={fetchPackages} className="p-2.5 rounded-xl text-gray-400 hover:text-white transition-colors"
            style={inputCls.style}><RefreshCw className="w-4 h-4" /></button>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
            <Plus className="w-4 h-4" /> Add Package
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">💎</div>
          <p className="text-gray-400">No UC packages yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div key={pkg._id} className="p-5 rounded-2xl"
              style={{ background: 'rgba(25,25,35,0.8)', border: '1px solid rgba(139,92,246,0.15)' }}>
              {pkg.image && (
                <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <img src={pkg.image} alt={`${pkg.ucAmount || 'UC'} package`} className="h-40 w-full object-cover" />
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-2xl font-black" style={{ color: '#a855f7' }}>{pkg.ucAmount?.toLocaleString()} UC</div>
                  <div className="text-white font-bold">LKR {pkg.price?.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(pkg)} className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(pkg._id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-xs font-bold mb-2" style={{ color: pkg.category === 'bonus' ? '#c084fc' : '#818cf8' }}>
                {pkg.category === 'bonus' ? '🎁 Bonus UC Pack' : '🎮 Regular UC Pack'}
              </div>
              {pkg.loginTag && (
                <div className="text-xs mb-2 px-2 py-1 rounded-lg w-fit"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                  🏷 {pkg.loginTag}
                </div>
              )}
              {pkg.bonus && <div className="text-sm text-purple-300 mb-2">🎁 {pkg.bonus}</div>}
              {pkg.description && (
                <p className="mb-3 text-sm leading-relaxed text-gray-300">{pkg.description}</p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {pkg.badge !== 'none' && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={pkg.badge === 'best-deal'
                      ? { background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }
                      : { background: 'rgba(139,92,246,0.2)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)' }}>
                    {pkg.badge === 'best-deal' ? '🏆 Best Deal' : '⭐ Popular'}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={pkg.status === 'available'
                    ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }
                    : { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }
                  }>
                  {pkg.status === 'available' ? '● Available' : '● Unavailable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UC Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ background: '#0f0f16', border: '1px solid rgba(139,92,246,0.25)' }}
              onClick={e => e.stopPropagation()}>

              <div className="flex items-center justify-between px-6 py-4"
                style={{ background: 'rgba(139,92,246,0.1)', borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
                <h2 className="text-white font-bold text-lg">{editing ? 'Edit UC Package' : 'Add UC Package'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

                {/* Category selector */}
                <Field label="Package Category *">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { v: 'regular', l: '🎮 Regular UC Pack', desc: 'Standard UC top-up' },
                      { v: 'bonus',   l: '🎁 Bonus UC Pack',   desc: 'With bonus/extra UC' },
                    ].map(c => (
                      <button key={c.v} type="button" onClick={() => setF('category', c.v)}
                        className="p-3 rounded-xl text-left transition-all"
                        style={form.category === c.v
                          ? { background: 'rgba(139,92,246,0.2)', border: '2px solid rgba(139,92,246,0.6)', color: '#fff' }
                          : { background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
                        <div className="text-sm font-bold">{c.l}</div>
                        <div className="text-xs mt-0.5 opacity-70">{c.desc}</div>
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Package Picture">
                  <div className="space-y-3">
                    <label
                      className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 px-4 py-5 text-center transition-all hover:border-purple-400/60 hover:bg-white/5"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      <div>
                        <div className="text-sm font-semibold text-white">Upload UC package picture</div>
                        <div className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</div>
                      </div>
                    </label>
                    {imagePreview && (
                      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                        <img src={imagePreview} alt="UC package preview" className="h-40 w-full object-cover" />
                      </div>
                    )}
                  </div>
                </Field>

                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={e => setF('description', e.target.value)}
                    placeholder="Type package details for customers"
                    rows={4}
                    className={`${inputCls.base} resize-none`}
                    style={inputCls.style}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </Field>

                {/* Divider */}
                <div className="rounded-xl p-4 space-y-4"
                  style={{ background: form.category === 'regular' ? 'rgba(99,102,241,0.06)' : 'rgba(139,92,246,0.06)', border: `1px solid ${form.category === 'regular' ? 'rgba(99,102,241,0.2)' : 'rgba(139,92,246,0.2)'}` }}>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: form.category === 'regular' ? '#818cf8' : '#c084fc' }}>
                    {form.category === 'regular' ? '🎮 Regular UC Details' : '🎁 Bonus UC Details'}
                  </p>

                  {/* UC Amounts */}
                  {form.category === 'regular' ? (
                    <div>
                      <Label>UC Amount * (select one or more)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {UC_AMOUNTS.map(amt => {
                          const active = form.ucAmounts.includes(amt);
                          return (
                            <button key={amt} type="button"
                              onClick={() => setF('ucAmounts', active ? form.ucAmounts.filter(a => a !== amt) : [...form.ucAmounts, amt])}
                              className="py-3 rounded-xl font-black text-base transition-all relative"
                              style={active
                                ? { background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', color: '#fff', border: '2px solid rgba(139,92,246,0.7)', boxShadow: '0 0 12px rgba(139,92,246,0.4)' }
                                : { background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '2px solid rgba(255,255,255,0.08)' }
                              }>
                              {active && <span className="absolute top-1.5 right-2 text-xs">✓</span>}
                              {amt.toLocaleString()} UC
                            </button>
                          );
                        })}
                      </div>
                      {form.ucAmounts.length > 0 && (
                        <p className="text-xs text-purple-400 mt-1.5">Selected: {form.ucAmounts.map(a => `${a.toLocaleString()} UC`).join(', ')}</p>
                      )}
                    </div>
                  ) : (
                    <Field label="UC Amount *">
                      <input type="text" value={form.ucAmounts[0] || ''}
                        onChange={e => setF('ucAmounts', e.target.value ? [e.target.value] : [])}
                        placeholder="e.g. 600+60 Bonus, 1800+180 Bonus"
                        className={inputCls.base} style={inputCls.style} onFocus={focusStyle} onBlur={blurStyle} />
                    </Field>
                  )}

                  {/* Price — text or number */}
                  <div>
                    <Label>Price *</Label>
                    <div className="flex gap-2 mb-2">
                      <button type="button" onClick={() => setF('price', 'Inbox')}
                        className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                        style={form.price === 'Inbox'
                          ? { background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', color: '#fff', border: '1px solid rgba(139,92,246,0.6)' }
                          : { background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }
                        }>
                        📩 Inbox
                      </button>
                      <input type="text" value={form.price === 'Inbox' ? '' : form.price}
                        onChange={e => setF('price', e.target.value)}
                        placeholder="or type price e.g. LKR 2500"
                        className={`${inputCls.base} flex-1`} style={inputCls.style} onFocus={focusStyle} onBlur={blurStyle} />
                    </div>
                    {form.price === 'Inbox' && (
                      <p className="text-xs text-purple-400">📩 Customers will see: <strong>Inbox for Price</strong></p>
                    )}
                  </div>

                  {/* Top-up Method */}
                  <div>
                    <Label>Top-up Method *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setF('topupMethod', 'login')}
                        className="p-3 rounded-xl text-left transition-all"
                        style={form.topupMethod === 'login'
                          ? { background: 'rgba(99,102,241,0.25)', border: '2px solid rgba(99,102,241,0.6)', color: '#fff' }
                          : { background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
                        <div className="text-sm font-bold">🔐 Login UC</div>
                        <div className="text-xs mt-0.5 opacity-70">Requires account login + QR</div>
                      </button>
                      <button type="button" onClick={() => { setF('topupMethod', 'tag'); setF('qrLogin', ''); }}
                        className="p-3 rounded-xl text-left transition-all"
                        style={form.topupMethod === 'tag'
                          ? { background: 'rgba(234,179,8,0.2)', border: '2px solid rgba(234,179,8,0.5)', color: '#fff' }
                          : { background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
                        <div className="text-sm font-bold">🏷 Tag UC</div>
                        <div className="text-xs mt-0.5 opacity-70">Character ID required</div>
                      </button>
                    </div>
                  </div>


                  {/* Tag UC info banner */}
                  {form.topupMethod === 'tag' && (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold"
                      style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#fbbf24' }}>
                      🏷 Customers will see: <span className="font-black">Character ID Required</span>
                    </div>
                  )}

                  {/* Bonus offer — only for Bonus UC */}
                  {form.category === 'bonus' && (
                    <Field label="Bonus Offer Description">
                      <input value={form.bonus} onChange={e => setF('bonus', e.target.value)}
                        placeholder="e.g. Extra 200 UC, Free Elite Pass"
                        className={inputCls.base} style={inputCls.style} onFocus={focusStyle} onBlur={blurStyle} />
                    </Field>
                  )}
                </div>

                <Field label="Badge">
                  <div className="flex gap-2">
                    {[{v:'none',l:'None'},{v:'popular',l:'⭐ Popular'},{v:'best-deal',l:'🏆 Best Deal'}].map(b => (
                      <button key={b.v} type="button" onClick={() => setF('badge', b.v)}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                        style={form.badge === b.v
                          ? { background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.5)', color: '#c084fc' }
                          : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
                        {b.l}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Status">
                  <div className="flex gap-2">
                    {[{v:'available',l:'Available'},{v:'unavailable',l:'Unavailable'}].map(s => (
                      <button key={s.v} type="button" onClick={() => setF('status', s.v)}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                        style={form.status === s.v
                          ? { background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.5)', color: '#c084fc' }
                          : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
                        {s.l}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-300"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
                  {saving ? <><div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> Saving...</> : (editing ? 'Update' : 'Add Package')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        message="Delete this UC package? This cannot be undone." />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
const AdminInventory = () => {
  const { api } = useAuth();
  const [activeTab, setActiveTab] = useState('accounts');

  const tabs = [
    { id: 'accounts',  label: 'Accounts',    icon: Gamepad2 },
    { id: 'uc',        label: 'UC Packages', icon: Package  },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#0a0a0a', fontFamily: 'Poppins, sans-serif' }}>
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Inventory Management</h1>
        <p className="text-gray-500 text-sm">Manage gaming accounts and UC packages from one place.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 p-1 rounded-2xl w-fit"
        style={{ background: 'rgba(25,25,35,0.8)', border: '1px solid rgba(139,92,246,0.15)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-250"
            style={activeTab === tab.id
              ? { background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', color: '#fff' }
              : { color: '#6b7280' }}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}>
          {activeTab === 'accounts' ? <AccountsTab api={api} /> : <UCTab api={api} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminInventory;
