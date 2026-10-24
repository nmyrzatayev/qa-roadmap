const API_BASE = 'http://localhost:5000/api/v1';

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Ошибка сервера (${res.status})`);
    }
    return res.json();
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Ошибка (${res.status})`);
    }
    return res.json();
  },

  // Cart
  async getCart() {
    const res = await fetch(`${API_BASE}/cart`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Ошибка загрузки корзины');
    }
    return res.json();
  },

  async addToCart(productId, quantity = 1) {
    const res = await fetch(`${API_BASE}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Ошибка добавления в корзину');
    }
    return data;
  },

  async updateCartItem(productId, quantity) {
    const res = await fetch(`${API_BASE}/cart/items`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Ошибка обновления корзины');
    }
    return data;
  },

  async removeFromCart(productId) {
    const res = await fetch(`${API_BASE}/cart/items/${productId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async clearCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Orders
  async checkout(payload) {
    const res = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Ошибка оформления (${res.status})`);
    }
    return data;
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Неверный логин или пароль');
    }
    return data;
  },

  // QA Chaos Tools
  async getQaStatus() {
    const res = await fetch(`${API_BASE}/qa/status`);
    return res.json();
  },

  async setChaos(delayMs, forceStatus, isBuggyMode) {
    const res = await fetch(`${API_BASE}/qa/simulate-chaos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delayMs, forceStatus, isBuggyMode })
    });
    return res.json();
  },

  async resetDatabase() {
    const res = await fetch(`${API_BASE}/qa/reset`, {
      method: 'POST'
    });
    return res.json();
  }
};
