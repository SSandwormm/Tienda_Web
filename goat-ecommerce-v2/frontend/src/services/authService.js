import api from './api.js';

export default {
  login(credentials) {
    return api.post('/api/auth/login', credentials).then((res) => res.data);
  },
  register(user) {
    return api.post('/api/auth/register', user).then((res) => res.data);
  }
};