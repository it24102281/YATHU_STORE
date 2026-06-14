const DEFAULT_API_URL = 'https://yathu-official.onrender.com';
const STALE_LOCAL_API_PATTERNS = ['localhost:5001', '127.0.0.1:5001'];

const getApiBaseUrl = () => {
  const isLocalHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (isLocalHost) {
    return 'http://localhost:5001/api';
  }

  const rawUrl =
    process.env.REACT_APP_API_URL || DEFAULT_API_URL;
  const normalizedUrl = rawUrl.trim().replace(/\/+$/, '');
  const normalizedApiUrl = normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`;

  // Prevent stale local dev bundles from calling a backend that is no longer running.
  if (STALE_LOCAL_API_PATTERNS.some((pattern) => normalizedApiUrl.includes(pattern))) {
    return `${DEFAULT_API_URL}/api`;
  }

  return normalizedApiUrl;
};

export const API_BASE_URL = getApiBaseUrl();
