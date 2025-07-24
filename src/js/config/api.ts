export const getApiUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }

  const hostname = window.location.hostname;
  
  if (hostname.includes('vercel.app')) {
    return 'https://autotrader-clone.onrender.com/api';
  } else {
    return 'http://localhost:5000/api';
  }
};

export const API_BASE_URL = getApiUrl();