// API Configuration
const getApiUrl = (): string => {
  // Check if we're in development or production
  if (import.meta.env.DEV) {
    // Development environment
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  } else {
    // Production environment
    const baseUrl = import.meta.env.VITE_API_URL || 'https://rosalisca-backend.vercel.app';
    // Remove trailing /api if it exists to avoid duplication
    return baseUrl.replace(/\/api\/?$/, '');
  }
};

export const API_BASE_URL = getApiUrl();

// API endpoints - return base URL only, let services add their own paths
export const API_ENDPOINTS = {
  auth: `${API_BASE_URL}`,
  projects: `${API_BASE_URL}`,
  clients: `${API_BASE_URL}`,
  contacts: `${API_BASE_URL}`,
  careers: `${API_BASE_URL}`,
  certificates: `${API_BASE_URL}`,
  companies: `${API_BASE_URL}`,
  dashboard: `${API_BASE_URL}`,
};

console.log('API Configuration:', {
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  baseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS
});
