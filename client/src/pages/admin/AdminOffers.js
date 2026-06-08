import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  Search,
  Tag,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const formatLkr = (value) => `Rs. ${Number(value || 0).toFixed(2)} LKR`;

const AdminOffers = () => {
  const { api, getAuthHeaders } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingServiceId, setSavingServiceId] = useState('');
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState('All');
  const [sellingPriceDrafts, setSellingPriceDrafts] = useState({});
  const [error, setError] = useState('');

  const loadServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/social/admin/services', {
        headers: getAuthHeaders(),
      });
      const nextServices = Array.isArray(response.data?.data) ? response.data.data : [];
      setServices(nextServices);
      setSellingPriceDrafts(
        Object.fromEntries(
          nextServices.map((service) => [service.serviceId, String(service.sellingPriceLkr ?? '')])
        )
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load Social Booster pricing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const platforms = useMemo(() => {
    return ['All', ...Array.from(new Set(services.map((service) => service.platform).filter(Boolean)))];
  }, [services]);

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return services.filter((service) => {
      const platformMatch = platform === 'All' || service.platform === platform;
      const text = `${service.serviceId} ${service.name} ${service.category} ${service.platform}`.toLowerCase();
      return platformMatch && text.includes(normalizedQuery);
    });
  }, [platform, query, services]);

  const handleSave = async (serviceId) => {
    const sellingPriceLkr = Number(sellingPriceDrafts[serviceId] || 0);

    if (!Number.isFinite(sellingPriceLkr) || sellingPriceLkr < 0) {
      toast.error('Enter a valid selling price');
      return;
    }

    try {
      setSavingServiceId(serviceId);
      const response = await api.put(
        `/social/admin/services/${serviceId}`,
        { sellingPriceLkr },
        { headers: getAuthHeaders() }
      );
      const updatedService = response.data?.data;

      setServices((currentServices) =>
        currentServices.map((service) =>
          service.serviceId === updatedService.serviceId ? updatedService : service
        )
      );
      setSellingPriceDrafts((currentDrafts) => ({
        ...currentDrafts,
        [updatedService.serviceId]: String(updatedService.sellingPriceLkr),
      }));
      toast.success(response.data?.message || 'Selling price updated');
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Failed to update selling price');
    } finally {
      setSavingServiceId('');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-purple-200">
          <Tag className="h-4 w-4" />
          Social Booster Pricing
        </div>
        <h1 className="mt-4 text-4xl font-black text-white">Selling Price Manager</h1>
        <p className="mt-2 max-w-3xl text-gray-400">
          Keep supplier cost private, manage customer-facing selling price in LKR, and track profit per package.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-red-200">
          <div className="flex items-center gap-3 font-semibold">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        </div>
      )}

      <div className="rounded-[28px] border border-white/8 bg-[#101018] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by ID, package name, platform, or category"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-4 text-white outline-none transition focus:border-purple-400/40"
            />
          </div>

          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
          >
            {platforms.map((option) => (
              <option key={option} value={option} className="bg-[#11111a] text-white">
                {option}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-purple-300" />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredServices.map((service) => (
              <motion.div
                key={service.serviceId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/8 bg-white/[0.03] p-5"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-200">
                      <span>{service.platform}</span>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-gray-300">
                        ID {service.serviceId}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-black text-white">{service.name}</h2>
                    <p className="mt-2 text-sm text-gray-400">{service.category}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[640px] xl:grid-cols-[1fr_1fr_1fr_220px]">
                    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Cost Price</div>
                      <div className="mt-1 text-sm font-bold text-white">{formatLkr(service.supplierCostLkr)}</div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Current Selling</div>
                      <div className="mt-1 text-sm font-bold text-emerald-300">{formatLkr(service.sellingPriceLkr)}</div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Profit</div>
                      <div className="mt-1 text-sm font-bold text-cyan-300">{formatLkr(service.profitLkr)}</div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={sellingPriceDrafts[service.serviceId] || ''}
                        onChange={(event) =>
                          setSellingPriceDrafts((currentDrafts) => ({
                            ...currentDrafts,
                            [service.serviceId]: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-purple-400/40"
                      />
                      <button
                        type="button"
                        onClick={() => handleSave(service.serviceId)}
                        disabled={savingServiceId === service.serviceId}
                        className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-3 font-bold text-white transition hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-60"
                      >
                        {savingServiceId === service.serviceId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredServices.length === 0 && (
              <div className="rounded-3xl border border-white/8 bg-white/[0.03] px-6 py-12 text-center text-gray-400">
                No Social Booster services matched your filters.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOffers;
