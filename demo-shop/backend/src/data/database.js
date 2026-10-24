import 'reflect-metadata';
import { DataSource, Like, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ProductEntity } from '../entities/Product.js';
import { CartItemEntity } from '../entities/CartItem.js';
import { OrderEntity } from '../entities/Order.js';
import { UserEntity } from '../entities/User.js';
import { QaSettingEntity } from '../entities/QaSetting.js';
import { initialProducts, promoCodes } from './mockData.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'qashop',
  synchronize: true, // Automatically creates and syncs table schema on start
  logging: process.env.NODE_ENV === 'development',
  entities: [ProductEntity, CartItemEntity, OrderEntity, UserEntity, QaSettingEntity]
});

export const dbService = {
  dataSource: AppDataSource,

  async initialize() {
    await AppDataSource.initialize();
    console.log('📦 Connected to PostgreSQL database via TypeORM');
    await this.seedInitialData();
  },

  async seedInitialData() {
    const productRepo = AppDataSource.getRepository(ProductEntity);
    const userRepo = AppDataSource.getRepository(UserEntity);
    const qaRepo = AppDataSource.getRepository(QaSettingEntity);

    const count = await productRepo.count();
    if (count === 0) {
      console.log('🌱 Seeding initial products into PostgreSQL...');
      for (const p of initialProducts) {
        await productRepo.save({
          title: p.title,
          category: p.category,
          price: p.price,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
          stock: p.stock,
          description: p.description,
          imageUrl: p.imageUrl
        });
      }
    }

    const userCount = await userRepo.count();
    if (userCount === 0) {
      console.log('🌱 Seeding initial test users into PostgreSQL...');
      await userRepo.save([
        {
          name: 'Алексей Тестировщик',
          email: 'tester@qa.com',
          password: 'password123',
          role: 'user'
        },
        {
          name: 'Главный Администратор',
          email: 'admin@qa.com',
          password: 'admin123!',
          role: 'admin'
        }
      ]);
    }

    const qaSetting = await qaRepo.findOneBy({ id: 1 });
    if (!qaSetting) {
      await qaRepo.save({ id: 1, artificialDelayMs: 0, forceErrorStatus: null });
    }
  },

  async resetDatabase() {
    const productRepo = AppDataSource.getRepository(ProductEntity);
    const cartRepo = AppDataSource.getRepository(CartItemEntity);
    const orderRepo = AppDataSource.getRepository(OrderEntity);
    const userRepo = AppDataSource.getRepository(UserEntity);
    const qaRepo = AppDataSource.getRepository(QaSettingEntity);

    // Clear cart and orders
    await cartRepo.clear();
    await orderRepo.clear();
    await productRepo.clear();
    await userRepo.clear();

    // Re-seed products and users
    for (const p of initialProducts) {
      await productRepo.save({
        title: p.title,
        category: p.category,
        price: p.price,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        stock: p.stock,
        description: p.description,
        imageUrl: p.imageUrl
      });
    }

    await userRepo.save([
      {
        name: 'Алексей Тестировщик',
        email: 'tester@qa.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Главный Администратор',
        email: 'admin@qa.com',
        password: 'admin123!',
        role: 'admin'
      }
    ]);

    await qaRepo.save({ id: 1, artificialDelayMs: 0, forceErrorStatus: null });

    return { success: true, message: 'PostgreSQL database successfully reset to initial seed' };
  },

  // Products
  async getProducts({ search, category, minPrice, maxPrice, sort, page = 1, limit = 10 }) {
    const productRepo = AppDataSource.getRepository(ProductEntity);
    let qb = productRepo.createQueryBuilder('product');

    if (search) {
      qb = qb.andWhere(
        '(LOWER(product.title) LIKE :q OR LOWER(product.description) LIKE :q)',
        { q: `%${search.toLowerCase()}%` }
      );
    }

    if (category && category !== 'Все') {
      qb = qb.andWhere('LOWER(product.category) = LOWER(:cat)', { cat: category });
    }

    if (minPrice !== undefined && minPrice !== '') {
      qb = qb.andWhere('product.price >= :min', { min: Number(minPrice) });
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      qb = qb.andWhere('product.price <= :max', { max: Number(maxPrice) });
    }

    if (sort === 'price_asc') {
      qb = qb.orderBy('product.price', 'ASC');
    } else if (sort === 'price_desc') {
      qb = qb.orderBy('product.price', 'DESC');
    } else if (sort === 'rating') {
      qb = qb.orderBy('product.rating', 'DESC');
    } else {
      qb = qb.orderBy('product.id', 'ASC');
    }

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [items, total] = await qb.skip(skip).take(take).getManyAndCount();

    return {
      total,
      page: Number(page),
      limit: take,
      totalPages: Math.ceil(total / take),
      items
    };
  },

  async getProductById(id) {
    const productRepo = AppDataSource.getRepository(ProductEntity);
    return productRepo.findOneBy({ id: Number(id) });
  },

  async addProduct(data) {
    const productRepo = AppDataSource.getRepository(ProductEntity);
    const product = productRepo.create({
      title: data.title,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      description: data.description,
      imageUrl: data.imageUrl,
      rating: data.rating || 5.0,
      reviewsCount: data.reviewsCount || 0
    });
    return productRepo.save(product);
  },

  async deleteProduct(id) {
    const productRepo = AppDataSource.getRepository(ProductEntity);
    const res = await productRepo.delete(Number(id));
    return res.affected > 0;
  },

  // Cart
  async getCart() {
    const cartRepo = AppDataSource.getRepository(CartItemEntity);
    const productRepo = AppDataSource.getRepository(ProductEntity);

    const cartEntries = await cartRepo.find();
    const result = [];

    for (const item of cartEntries) {
      const product = await productRepo.findOneBy({ id: item.productId });
      result.push({
        productId: item.productId,
        quantity: item.quantity,
        product: product || null,
        subtotal: product ? product.price * item.quantity : 0
      });
    }

    return result;
  },

  async addToCart(productId, quantity = 1) {
    const productRepo = AppDataSource.getRepository(ProductEntity);
    const cartRepo = AppDataSource.getRepository(CartItemEntity);

    const product = await productRepo.findOneBy({ id: Number(productId) });
    if (!product) return { error: 'Product not found', status: 404 };

    if (product.stock < quantity) {
      return { error: `Недостаточно товара на складе. Доступно: ${product.stock}`, status: 400 };
    }

    const existing = await cartRepo.findOneBy({ productId: Number(productId) });
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        return { error: `Нельзя добавить больше остатка на складе (${product.stock} шт.)`, status: 400 };
      }
      existing.quantity = newQty;
      await cartRepo.save(existing);
    } else {
      await cartRepo.save({ productId: Number(productId), quantity });
    }

    const cart = await this.getCart();
    return { success: true, cart };
  },

  async updateCartItem(productId, quantity) {
    const productRepo = AppDataSource.getRepository(ProductEntity);
    const cartRepo = AppDataSource.getRepository(CartItemEntity);

    const product = await productRepo.findOneBy({ id: Number(productId) });
    if (!product) return { error: 'Product not found', status: 404 };

    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    if (quantity > product.stock) {
      return { error: `Недостаточно товара на складе. Доступно: ${product.stock}`, status: 400 };
    }

    const existing = await cartRepo.findOneBy({ productId: Number(productId) });
    if (existing) {
      existing.quantity = quantity;
      await cartRepo.save(existing);
      const cart = await this.getCart();
      return { success: true, cart };
    }

    return { error: 'Item not in cart', status: 404 };
  },

  async removeFromCart(productId) {
    const cartRepo = AppDataSource.getRepository(CartItemEntity);
    await cartRepo.delete({ productId: Number(productId) });
    const cart = await this.getCart();
    return { success: true, cart };
  },

  async clearCart() {
    const cartRepo = AppDataSource.getRepository(CartItemEntity);
    await cartRepo.clear();
  },

  // Orders
  async createOrder({ customer, items, promoCode }) {
    if (!items || items.length === 0) {
      return { error: 'Корзина пуста', status: 400 };
    }

    const productRepo = AppDataSource.getRepository(ProductEntity);
    const orderRepo = AppDataSource.getRepository(OrderEntity);

    const qaSettings = await this.getQaSettings();

    // In normal mode: validate stock strictly
    if (!qaSettings.isBuggyMode) {
      for (const item of items) {
        const product = await productRepo.findOneBy({ id: Number(item.productId) });
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
    }

    // Deduct stock
    for (const item of items) {
      const product = await productRepo.findOneBy({ id: Number(item.productId) });
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await productRepo.save(product);
      }
    }

    // Calculate totals
    let subtotal = 0;
    const detailedItems = [];
    for (const item of items) {
      const product = await productRepo.findOneBy({ id: Number(item.productId) });
      const price = product ? product.price : 1000;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;
      detailedItems.push({
        productId: item.productId,
        title: product ? product.title : 'Неизвестный товар',
        price: price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    let discount = 0;
    let shipping = 350;

    // In Buggy Mode: promo code is strictly case-sensitive, and rounding bug is active!
    if (qaSettings.isBuggyMode) {
      if (promoCode && promoCodes[promoCode]) { // Notice: NO .toUpperCase()! 'qa2026' fails!
        const promo = promoCodes[promoCode];
        if (promo.discountPercent) {
          // Floating point bug without Math.round: 199.99999999999997
          discount = (subtotal * promo.discountPercent) / 100;
        }
        if (promo.freeShipping) {
          shipping = 0;
        }
      }
    } else {
      if (promoCode && promoCodes[promoCode.toUpperCase()]) {
        const promo = promoCodes[promoCode.toUpperCase()];
        if (promo.discountPercent) {
          discount = Math.round((subtotal * promo.discountPercent) / 100);
        }
        if (promo.freeShipping) {
          shipping = 0;
        }
      }
    }

    const total = qaSettings.isBuggyMode ? (subtotal - discount + shipping) : Math.max(0, Math.round(subtotal - discount + shipping));
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;

    const order = orderRepo.create({
      id: orderId,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      paymentMethod: customer.paymentMethod || 'CARD',
      itemsJson: detailedItems,
      subtotal,
      discount,
      shipping,
      total,
      status: 'PAID'
    });

    await orderRepo.save(order);
    await this.clearCart();

    return { 
      success: true, 
      order: {
        id: order.id,
        createdAt: order.createdAt,
        customer,
        items: detailedItems,
        subtotal,
        discount,
        shipping,
        total,
        status: order.status,
        paymentMethod: order.paymentMethod
      }
    };
  },

  async getOrders() {
    const orderRepo = AppDataSource.getRepository(OrderEntity);
    return orderRepo.find({ order: { createdAt: 'DESC' } });
  },

  // Users
  async findUserByEmail(email) {
    const userRepo = AppDataSource.getRepository(UserEntity);
    return userRepo.findOneBy({ email: email.toLowerCase() });
  },

  async createUser(data) {
    const userRepo = AppDataSource.getRepository(UserEntity);
    const user = userRepo.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      role: data.role || 'user'
    });
    return userRepo.save(user);
  },

  // QA Settings
  async getQaSettings() {
    const qaRepo = AppDataSource.getRepository(QaSettingEntity);
    let s = await qaRepo.findOneBy({ id: 1 });
    if (!s) {
      s = await qaRepo.save({ id: 1, artificialDelayMs: 0, forceErrorStatus: null, isBuggyMode: false });
    }
    return s;
  },

  async updateQaSettings({ delayMs, forceStatus, isBuggyMode }) {
    const qaRepo = AppDataSource.getRepository(QaSettingEntity);
    const current = await this.getQaSettings();
    await qaRepo.save({
      id: 1,
      artificialDelayMs: delayMs !== undefined ? Math.max(0, Number(delayMs) || 0) : current.artificialDelayMs,
      forceErrorStatus: forceStatus !== undefined ? (forceStatus ? Number(forceStatus) : null) : current.forceErrorStatus,
      isBuggyMode: isBuggyMode !== undefined ? Boolean(isBuggyMode) : current.isBuggyMode
    });
    return this.getQaSettings();
  },

  async getStats() {
    const productRepo = AppDataSource.getRepository(ProductEntity);
    const cartRepo = AppDataSource.getRepository(CartItemEntity);
    const orderRepo = AppDataSource.getRepository(OrderEntity);
    const userRepo = AppDataSource.getRepository(UserEntity);

    const [productsCount, cartItemsCount, ordersCount, usersCount] = await Promise.all([
      productRepo.count(),
      cartRepo.count(),
      orderRepo.count(),
      userRepo.count()
    ]);

    return { productsCount, cartItemsCount, ordersCount, usersCount };
  }
};
