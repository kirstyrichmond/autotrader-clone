// API Configuration
export const getApiUrl = (): string => {
  // Use environment variable if available, otherwise detect based on current URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }

  // Auto-detect based on current domain
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Local development
    return 'http://localhost:5000/api';
  } else if (hostname.includes('vercel.app')) {
    // Production on Vercel - point to your deployed backend
    return 'https://autotrader-clone.onrender.com/api';
  } else {
    // Fallback for other domains
    return 'http://localhost:5000/api';
  }
};

export const API_BASE_URL = getApiUrl();