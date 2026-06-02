import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader,
  Percent
} from 'lucide-react';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    applicableProducts: 'all',
    startDate: '',
    endDate: '',
    isActive: true
  });

  // Initialize with some example offers
  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = () => {
    // Simulate loading offers from localStorage
    const savedOffers = localStorage.getItem('pubg_offers');
    if (savedOffers) {
      setOffers(JSON.parse(savedOffers));
    } else {
      setOffers([
        {
          id: 1,
          title: '15% OFF All Accounts',
          description: 'Get 15% discount on all premium PUBG accounts',
          discountType: 'percentage',
          discountValue: 15,
          applicableProducts: 'all',
          startDate: '2024-05-30',
          endDate: '2024-06-30',
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 2,
          title: 'UC Top-up Special',
          description: 'Extra 1000 UC free with 5000 UC purchase',
          discountType: 'fixed',
          discountValue: 1000,
          applicableProducts: 'uc-packages',
          startDate: '2024-05-30',
          endDate: '2024-06-15',
          isActive: true,
          createdAt: new Date()
        }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.discountValue) {
      setError('Please fill all required fields');
      return;
    }

    if (editingId) {
      setOffers(offers.map(offer =>
        offer.id === editingId
          ? { ...offer, ...formData, updatedAt: new Date() }
          : offer
      ));
      setSuccess('Offer updated successfully!');
    } else {
      const newOffer = {
        id: Date.now(),
        ...formData,
        createdAt: new Date()
      };
      setOffers([...offers, newOffer]);
      setSuccess('Offer created successfully!');
    }

    // Save to localStorage
    localStorage.setItem('pubg_offers', JSON.stringify(offers));

    setFormData({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      applicableProducts: 'all',
      startDate: '',
      endDate: '',
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);

    setTimeout(() => setSuccess(null), 3000);
  };

  const handleEdit = (offer) => {
    setFormData(offer);
    setEditingId(offer.id);
    setShowForm(true);
  };

  const handleDelete = (offerId) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;

    const updated = offers.filter(offer => offer.id !== offerId);
    setOffers(updated);
    localStorage.setItem('pubg_offers', JSON.stringify(updated));
    setSuccess('Offer deleted successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const toggleOfferStatus = (offerId) => {
    const updated = offers.map(offer =>
      offer.id === offerId
        ? { ...offer, isActive: !offer.isActive }
        : offer
    );
    setOffers(updated);
    localStorage.setItem('pubg_offers', JSON.stringify(updated));
  };

  const isOfferExpired = (endDate) => new Date() > new Date(endDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Offers & Discounts</h1>
          <p className="text-gray-400 mt-1">Create and manage promotional offers</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              title: '',
              description: '',
              discountType: 'percentage',
              discountValue: '',
              applicableProducts: 'all',
              startDate: '',
              endDate: '',
              isActive: true
            });
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-6 py-3 rounded-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          New Offer
        </button>
      </div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </motion.div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 border border-purple-500/20 rounded-lg p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">
            {editingId ? 'Edit Offer' : 'Create New Offer'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Offer Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., 15% OFF All Accounts"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Discount Type</label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discount Value {formData.discountType === 'percentage' ? '(%)' : '($)'} *
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  placeholder={formData.discountType === 'percentage' ? '15' : '50'}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Applicable Products */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Applicable To</label>
                <select
                  name="applicableProducts"
                  value={formData.applicableProducts}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="all">All Products</option>
                  <option value="accounts">PUBG Accounts</option>
                  <option value="uc-packages">UC Packages</option>
                  <option value="boosters">Boosters</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the offer..."
                rows="3"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 accent-purple-600"
              />
              <label htmlFor="isActive" className="text-gray-300 font-medium">
                Offer is active
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-4 py-2 rounded-lg transition-all"
              >
                {editingId ? 'Update Offer' : 'Create Offer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Offers List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 border border-gray-700 rounded-lg">
          <Percent className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No offers created yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {offers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{offer.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{offer.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-4 py-2 rounded-lg font-bold text-white ${
                    offer.discountType === 'percentage'
                      ? 'bg-purple-600/50'
                      : 'bg-blue-600/50'
                  }`}>
                    {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `$${offer.discountValue}`}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-400">Applies To</p>
                  <p className="text-white font-medium capitalize">{offer.applicableProducts}</p>
                </div>
                <div>
                  <p className="text-gray-400">Start Date</p>
                  <p className="text-white font-medium">{offer.startDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">End Date</p>
                  <p className={`font-medium ${
                    isOfferExpired(offer.endDate) ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {offer.endDate || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <p className={`font-medium ${offer.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleOfferStatus(offer.id)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    offer.isActive
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-green-600/30 hover:bg-green-600/50 text-green-300'
                  }`}
                >
                  {offer.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(offer)}
                  className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="bg-red-600/30 hover:bg-red-600/50 text-red-300 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOffers;
