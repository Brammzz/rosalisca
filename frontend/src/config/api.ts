// API Configuration
const getApiUrl = (): string => {
  // Check if we're in development or production
  if (import.meta.env.DEV) {
    // Development environment
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  } else {
    // Production environment
    return import.meta.env.VITE_API_URL || 'https://rosalisca-backend.vercel.app';
  }
};

export const API_BASE_URL = getApiUrl();

// API endpoints
export const API_ENDPOINTS = {
  auth: `${API_BASE_URL}/api/auth`,
  projects: `${API_BASE_URL}/api/projects`,
  clients: `${API_BASE_URL}/api/clients`,
  contacts: `${API_BASE_URL}/api/contacts`,
  careers: `${API_BASE_URL}/api/careers`,
  certificates: `${API_BASE_URL}/api/certificates`,
  companies: `${API_BASE_URL}/api/companies`,
  dashboard: `${API_BASE_URL}/api/dashboard`,
};

console.log('API Configuration:', {
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  baseUrl: API_BASE_URL
});
