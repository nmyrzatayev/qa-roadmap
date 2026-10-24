import { initialProducts, promoCodes } from './mockData.js';

class DatabaseStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.products = JSON.parse(JSON.stringify(initialProducts));
    this.cart = [];
    this.orders = [];
    this.users = [
      {
        id: 1,
        email: "tester@qa.com",
        password: "password123",
        name: "Алексей Тестировщик",
        role: "user"
      },
      {
        id: 2,
        email: "admin@qa.com",
        password: "admin123!",
        name: "Главный Администратор",
        role: "admin"
      }
    ];
    this.qaSettings = {
      artificialDelayMs: 0,
      forceErrorStatus: null
    };
  }

  // Products
  getProducts({ search, category, minPrice, maxPrice, sort, page = 1, limit = 10 }) {
    let result = [...this.products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'Все') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (minPrice !== undefined && minPrice !== '') {
      result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    const total = result.length;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      items: paginated
    };
  }

  getProductById(id) {
    return this.products.find(p => p.id === Number(id));
  }

  addProduct(product) {
    const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      ...product,
      rating: product.rating || 5.0,
      reviewsCount: product.reviewsCount || 0
    };
    this.products.push(newProduct);
    return newProduct;
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === Number(id));
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  // Cart
  getCart() {
    return this.cart.map(item => {
      const product = this.getProductById(item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        product: product || null,
        subtotal: product ? product.price * item.quantity : 0
      };
    });
  }

  addToCart(productId, quantity = 1) {
    const product = this.getProductById(productId);
    if (!product) return { error: "Product not found", status: 404 };
    if (product.stock < quantity) {
      return { error: `Недостаточно товара на складе. Доступно: ${product.stock}`, status: 400 };
    }

    const existingIndex = this.cart.findIndex(item => item.productId === Number(productId));
    if (existingIndex > -1) {
      const newQty = this.cart[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        return { error: `Нельзя добавить больше остатка на складе (${product.stock} шт.)`, status: 400 };
      }
      this.cart[existingIndex].quantity = newQty;
    } else {
      this.cart.push({ productId: Number(productId), quantity });
    }

    return { success: true, cart: this.getCart() };
  }

  updateCartItem(productId, quantity) {
    const product = this.getProductById(productId);
    if (!product) return { error: "Product not found", status: 404 };

    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    if (quantity > product.stock) {
      return { error: `Недостаточно товара на складе. Доступно: ${product.stock}`, status: 400 };
    }

    const item = this.cart.find(i => i.productId === Number(productId));
    if (item) {
      item.quantity = quantity;
      return { success: true, cart: this.getCart() };
    }
    return { error: "Item not in cart", status: 404 };
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.productId !== Number(productId));
    return { success: true, cart: this.getCart() };
  }

  clearCart() {
    this.cart = [];
  }

  // Orders
  createOrder({ customer, items, promoCode }) {
    if (!items || items.length === 0) {
      return { error: "Корзина пуста", status: 400 };
    }

    // Validate stock for all items
    for (const item of items) {
      const product = this.getProductById(item.productId);
      if (!product) {
        return { error: `Товар ID ${item.productId} не существует`, status: 400 };
      }
      if (product.stock < item.quantity) {
        return { 
          error: `Товар «${product.title}» закончился на складе (доступно: ${product.stock})`, 
          status: 409 
        };
      }
    }

    // Deduct stock
    for (const item of items) {
      const product = this.getProductById(item.productId);
      product.stock -= item.quantity;
    }

    // Calculate pricing
    let subtotal = 0;
    const detailedItems = items.map(item => {
      const product = this.getProductById(item.productId);
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.productId,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      };
    });

    let discount = 0;
    let shipping = 350;

    if (promoCode && promoCodes[promoCode.toUpperCase()]) {
      const promo = promoCodes[promoCode.toUpperCase()];
      if (promo.discountPercent) {
        discount = Math.round((subtotal * promo.discountPercent) / 100);
      }
      if (promo.freeShipping) {
        shipping = 0;
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;

    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer,
      items: detailedItems,
      subtotal,
      discount,
      shipping,
      total,
      status: "PAID",
      paymentMethod: customer.paymentMethod || "CARD"
    };

    this.orders.unshift(order);
    this.clearCart();

    return { success: true, order };
  }
}

export const db = new DatabaseStore();
