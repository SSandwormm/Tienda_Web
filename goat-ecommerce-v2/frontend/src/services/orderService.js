import api from './api.js';

export function submitOrder(payload, token) {
  return api.post('/api/orders', payload, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((res) => res.data);
}