import axios from 'axios';

const TOKEN_STORAGE_KEY = '@OculosVR:token';

// Mantemos a URL do backend em um unico lugar para simplificar o ambiente.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
});

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

// Sincronizamos o token no Axios para reutilizar o mesmo header nas rotas protegidas.
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
