
import axios from 'axios';

export function getApiErrorMessage(error, fallback) {
  const responseData = error.response?.data;
  if (typeof responseData?.message === 'string' && responseData.message.trim()) {
    return responseData.message;
  }
  if (typeof responseData?.error === 'string' && responseData.error.trim()) {
    return responseData.error;
  }
  if (error.response?.status === 401) {
    return 'Your session has expired. Please sign in again.';
  }
  if (error.response?.status === 403) {
    return 'You do not have permission to access this household.';
  }
  if (!error.response && (error.request || error.code === 'ERR_NETWORK')) {
    return 'Unable to reach the ChoreSync server. Check your connection and try again.';
  }
  return fallback;
}

function getApiBaseUrl() {
  const fallbackUrl = import.meta.env.DEV
    ? 'http://localhost:8080/api'
    : 'https://choresync-backend-5hon.onrender.com/api';
  const configuredUrl = import.meta.env.VITE_API_URL || fallbackUrl;
  const withoutTrailingSlashes = configuredUrl.replace(/\/+$/, '');
  const withoutDuplicateApiSegments = withoutTrailingSlashes.replace(/(?:\/api){2,}$/i, '/api');
  return /\/api$/i.test(withoutDuplicateApiSegments)
    ? withoutDuplicateApiSegments
    : `${withoutDuplicateApiSegments}/api`;
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
