const API_URL = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('helmet_auth_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('helmet_auth_token', token);
  } else {
    localStorage.removeItem('helmet_auth_token');
  }
}

async function request(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || data.errors?.username?.[0] || 'Terjadi kesalahan pada server.';
    throw new Error(message);
  }

  return data;
}

export const api = {
  getCatalog: () => request('/catalog'),
  getServices: () => request('/services').then((res) => res.data),
  getOutlets: () => request('/outlets').then((res) => res.outlets),
  createOrder: (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrder: (code) => request(`/orders/${encodeURIComponent(code)}`).then((res) => res.order),
  login: (username, password) => request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  me: () => request('/me'),
  logout: () => request('/logout', { method: 'POST' }),
  getAdminOrders: () => request('/admin/orders').then((res) => res.data),
  updateOrderStatus: (code, status) => request(`/admin/orders/${encodeURIComponent(code)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  syncServices: (services) => request('/admin/services', {
    method: 'PUT',
    body: JSON.stringify({ services }),
  }),
  syncAddons: (addons) => request('/admin/addons', {
    method: 'PUT',
    body: JSON.stringify({ addons }),
  }),
  getReports: () => request('/admin/reports'),
};
