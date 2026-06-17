import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  LogIn,
  Plus,
  Search,
  ShieldCheck,
  Ticket,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import WalletTopUpModal from '../components/WalletTopUpModal';

const SOCIAL_SERVICES_STORAGE_KEY = 'socialBoosterServicesCache';
const SELLING_PRICE_OVERRIDES = {
  '187': 250,
  '189': 350,
  '193': 2400,
  '194': 1800,
  '254': 1300,
  '291': 300,
};
let loadedServicesCache = null;
let loadedServicesPromise = null;
let fallbackToastShown = false;

const fieldStyles =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-white outline-none transition focus:border-purple-400/40';

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount.toFixed(2) : '0.00';
};

const formatLkr = (value) => `Rs. ${formatMoney(value)} LKR`;

const truncateLabel = (value, maxLength = 72) => {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3)}...`;
};

const getOverriddenSellingPrice = (service) => {
  const serviceId = String(service?.serviceId || service?.cid_service_id || '').trim();
  return Object.prototype.hasOwnProperty.call(SELLING_PRICE_OVERRIDES, serviceId)
    ? SELLING_PRICE_OVERRIDES[serviceId]
    : null;
};

const normalizeService = (service) => {
  const serviceId = String(service?.serviceId || service?.cid_service_id || service?.service || '').trim();
  const overriddenSellingPrice = getOverriddenSellingPrice(service);
  const computedSellingPrice = overriddenSellingPrice ?? Number(
        service?.sellingPrice ??
          service?.selling_price_lkr ??
          service?.price_lkr ??
          service?.rate ??
          0
      );

  const sellingPrice = Number.isFinite(computedSellingPrice)
    ? Number(computedSellingPrice.toFixed(2))
    : 0;

  return {
    ...service,
    serviceId,
    cid_service_id: serviceId,
    price_lkr: sellingPrice,
    sellingPrice,
  };
};

const parseServiceIdQuery = (value) => {
  const normalized = (value || '').trim().toLowerCase();

  if (!normalized) {
    return '';
  }

  if (/^\d+$/.test(normalized)) {
    return normalized;
  }

  const idMatch = normalized.match(/\bid\s*[:;#-]?\s*(\d+)\b/);
  return idMatch ? idMatch[1] : '';
};

const readCachedServices = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SOCIAL_SERVICES_STORAGE_KEY);
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed.map(normalizeService) : [];
  } catch (error) {
    return [];
  }
};

const loadBundledFallbackServices = async () => {
  if (loadedServicesCache) {
    return loadedServicesCache;
  }

  try {
    if (!loadedServicesPromise) {
      loadedServicesPromise = fetch(`/reseller-services-fallback.json?ts=${Date.now()}`)
        .then(async (response) => {
          if (!response.ok) {
            return [];
          }

          const payload = await response.json();
          const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
          return items.map(normalizeService);
        })
        .catch(() => [])
        .finally(() => {
          loadedServicesPromise = null;
        });
    }

    loadedServicesCache = await loadedServicesPromise;
    return loadedServicesCache;
  } catch (error) {
    return [];
  }
};

const writeCachedServices = (items) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(SOCIAL_SERVICES_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    // Ignore storage write failures so service browsing still works.
  }
};

const SocialBooster = () => {
  const { api, customer, loadCustomer, isUserAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isWalletTopUpOpen, setIsWalletTopUpOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDepositHovered, setIsDepositHovered] = useState(false);

  const [activeTab, setActiveTab] = useState('order'); // 'order', 'my-orders', 'refills'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersFilter, setOrdersFilter] = useState('all');
  const [ordersPage, setOrdersPage] = useState(1);
  const [refillSubmittingId, setRefillSubmittingId] = useState(null);

  const [refills, setRefills] = useState([]);
  const [refillsLoading, setRefillsLoading] = useState(false);
  const [refillsError, setRefillsError] = useState('');
  const [refillsSearch, setRefillsSearch] = useState('');
  const [refillsPage, setRefillsPage] = useState(1);

  const fetchMyOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError('');
      const res = await api.get('/social/my-orders');
      if (res.data?.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      setOrdersError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchRefillHistory = async () => {
    try {
      setRefillsLoading(true);
      setRefillsError('');
      const res = await api.get('/social/refill-history');
      if (res.data?.success) {
        setRefills(res.data.refills || []);
      }
    } catch (err) {
      setRefillsError(err.response?.data?.message || 'Failed to load refill history');
    } finally {
      setRefillsLoading(false);
    }
  };

  const handleRequestRefill = async (orderId) => {
    try {
      setRefillSubmittingId(orderId);
      const res = await api.post(`/social/order/${orderId}/refill`);
      if (res.data?.success) {
        toast.success(res.data.message || 'Refill requested successfully!');
        fetchMyOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit refill request');
    } finally {
      setRefillSubmittingId(null);
    }
  };

  const isRefillable = (order) => {
    if (order.orderStatus?.toLowerCase() !== 'completed') return false;
    
    const serviceNameLower = (order.serviceName || order.productName || '').toLowerCase();
    if (serviceNameLower.includes('no refill') || serviceNameLower.includes('no-refill') || serviceNameLower.includes('no_refill')) {
      return false;
    }

    const serviceDef = services.find(s => String(s.serviceId) === String(order.cidServiceId));
    if (serviceDef && serviceDef.refill === false) {
      return false;
    }

    return true;
  };

  const renderActionColumn = (order) => {
    if (!isRefillable(order)) {
      return <span className="text-gray-500">-</span>;
    }

    const avail = String(order.refillAvailability || '').trim().toLowerCase();

    if (avail === 'false' || avail === '0') {
      return <span className="text-gray-500">-</span>;
    }

    if (avail && avail !== 'true' && avail !== '1') {
      return (
        <span className="inline-block rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-1.5 text-xs text-purple-300 max-w-[200px] break-words">
          {order.refillAvailability}
        </span>
      );
    }

    const isSubmitting = refillSubmittingId === order.id;
    return (
      <button
        onClick={() => handleRequestRefill(order.id)}
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:from-purple-800 disabled:to-fuchsia-800 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            Processing...
          </>
        ) : (
          'Refill'
        )}
      </button>
    );
  };

  useEffect(() => {
    if (activeTab === 'my-orders' && isUserAuthenticated) {
      fetchMyOrders();
    }
  }, [activeTab, isUserAuthenticated]);

  useEffect(() => {
    if (activeTab === 'refills' && isUserAuthenticated) {
      fetchRefillHistory();
    }
  }, [activeTab, isUserAuthenticated]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError('');
        if (loadedServicesCache?.length) {
          setServices(loadedServicesCache);
          return;
        }

        const response = await api.get(`/social/services?ts=${Date.now()}`);
        const data = Array.isArray(response.data?.data)
          ? response.data.data.map(normalizeService)
          : [];
        setServices(data);
        loadedServicesCache = data;
        writeCachedServices(data);
      } catch (requestError) {
        const cachedServices = readCachedServices();

        if (cachedServices.length) {
          setServices(cachedServices);
          loadedServicesCache = cachedServices;
          setError('');
          if (!fallbackToastShown) {
            fallbackToastShown = true;
            toast.warn('Showing the last synced social booster services because the live CID sync is unavailable right now.');
          }
          return;
        }

        const bundledFallbackServices = await loadBundledFallbackServices();
        if (bundledFallbackServices.length) {
          setServices(bundledFallbackServices);
          loadedServicesCache = bundledFallbackServices;
          setError('');
          writeCachedServices(bundledFallbackServices);
          if (!fallbackToastShown) {
            fallbackToastShown = true;
            toast.warn('Showing the bundled social booster services because the live CID sync is unavailable right now.');
          }
          return;
        }

        setError(requestError.response?.data?.message || 'Failed to load premium social media services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [api]);

  const searchedServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return services.filter((service) => {
      if (!normalizedQuery) {
        return true;
      }

      const serviceId = String(service.cid_service_id || service.serviceId || '').toLowerCase();
      const searchableText = `${serviceId} ${service.name} ${service.platform} ${service.category} ${service.description}`.toLowerCase();
      
      // Split query into individual words/tokens for flexible word-order matching
      const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
      
      // All search terms must be matched anywhere within the service's searchable details
      return queryWords.every((word) => searchableText.includes(word));
    });
  }, [services, query]);

  const categories = useMemo(() => {
    return Array.from(new Set(searchedServices.map((service) => service.category).filter(Boolean)));
  }, [searchedServices]);

  useEffect(() => {
    if (!categories.length) {
      setCategory('');
      return;
    }

    if (!categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  const packageOptions = useMemo(() => {
    return searchedServices.filter((service) => !category || service.category === category);
  }, [searchedServices, category]);

  const searchSuggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return searchedServices.slice(0, 8);
  }, [query, searchedServices]);

  useEffect(() => {
    if (!packageOptions.length) {
      setServiceId('');
      return;
    }

    const exists = packageOptions.some((service) => service.serviceId === serviceId);
    if (!exists) {
      setServiceId(packageOptions[0].serviceId);
    }
  }, [packageOptions, serviceId]);

  const selectedService = useMemo(() => {
    return packageOptions.find((service) => service.serviceId === serviceId) || null;
  }, [packageOptions, serviceId]);

  const handleSuggestionSelect = (service) => {
    setQuery(service.cid_service_id ? `${service.cid_service_id} ${service.name}` : service.name);
    setCategory(service.category || '');
    setServiceId(service.serviceId || service.cid_service_id || '');
    setIsSearchFocused(false);
  };

  const handleQuantityChange = (event) => {
    const nextValue = event.target.value.replace(/[^\d]/g, '');
    setQuantity(nextValue);
  };

  const handleQuantityBlur = () => {
    if (!selectedService || !quantity) {
      return;
    }

    const numericQuantity = Number(quantity);
    if (!Number.isFinite(numericQuantity)) {
      setQuantity('');
      return;
    }

    if (numericQuantity < selectedService.min) {
      setQuantity(String(selectedService.min));
      return;
    }

    if (numericQuantity > selectedService.max) {
      setQuantity(String(selectedService.max));
    }
  };

  const totalCharge = useMemo(() => {
    if (!selectedService) {
      return 0;
    }

    const numericQuantity = Number(quantity);
    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      return 0;
    }

    return Number(((numericQuantity * Number(selectedService.sellingPrice || selectedService.price_lkr || 0)) / 1000).toFixed(2));
  }, [selectedService, quantity]);

  const packageLabel = (service, includePrice = true) => {
    const baseLabel = `ID:${service.cid_service_id} ${service.name}`;
    const fullLabel = includePrice
      ? `${baseLabel} -- ${formatLkr(service.sellingPrice || service.price_lkr)} per 1000`
      : baseLabel;
    return truncateLabel(fullLabel);
  };

  const walletBalance = Number(customer?.walletBalance || 0);

  const resetForm = () => {
    setLink('');
    setQuantity('');
    setCouponCode('');
    setTermsAccepted(false);
  };

  const validateForm = () => {
    if (!selectedService) {
      toast.error('Please choose a package first');
      return false;
    }

    if (!link.trim()) {
      toast.error('Please enter your social media link');
      return false;
    }

    const numericQuantity = Number(quantity);
    if (!Number.isFinite(numericQuantity)) {
      toast.error('Please enter a valid quantity');
      return false;
    }

    if (numericQuantity < selectedService.min || numericQuantity > selectedService.max) {
      toast.error(`Quantity must be between ${selectedService.min} and ${selectedService.max}`);
      return false;
    }

    if (!termsAccepted) {
      toast.error('Please accept the terms before creating your order');
      return false;
    }

    if (walletBalance < totalCharge) {
      toast.error(`Not enough amount in wallet. Available: ${formatLkr(walletBalance)}`);
      return false;
    }

    return true;
  };

  const handleCreateOrder = async (event) => {
    event.preventDefault();

    if (!isUserAuthenticated) {
      toast.info('Please log in to place a social booster order');
      navigate('/user/login', { state: { from: location } });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/social/order', {
        serviceId: selectedService.serviceId,
        link: link.trim(),
        quantity: Number(quantity),
        couponCode: couponCode.trim(),
        termsAccepted: true,
      });

      toast.success(response.data?.message || 'Booster order created successfully');
      loadCustomer();
      resetForm();
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Failed to create social booster order');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAndSearchedOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        String(order.cidOrderId || order.id || '').toLowerCase().includes(ordersSearch.toLowerCase()) ||
        String(order.serviceName || order.productName || '').toLowerCase().includes(ordersSearch.toLowerCase()) ||
        String(order.link || '').toLowerCase().includes(ordersSearch.toLowerCase());

      const matchesFilter =
        ordersFilter === 'all' ||
        String(order.orderStatus || '').toLowerCase() === ordersFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [orders, ordersSearch, ordersFilter]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (ordersPage - 1) * 10;
    return filteredAndSearchedOrders.slice(startIndex, startIndex + 10);
  }, [filteredAndSearchedOrders, ordersPage]);

  const totalOrderPages = Math.ceil(filteredAndSearchedOrders.length / 10);

  const filteredAndSearchedRefills = useMemo(() => {
    return refills.filter((refill) => {
      return (
        String(refill.refillId || '').toLowerCase().includes(refillsSearch.toLowerCase()) ||
        String(refill.cidOrderId || '').toLowerCase().includes(refillsSearch.toLowerCase()) ||
        String(refill.serviceName || '').toLowerCase().includes(refillsSearch.toLowerCase()) ||
        String(refill.link || '').toLowerCase().includes(refillsSearch.toLowerCase())
      );
    });
  }, [refills, refillsSearch]);

  const paginatedRefills = useMemo(() => {
    const startIndex = (refillsPage - 1) * 10;
    return filteredAndSearchedRefills.slice(startIndex, startIndex + 10);
  }, [filteredAndSearchedRefills, refillsPage]);

  const totalRefillPages = Math.ceil(filteredAndSearchedRefills.length / 10);

  const getStatusStyle = (status = '') => {
    const s = String(status).toLowerCase();
    if (s.includes('completed') || s.includes('success')) {
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    }
    if (s.includes('pending') || s.includes('awaiting')) {
      return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20';
    }
    if (s.includes('processing') || s.includes('progress') || s.includes('active')) {
      return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
    }
    if (s.includes('partial')) {
      return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
    }
    return 'bg-red-500/10 text-red-300 border-red-500/20';
  };

  return (
    <div className="min-h-screen bg-black">
      <section className="relative overflow-hidden pt-32 pb-24">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #09070e 0%, #140d28 50%, #09070e 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center"
          >
            <h1
              className="text-5xl font-black md:text-7xl"
              style={{
                fontFamily: 'Poppins, sans-serif',
                background: 'linear-gradient(135deg,#ffffff,#d8b4fe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Social Media
              <br />
              Growth Services
            </h1>
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-gray-300 md:text-2xl">
              Boost your social media presence with premium engagement services.
            </p>
            {isUserAuthenticated ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
                <ShieldCheck className="h-4 w-4" />
                Logged in as {customer?.fullName || 'Customer'}
              </div>
            ) : (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-100">
                <Lock className="h-4 w-4" />
                Browse services freely. Login is required only when placing an order.
              </div>
            )}
          </motion.div>

          {/* Tab Navigation */}
          <div className="mt-10 flex border-b border-white/10 gap-6 items-center">
            <button
              onClick={() => setActiveTab('order')}
              className={`pb-4 text-base md:text-lg font-bold transition-all relative border-b-2 ${
                activeTab === 'order' ? 'text-white border-purple-500' : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              New Order
            </button>
            <button
              onClick={() => setActiveTab('my-orders')}
              className={`pb-4 text-base md:text-lg font-bold transition-all relative border-b-2 ${
                activeTab === 'my-orders' ? 'text-white border-purple-500' : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab('refills')}
              className={`pb-4 text-base md:text-lg font-bold transition-all relative border-b-2 ${
                activeTab === 'refills' ? 'text-white border-purple-500' : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Refill History
            </button>
          </div>

          {activeTab === 'order' && (
            <div className="mt-14 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[32px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.38)] sm:p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-black text-white">Premium Social Media Services</h2>
                    <p className="mt-2 text-sm text-gray-400">
                      Search for specific packages or filter by category below.
                    </p>
                  </div>
                  <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => {
                        window.setTimeout(() => setIsSearchFocused(false), 150);
                      }}
                      placeholder="Search TikTok, Instagram, Facebook, YouTube..."
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-4 text-white outline-none transition focus:border-purple-400/40"
                    />
                    {isSearchFocused && searchSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                        <div className="max-h-[320px] overflow-y-auto">
                          {searchSuggestions.map((service) => (
                            <button
                              key={`${service.serviceId}-${service.cid_service_id}`}
                              type="button"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => handleSuggestionSelect(service)}
                              className="flex w-full items-start gap-4 border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/[0.04]"
                            >
                              <div className="mt-0.5 rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-purple-200 flex-shrink-0">
                                ID:{service.cid_service_id || service.serviceId}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="line-clamp-2 break-words text-sm font-semibold text-white">
                                  {service.name}
                                </div>
                                <div className="mt-1 text-xs text-gray-400">
                                  {service.category} {service.platform ? `• ${service.platform}` : ''}
                                </div>
                                <div className="mt-2 text-sm font-bold text-emerald-300">
                                  {formatLkr(service.sellingPrice || service.price_lkr)} per 1000
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {loading ? (
                  <div className="mt-12 flex min-h-[320px] items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.03]">
                    <div className="flex items-center gap-3 text-lg font-semibold text-purple-200">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Loading premium social media services...
                    </div>
                  </div>
                ) : error ? (
                  <div className="mt-12 rounded-[28px] border border-red-500/20 bg-red-500/10 px-6 py-10 text-center text-red-200">
                    <AlertCircle className="mx-auto h-10 w-10" />
                    <p className="mt-4 text-xl font-semibold">{error}</p>
                    <p className="mt-2 text-sm text-red-100/80">Please try again in a moment. If this keeps happening, restart the `server/` app so the latest service sync settings load.</p>
                  </div>
                ) : searchedServices.length === 0 ? (
                  <div className="mt-12 rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                    <p className="text-xl font-semibold text-white">No service packages found</p>
                    <p className="mt-2 text-gray-400">Try a different platform filter or search term.</p>
                  </div>
                ) : (
                  <>
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                      <div className="min-w-0">
                        <label className="mb-2 block text-sm font-semibold text-gray-300">Category</label>
                        <select
                          value={category}
                          onChange={(event) => setCategory(event.target.value)}
                          className={`${fieldStyles} min-w-0 overflow-hidden text-ellipsis whitespace-nowrap pr-12`}
                        >
                          {categories.map((item) => (
                            <option key={item} value={item} className="bg-[#11111a] text-white">
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="min-w-0">
                        <label className="mb-2 block text-sm font-semibold text-gray-300">Package</label>
                        <select
                          value={serviceId}
                          onChange={(event) => setServiceId(event.target.value)}
                          className={`${fieldStyles} min-w-0 overflow-hidden text-ellipsis whitespace-nowrap pr-12`}
                          title={selectedService ? packageLabel(selectedService) : 'Select a package'}
                        >
                          {packageOptions.map((item) => (
                            <option key={item.serviceId} value={item.serviceId} className="bg-[#11111a] text-white">
                              {packageLabel(item)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {selectedService && (
                      <div className="mt-8 rounded-[18px] border border-purple-500/20 bg-purple-500/8 p-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold uppercase tracking-[0.28em] text-purple-300">{selectedService.platform}</div>
                            <h3 className="mt-2 break-words text-2xl font-black leading-tight text-white [overflow-wrap:anywhere]">
                              {selectedService.name}
                            </h3>
                            <p className="mt-3 max-w-2xl break-words leading-6 text-gray-300 [overflow-wrap:anywhere]">
                              {selectedService.description || 'Premium YathuOfficial service package with secure order processing.'}
                            </p>
                          </div>
                          <div className="w-full min-w-[170px] rounded-[18px] border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-left lg:w-auto lg:max-w-[220px] lg:text-right">
                            <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Price per 1000</div>
                            <div
                              className="mt-2 break-words font-black leading-tight text-white [overflow-wrap:anywhere]"
                              style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
                            >
                              {formatLkr(selectedService.sellingPrice || selectedService.price_lkr)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="rounded-[32px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.38)] sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-purple-200">
                  <Ticket className="h-4 w-4" />
                  Create Order
                </div>
                <h2 className="mt-5 text-3xl font-black text-white">Customer Order Form</h2>
                <p className="mt-3 leading-7 text-gray-400">
                  Choose a category, select a package, review pricing details, and create your order instantly.
                </p>
                {isUserAuthenticated ? (
                  <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(320px,1fr)_320px] lg:items-end">
                    <div className="flex h-[74px] items-center gap-3 rounded-[26px] border border-emerald-500/20 bg-emerald-500/10 px-5 text-sm font-semibold text-emerald-100 shadow-[0_12px_30px_rgba(16,185,129,0.08)]">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="whitespace-nowrap">Wallet Balance: {formatLkr(walletBalance)}</span>
                      <button
                        type="button"
                        onClick={() => setIsWalletTopUpOpen(true)}
                        className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10 text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-400/20"
                        aria-label="Add funds to wallet"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="w-full lg:w-[300px]">
                      <p className="mb-4 text-center text-sm font-semibold text-gray-300">
                        Looking to Deposit?
                      </p>
                      <div
                        className={`deposit-button-shell ${isDepositHovered ? 'active' : ''}`}
                        onMouseEnter={() => setIsDepositHovered(true)}
                        onMouseLeave={() => setIsDepositHovered(false)}
                        onFocusCapture={() => setIsDepositHovered(true)}
                        onBlurCapture={() => setIsDepositHovered(false)}
                      >
                        <button
                          type="button"
                          onClick={() => setIsWalletTopUpOpen(true)}
                          className="deposit-button flex h-[78px] w-full items-center justify-center rounded-[28px] border border-fuchsia-400/25 bg-gradient-to-r from-[#6d28d9] via-[#8b5cf6] to-[#d946ef] px-8 text-[1.15rem] font-black uppercase tracking-[0.18em] text-white shadow-[0_20px_44px_rgba(124,58,237,0.34)] transition hover:from-[#7c3aed] hover:via-[#a855f7] hover:to-[#f472b6]"
                        >
                          <span className="deposit-wave" aria-hidden="true" />
                          <span className="relative z-10">Deposit Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-[18px] border border-amber-500/20 bg-amber-500/10 px-4 py-4 text-sm font-semibold text-amber-100">
                    <div className="flex items-start gap-3">
                      <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <div>
                        Login is required only when you are ready to buy a service.
                        <button
                          type="button"
                          onClick={() => navigate('/user/login', { state: { from: location } })}
                          className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:border-amber-300/40"
                        >
                          <LogIn className="h-3.5 w-3.5" />
                          Login To Order
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleCreateOrder} className="mt-8 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-300">Price per 1000</label>
                      <input
                        value={selectedService ? formatLkr(selectedService.sellingPrice || selectedService.price_lkr) : ''}
                        readOnly
                        className={`${fieldStyles} cursor-not-allowed opacity-90`}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-300">Average Time</label>
                      <input
                        value={selectedService?.averageTime || 'Estimated delivery time not available'}
                        readOnly
                        className={`${fieldStyles} cursor-not-allowed opacity-90`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Description</label>
                    <textarea
                      value={selectedService?.description || ''}
                      readOnly
                      rows={4}
                      className={`${fieldStyles} min-h-[120px] resize-none cursor-not-allowed break-words opacity-90 [overflow-wrap:anywhere] leading-6`}
                      placeholder="Service description will appear here"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Link</label>
                    <input
                      value={link}
                      onChange={(event) => setLink(event.target.value)}
                      className={fieldStyles}
                      placeholder="https://instagram.com/yourpage or post URL"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-300">Quantity</label>
                      <input
                        type="number"
                        min={selectedService?.min || 1}
                        max={selectedService?.max || undefined}
                        value={quantity}
                        onChange={handleQuantityChange}
                        onBlur={handleQuantityBlur}
                        inputMode="numeric"
                        className={fieldStyles}
                        placeholder={selectedService ? `${selectedService.min} - ${selectedService.max}` : 'Enter quantity'}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-300">Coupon Code</label>
                      <input
                        value={couponCode}
                        onChange={(event) => setCouponCode(event.target.value)}
                        className={fieldStyles}
                        placeholder="Optional coupon"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 min-h-[120px] flex flex-col justify-center">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Min / Max</div>
                      <div className="mt-2 text-lg font-bold text-white">
                        {selectedService ? `${selectedService.min} / ${selectedService.max}` : '-'}
                      </div>
                    </div>
                    <div className="rounded-[18px] border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 min-h-[120px] flex flex-col justify-center">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Total Charge</div>
                      <div className="mt-2 text-lg font-bold text-white">{formatLkr(totalCharge)}</div>
                    </div>
                  </div>

                  <label className="flex min-h-[120px] items-start gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-gray-300">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(event) => setTermsAccepted(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-purple-500 focus:ring-purple-500"
                    />
                    <span>
                      I agree to the service delivery terms, platform rules, and store processing policy. Orders remain pending until payment verification is completed.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading || !selectedService || submitting}
                    className="inline-flex w-full items-center justify-center rounded-[18px] bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-6 py-4 font-bold text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition hover:from-purple-500 hover:via-violet-500 hover:to-fuchsia-500 disabled:opacity-60"
                  >
                    {submitting ? 'Creating Order...' : isUserAuthenticated ? 'Create Order' : 'Login To Create Order'}
                  </button>

                  {selectedService && walletBalance < totalCharge && totalCharge > 0 && (
                    <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm font-semibold text-red-200">
                      Not enough amount in wallet for this service. You need {formatLkr(totalCharge)} but only have {formatLkr(walletBalance)}.
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {activeTab === 'my-orders' && (
            <div className="mt-14 rounded-[32px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.38)] sm:p-8">
              {!isUserAuthenticated ? (
                <div className="max-w-md mx-auto text-center py-12">
                  <Lock className="mx-auto h-12 w-12 text-purple-400" />
                  <h3 className="mt-4 text-2xl font-black text-white">Login Required</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Please login to view your orders and track refills.
                  </p>
                  <button
                    onClick={() => navigate('/user/login', { state: { from: location } })}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-6 py-3 font-bold text-white transition hover:bg-purple-500/20"
                  >
                    <LogIn className="h-4 w-4" />
                    Login to your account
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-white">My Booster Orders</h2>
                      <p className="mt-1 text-sm text-gray-400">
                        View real-time status and request refills for your social media booster orders.
                      </p>
                    </div>
                    <button
                      onClick={fetchMyOrders}
                      disabled={ordersLoading}
                      className="inline-flex items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 px-4 py-2 text-sm font-bold text-purple-300 transition hover:bg-purple-500/20 disabled:opacity-60"
                    >
                      {ordersLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        'Sync Now'
                      )}
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <input
                        value={ordersSearch}
                        onChange={(e) => {
                          setOrdersSearch(e.target.value);
                          setOrdersPage(1);
                        }}
                        placeholder="Search by Order ID, Link, or Service..."
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-400/40"
                      />
                    </div>
                    <div>
                      <select
                        value={ordersFilter}
                        onChange={(e) => {
                          setOrdersFilter(e.target.value);
                          setOrdersPage(1);
                        }}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 px-4 text-sm text-white outline-none focus:border-purple-400/40"
                      >
                        <option value="all" className="bg-[#11111a]">All Statuses</option>
                        <option value="pending" className="bg-[#11111a]">Pending</option>
                        <option value="processing" className="bg-[#11111a]">Processing</option>
                        <option value="inprogress" className="bg-[#11111a]">In Progress</option>
                        <option value="completed" className="bg-[#11111a]">Completed</option>
                        <option value="partial" className="bg-[#11111a]">Partial</option>
                        <option value="cancelled" className="bg-[#11111a]">Cancelled</option>
                        <option value="failed" className="bg-[#11111a]">Failed</option>
                      </select>
                    </div>
                  </div>

                  {ordersLoading && orders.length === 0 ? (
                    <div className="flex min-h-[200px] items-center justify-center">
                      <div className="flex items-center gap-2 text-purple-300 font-semibold">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Syncing your orders with CID store...
                      </div>
                    </div>
                  ) : ordersError ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-200">
                      <AlertCircle className="mx-auto h-8 w-8" />
                      <p className="mt-2 text-md font-semibold">{ordersError}</p>
                    </div>
                  ) : filteredAndSearchedOrders.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-gray-400">
                      No matching orders found.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
                        <table className="w-full min-w-[900px] border-collapse text-left text-sm text-gray-300">
                          <thead>
                            <tr className="border-b border-white/10 bg-white/[0.04] text-xs font-bold uppercase tracking-wider text-gray-400">
                              <th className="px-5 py-4">ID</th>
                              <th className="px-5 py-4">Service</th>
                              <th className="px-5 py-4">Link</th>
                              <th className="px-5 py-4">Quantity</th>
                              <th className="px-5 py-4">Remains</th>
                              <th className="px-5 py-4">Date</th>
                              <th className="px-5 py-4">Charge</th>
                              <th className="px-5 py-4">Status</th>
                              <th className="px-5 py-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {paginatedOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-5 py-4 font-mono text-xs text-purple-300 font-semibold">
                                  {order.cidOrderId || order.id}
                                </td>
                                <td className="px-5 py-4 font-semibold text-white max-w-[200px] truncate" title={order.serviceName || order.productName}>
                                  {order.serviceName || order.productName}
                                </td>
                                <td className="px-5 py-4 text-xs font-mono max-w-[200px] truncate">
                                  <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                                    {order.link}
                                  </a>
                                </td>
                                <td className="px-5 py-4 font-semibold">{order.quantity}</td>
                                <td className="px-5 py-4 font-mono">{order.remains !== undefined && order.remains !== null ? order.remains : '-'}</td>
                                <td className="px-5 py-4 text-xs text-gray-400">
                                  {new Date(order.createdAt).toLocaleString()}
                                </td>
                                <td className="px-5 py-4 font-semibold text-emerald-300">
                                  {formatLkr(order.totalLkr || order.price)}
                                </td>
                                <td className="px-5 py-4">
                                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${getStatusStyle(order.orderStatus)}`}>
                                    {order.orderStatus || 'Pending'}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                  {renderActionColumn(order)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {totalOrderPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                          <button
                            onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                            disabled={ordersPage === 1}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-50"
                          >
                            <ChevronLeft className="h-4 w-4" /> Previous
                          </button>
                          <span className="text-xs text-gray-400">
                            Page {ordersPage} of {totalOrderPages}
                          </span>
                          <button
                            onClick={() => setOrdersPage(p => Math.min(totalOrderPages, p + 1))}
                            disabled={ordersPage === totalOrderPages}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-50"
                          >
                            Next <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'refills' && (
            <div className="mt-14 rounded-[32px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.38)] sm:p-8">
              {!isUserAuthenticated ? (
                <div className="max-w-md mx-auto text-center py-12">
                  <Lock className="mx-auto h-12 w-12 text-purple-400" />
                  <h3 className="mt-4 text-2xl font-black text-white">Login Required</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Please login to view your refill history.
                  </p>
                  <button
                    onClick={() => navigate('/user/login', { state: { from: location } })}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-6 py-3 font-bold text-white transition hover:bg-purple-500/20"
                  >
                    <LogIn className="h-4 w-4" />
                    Login to your account
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-white">Refill History</h2>
                      <p className="mt-1 text-sm text-gray-400">
                        Track the progress and status of your social booster refill requests.
                      </p>
                    </div>
                    <button
                      onClick={fetchRefillHistory}
                      disabled={refillsLoading}
                      className="inline-flex items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 px-4 py-2 text-sm font-bold text-purple-300 transition hover:bg-purple-500/20 disabled:opacity-60"
                    >
                      {refillsLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        'Sync Now'
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                      value={refillsSearch}
                      onChange={(e) => {
                        setRefillsSearch(e.target.value);
                        setRefillsPage(1);
                      }}
                      placeholder="Search by Refill ID, Order ID, Link, or Package..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-400/40"
                    />
                  </div>

                  {refillsLoading && refills.length === 0 ? (
                    <div className="flex min-h-[200px] items-center justify-center">
                      <div className="flex items-center gap-2 text-purple-300 font-semibold">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Syncing refills with CID store...
                      </div>
                    </div>
                  ) : refillsError ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-200">
                      <AlertCircle className="mx-auto h-8 w-8" />
                      <p className="mt-2 text-md font-semibold">{refillsError}</p>
                    </div>
                  ) : filteredAndSearchedRefills.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-gray-400">
                      No matching refill requests found.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
                        <table className="w-full min-w-[900px] border-collapse text-left text-sm text-gray-300">
                          <thead>
                            <tr className="border-b border-white/10 bg-white/[0.04] text-xs font-bold uppercase tracking-wider text-gray-400">
                              <th className="px-5 py-4">Refill ID</th>
                              <th className="px-5 py-4">Order ID</th>
                              <th className="px-5 py-4">Link</th>
                              <th className="px-5 py-4">Package</th>
                              <th className="px-5 py-4">Created At</th>
                              <th className="px-5 py-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {paginatedRefills.map((refill) => (
                              <tr key={refill._id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-5 py-4 font-mono text-xs text-purple-300 font-semibold">
                                  {refill.refillId}
                                </td>
                                <td className="px-5 py-4 font-mono text-xs text-purple-400">
                                  {refill.cidOrderId}
                                </td>
                                <td className="px-5 py-4 text-xs font-mono max-w-[200px] truncate">
                                  <a href={refill.link} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                                    {refill.link}
                                  </a>
                                </td>
                                <td className="px-5 py-4 font-semibold text-white max-w-[200px] truncate" title={refill.serviceName}>
                                  {refill.serviceName}
                                </td>
                                <td className="px-5 py-4 text-xs text-gray-400">
                                  {new Date(refill.createdAt).toLocaleString()}
                                </td>
                                <td className="px-5 py-4">
                                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${getStatusStyle(refill.status)}`}>
                                    {refill.status || 'Pending'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {totalRefillPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                          <button
                            onClick={() => setRefillsPage(p => Math.max(1, p - 1))}
                            disabled={refillsPage === 1}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-50"
                          >
                            <ChevronLeft className="h-4 w-4" /> Previous
                          </button>
                          <span className="text-xs text-gray-400">
                            Page {refillsPage} of {totalRefillPages}
                          </span>
                          <button
                            onClick={() => setRefillsPage(p => Math.min(totalRefillPages, p + 1))}
                            disabled={refillsPage === totalRefillPages}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-50"
                          >
                            Next <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <WalletTopUpModal
        isOpen={isWalletTopUpOpen}
        onClose={() => setIsWalletTopUpOpen(false)}
        customerName={customer?.fullName || 'Customer'}
        currentBalance={walletBalance}
      />
    </div>
  );
};

export default SocialBooster;
