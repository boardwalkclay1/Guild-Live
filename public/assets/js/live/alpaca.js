// /assets/js/live/alpaca.js

(function () {
  const API_BASE = '/api';

  function getToken() {
    return localStorage.getItem('guild_live_token') || '';
  }

  function setToken(token) {
    localStorage.setItem('guild_live_token', token);
  }

  async function request(path, options = {}) {
    const headers = options.headers || {};
    const token = getToken();

    const res = await fetch(API_BASE + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...headers
      }
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `Request failed: ${res.status}`);
    }

    return data;
  }

  const AlpacaClient = {
    // AUTH
    async login(email, password) {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (data.token) setToken(data.token);
      return data;
    },

    async logout() {
      localStorage.removeItem('guild_live_token');
    },

    // KYC / ACCOUNT CREATION
    async submitKyc(kycData) {
      return request('/kyc', {
        method: 'POST',
        body: JSON.stringify(kycData)
      });
    },

    // ACCOUNT
    async getAccount() {
      return request('/account');
    },

    // POSITIONS
    async getPositions() {
      return request('/positions');
    },

    // ORDERS
    async getOrders() {
      return request('/orders');
    },

    async placeOrder(order) {
      return request('/orders', {
        method: 'POST',
        body: JSON.stringify(order)
      });
    },

    // WATCHLIST
    async getWatchlist() {
      return request('/watchlist');
    },

    async addToWatchlist(symbol) {
      return request('/watchlist', {
        method: 'POST',
        body: JSON.stringify({ symbol })
      });
    },

    async removeFromWatchlist(symbol) {
      return request(`/watchlist/${encodeURIComponent(symbol)}`, {
        method: 'DELETE'
      });
    },

    // MARKET DATA
    async getQuote(symbol) {
      return request(`/quote/${encodeURIComponent(symbol)}`);
    },

    async getBars(symbol, timeframe) {
      return request(`/bars/${encodeURIComponent(symbol)}/${encodeURIComponent(timeframe)}`);
    },

    // FUNDING
    async linkBank() {
      return request('/funding/link-bank', { method: 'POST' });
    },

    async deposit(amount) {
      return request('/funding/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount })
      });
    },

    async withdraw(amount) {
      return request('/funding/withdraw', {
        method: 'POST',
        body: JSON.stringify({ amount })
      });
    }
  };

  window.AlpacaClient = AlpacaClient;
})();
