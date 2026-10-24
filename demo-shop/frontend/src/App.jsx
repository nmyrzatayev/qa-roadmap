import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import QaPanelModal from './components/QaPanelModal';
import AuthModal from './components/AuthModal';
import BugHunterQuestModal from './components/BugHunterQuestModal';
import { api } from './api';
import { AlertCircle, RefreshCw } from 'lucide-react';

const CATEGORIES = ['Все', 'Электроника', 'Одежда', 'Аксессуары', 'Книги'];

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все');
  const [sort, setSort] = useState('default');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isQaOpen, setIsQaOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBugHunterOpen, setIsBugHunterOpen] = useState(false);

  // Buggy Mode
  const [isBuggyMode, setIsBuggyMode] = useState(false);

  // Cart & Orders
  const [cartItems, setCartItems] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(null);

  // User
  const [user, setUser] = useState({
    id: 1,
    name: 'Алексей Тестировщик',
    email: 'tester@qa.com',
    role: 'user'
  });

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getProducts({ search, category, sort });
      setProducts(data.items || []);
    } catch (err) {
      setError(err.message || 'Не удалось загрузить список товаров');
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const data = await api.getCart();
      setCartItems(data.items || []);
    } catch (err) {
      console.error('Ошибка загрузки корзины:', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category, sort]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadCart();
    api.getQaStatus()
      .then(res => {
        if (res?.settings?.isBuggyMode !== undefined) {
          setIsBuggyMode(res.settings.isBuggyMode);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleBuggyMode = async () => {
    const next = !isBuggyMode;
    setIsBuggyMode(next);
    try {
      const status = await api.getQaStatus();
      await api.setChaos(status.settings.artificialDelayMs, status.settings.forceErrorStatus, next);
      showToast(next ? '🔥 Режим Buggy Mode ВКЛЮЧЕН! Ищите баги в магазине' : '🛡️ Режим багов ВЫКЛЮЧЕН');
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = async (productId) => {
    setAddingId(productId);
    try {
      await api.addToCart(productId, 1);
      await loadCart();
      showToast('Товар успешно добавлен в корзину');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setAddingId(null);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await api.updateCartItem(productId, quantity);
      await loadCart();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await api.removeFromCart(productId);
      await loadCart();
      showToast('Товар удален из корзины');
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    loadCart();
    loadProducts(); // refresh stock numbers
    setPromoCode('');
    setPromoDiscount(null);
  };

  const handleDbReset = () => {
    loadProducts();
    loadCart();
    setPromoCode('');
    setPromoDiscount(null);
    showToast('База данных успешно обновлена');
  };

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.isError ? 'error' : ''}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar 
        search={search}
        setSearch={setSearch}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQa={() => setIsQaOpen(true)}
        onOpenBugHunter={() => setIsBugHunterOpen(true)}
        isBuggyMode={isBuggyMode}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={() => {
          setUser(null);
          showToast('Вы вышли из учетной записи');
        }}
      />

      {/* Main Body */}
      <main className="main-content">
        {/* Category Pills */}
        <div className="categories-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-pill ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="controls-bar">
          <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
            Найдено товаров: <b style={{ color: '#0f172a' }}>{products.length}</b>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Сортировка:</span>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="sort-select"
            >
              <option value="default">По умолчанию</option>
              <option value="price_asc">Сначала дешевле</option>
              <option value="price_desc">Сначала дороже</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: '#fef2f2', 
            border: '1px solid #fecaca', 
            padding: '16px 20px', 
            borderRadius: '12px', 
            color: '#b91c1c',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} />
              <div>
                <div style={{ fontWeight: 700 }}>Ошибка загрузки данных</div>
                <div style={{ fontSize: '0.9rem' }}>{error}</div>
              </div>
            </div>
            <button 
              onClick={loadProducts} 
              className="btn-icon" 
              style={{ background: '#fff', color: '#b91c1c', borderColor: '#fca5a5' }}
            >
              <RefreshCw size={14} />
              <span>Повторить</span>
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
            <p>Загрузка товаров из каталога...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '14px' }}>🔍</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Ничего не найдено</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Попробуйте изменить поисковый запрос или выбрать другую категорию
                </p>
                <button 
                  onClick={() => { setSearch(''); setCategory('Все'); }}
                  className="btn-secondary"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    isAdding={addingId === product.id}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '24px 20px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        <p>🎓 QA Training Playground E-Commerce Platform | Разработано для практики тестирования</p>
        <p style={{ marginTop: '6px' }}>
          Бэкенд: Node.js Express + Swagger UI (<code>http://localhost:5000/api-docs</code>) | Фронтенд: React + Vite
        </p>
      </footer>

      {/* Modals */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        promoDiscount={promoDiscount}
        setPromoDiscount={setPromoDiscount}
        isBuggyMode={isBuggyMode}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        promoCode={promoCode}
        onOrderSuccess={handleOrderSuccess}
        isBuggyMode={isBuggyMode}
      />

      <BugHunterQuestModal 
        isOpen={isBugHunterOpen}
        onClose={() => setIsBugHunterOpen(false)}
        isBuggyMode={isBuggyMode}
        onToggleBuggyMode={handleToggleBuggyMode}
      />

      <QaPanelModal 
        isOpen={isQaOpen}
        onClose={() => setIsQaOpen(false)}
        onDbReset={handleDbReset}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          showToast(`Добро пожаловать, ${loggedUser.name}!`);
        }}
      />
    </div>
  );
}
