const DEFAULT_API_URL = 'https://yathu-official.onrender.com';

const getApiBaseUrl = () => {
  const rawUrl = process.env.REACT_APP_API_URL || DEFAULT_API_URL;
  const normalizedUrl = rawUrl.trim().replace(/\/+$/, '');

  return normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`;
};

export const API_BASE_URL = getApiBaseUrl();
