const fs = require('fs');
const path = require('path');

const buildConfig = () => ({
  baseUrl: (process.env.CID_API_URL || process.env.SMM_API_URL || process.env.RESELLER_API_BASE_URL || '').trim(),
  apiKey: (process.env.CID_API_KEY || process.env.SMM_API_KEY || process.env.RESELLER_API_KEY || '').trim(),
  apiKeyField: (process.env.CID_API_KEY_FIELD || process.env.RESELLER_API_KEY_FIELD || 'key').trim(),
  mode: (process.env.RESELLER_API_MODE || 'smm_panel').trim(),
});

const servicesCacheTtlMs = Number(process.env.RESELLER_SERVICES_CACHE_TTL_MS || 10 * 60 * 1000);
const servicesCacheFile = path.join(__dirname, '..', '.cache', 'reseller-services.json');
const bundledServicesFallbackFile = path.join(__dirname, '..', 'data', 'reseller-services-fallback.json');
let servicesCache = {
  data: null,
  expiresAt: 0,
  fetchedAt: 0,
};

const readServicesFromDisk = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const data = Array.isArray(parsed?.data) ? parsed.data : Array.isArray(parsed) ? parsed : null;

    if (!Array.isArray(data) || !data.length) {
      return null;
    }

    return {
      data,
      fetchedAt: Number(parsed?.fetchedAt || Date.now()),
    };
  } catch (error) {
    return null;
  }
};

const loadServicesCacheFromDisk = () => {
  const cachedServices = readServicesFromDisk(servicesCacheFile) || readServicesFromDisk(bundledServicesFallbackFile);

  if (!cachedServices) {
    return;
  }

  servicesCache = {
    data: cachedServices.data,
    fetchedAt: cachedServices.fetchedAt,
    expiresAt: cachedServices.fetchedAt + servicesCacheTtlMs,
  };
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

const getReadableResellerErrorMessage = (message = '') => {
  const normalizedMessage = String(message || '').trim();
  const lowercaseMessage = normalizedMessage.toLowerCase();

  if (lowercaseMessage.includes('incorrect request') || lowercaseMessage.includes('reason code')) {
    return 'CID reseller API rejected the request. Please verify that your SMM/Reseller API key is a valid panel API key for /api/v2, and restart the server after updating CID_API_KEY, SMM_API_KEY, or RESELLER_API_KEY.';
  }

  if (lowercaseMessage.includes('invalid key') || lowercaseMessage.includes('api key')) {
    return 'CID reseller API key is invalid. Update SMM_API_KEY or RESELLER_API_KEY with the correct reseller panel key.';
  }

  return normalizedMessage;
};

const callSmmPanel = async (action, params = {}) => {
  const config = buildConfig();
  const payload = new URLSearchParams({
    key: config.apiKey,
    api_key: config.apiKey,
    api_token: config.apiKey,
    token: config.apiKey,
    action,
  });

  if (config.apiKeyField && !['key', 'api_key'].includes(config.apiKeyField)) {
    payload.set(config.apiKeyField, config.apiKey);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.RESELLER_API_TIMEOUT_MS || 15000));

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      payload.append(key, String(value));
    }
  });

  if (action === 'add') {
    const serviceValue = params.service ?? params.serviceId;
    const linkValue = params.link ?? params.url;
    const quantityValue = params.quantity ?? params.qty ?? params.amount;

    if (serviceValue !== undefined && serviceValue !== null && serviceValue !== '') {
      payload.set('service', String(serviceValue));
    }

    if (linkValue !== undefined && linkValue !== null && linkValue !== '') {
      payload.set('link', String(linkValue));
      payload.set('url', String(linkValue));
    }

    if (quantityValue !== undefined && quantityValue !== null && quantityValue !== '') {
      payload.set('quantity', String(quantityValue));
      payload.set('qty', String(quantityValue));
      payload.set('amount', String(quantityValue));
    }
  }

  let response;

  try {
    response = await fetch(config.baseUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'YathuPubgStore/1.0',
      },
      signal: controller.signal,
      body: payload.toString(),
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('CID service request timed out. Please try again in a moment.');
      timeoutError.statusCode = 504;
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const raw = await response.text();
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    parsed = null;
  }

  if (!response.ok) {
    const error = new Error(
      getReadableResellerErrorMessage(
        parsed?.error ||
          parsed?.message ||
          `Reseller API request failed with status ${response.status}`
      ) ||
        `Reseller API request failed with status ${response.status}`
    );
    error.statusCode = response.status;
    error.raw = parsed || raw;
    throw error;
  }

  if (parsed?.error) {
    const error = new Error(getReadableResellerErrorMessage(parsed.error));
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

    const fallbackServices = readServicesFromDisk(bundledServicesFallbackFile);
    if (fallbackServices?.data) {
      servicesCache = {
        data: fallbackServices.data,
        fetchedAt: fallbackServices.fetchedAt,
        expiresAt: Date.now() + servicesCacheTtlMs,
      };
      return fallbackServices.data;
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
