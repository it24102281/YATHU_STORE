const fs = require('fs');
const path = require('path');

const buildConfig = () => ({
  baseUrl: (process.env.CID_API_URL || process.env.SMM_API_URL || process.env.RESELLER_API_BASE_URL || '').trim(),
  apiKey: (process.env.CID_API_KEY || process.env.SMM_API_KEY || process.env.RESELLER_API_KEY || '').trim(),
  mode: (process.env.RESELLER_API_MODE || 'smm_panel').trim(),
});

const servicesCacheTtlMs = Number(process.env.RESELLER_SERVICES_CACHE_TTL_MS || 10 * 60 * 1000);
const servicesCacheFile = path.join(__dirname, '..', '.cache', 'reseller-services.json');
let servicesCache = {
  data: null,
  expiresAt: 0,
  fetchedAt: 0,
};

const loadServicesCacheFromDisk = () => {
  try {
    if (!fs.existsSync(servicesCacheFile)) {
      return;
    }

    const raw = fs.readFileSync(servicesCacheFile, 'utf8');
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed?.data) || !parsed.data.length) {
      return;
    }

    const fetchedAt = Number(parsed.fetchedAt || Date.now());
    servicesCache = {
      data: parsed.data,
      fetchedAt,
      expiresAt: fetchedAt + servicesCacheTtlMs,
    };
  } catch (error) {
    // Ignore broken cache files and fall back to a live reseller request.
  }
};

const writeServicesCacheToDisk = (data, fetchedAt) => {
  try {
    fs.mkdirSync(path.dirname(servicesCacheFile), { recursive: true });
    fs.writeFileSync(
      servicesCacheFile,
      JSON.stringify({ fetchedAt, data }, null, 2),
      'utf8'
    );
  } catch (error) {
    // Keep the in-memory cache even if disk cache write fails.
  }
};

loadServicesCacheFromDisk();

const isResellerConfigured = () => {
  const config = buildConfig();
  return Boolean(config.baseUrl && config.apiKey);
};

const ensureResellerConfigured = () => {
  if (!isResellerConfigured()) {
    const error = new Error('Reseller API is not configured');
    error.statusCode = 503;
    throw error;
  }
};

const callSmmPanel = async (action, params = {}) => {
  const config = buildConfig();
  const payload = new URLSearchParams({
    key: config.apiKey,
    api_token: config.apiKey,
    action,
  });

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      payload.append(key, String(value));
    }
  });

  const response = await fetch(config.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload.toString(),
  });

  const raw = await response.text();
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    parsed = null;
  }

  if (!response.ok) {
    const error = new Error(
      parsed?.error ||
        parsed?.message ||
        `Reseller API request failed with status ${response.status}`
    );
    error.statusCode = response.status;
    error.raw = parsed || raw;
    throw error;
  }

  if (parsed?.error) {
    const error = new Error(parsed.error);
    error.statusCode = 400;
    error.raw = parsed;
    throw error;
  }

  if (parsed) {
    return parsed;
  }

  return {
    success: true,
    raw,
  };
};

const callReseller = async (action, params = {}) => {
  ensureResellerConfigured();
  const config = buildConfig();

  if (config.mode !== 'smm_panel') {
    const error = new Error(`Unsupported reseller API mode: ${config.mode}`);
    error.statusCode = 400;
    throw error;
  }

  return callSmmPanel(action, params);
};

const getResellerStatus = () => {
  const config = buildConfig();
  const maskedBaseUrl = config.baseUrl
    ? config.baseUrl.replace(/\/\/([^/]+)\//, '//***\/')
    : '';

  return {
    configured: isResellerConfigured(),
    mode: config.mode,
    baseUrl: maskedBaseUrl,
  };
};

const getResellerServices = async ({ forceRefresh = false } = {}) => {
  const now = Date.now();

  if (!forceRefresh && servicesCache.data && servicesCache.expiresAt > now) {
    return servicesCache.data;
  }

  try {
    const services = await callReseller('services');
    servicesCache = {
      data: services,
      expiresAt: now + servicesCacheTtlMs,
      fetchedAt: now,
    };
    writeServicesCacheToDisk(services, now);

    return services;
  } catch (error) {
    if (servicesCache.data) {
      return servicesCache.data;
    }

    if (error.statusCode === 429) {
      error.message = 'CID service list is temporarily rate limited. Please wait a moment and try again.';
    }

    throw error;
  }
};
const getResellerBalance = () => callReseller('balance');
const getResellerOrderStatus = (orderId) => callReseller('status', { order: orderId });
const placeResellerOrder = (params) => callReseller('add', params);

module.exports = {
  isResellerConfigured,
  getResellerStatus,
  getResellerServices,
  getResellerBalance,
  getResellerOrderStatus,
  placeResellerOrder,
};
