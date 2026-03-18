import axios from 'axios';

const TOKEN_STORAGE_KEY = '@OculosVR:token';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
export const API_DOCS_URL = `${API_BASE_URL.replace(/\/$/, '')}/docs`;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  delete api.defaults.headers.common.Authorization;
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
