export const getApiUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    const envUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
    console.log('Using VITE_API_URL:', envUrl);
    return envUrl;
  }

  const hostname = window.location.hostname;
  
  if (hostname.includes('vercel.app')) {
    const prodUrl = 'https://autotrader-clone.onrender.com/api';
    console.log('Using production URL:', prodUrl);
    return prodUrl;
  } else {
    const devUrl = 'http://localhost:5000/api';
    console.log('Using development URL:', devUrl);
    return devUrl;
  }
};

export const API_BASE_URL = getApiUrl();