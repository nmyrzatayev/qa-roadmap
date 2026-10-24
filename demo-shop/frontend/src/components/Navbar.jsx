import React from 'react';
import { ShoppingBag, Search, ShieldAlert, BookOpen, User, CheckCircle2, Send, Bug } from 'lucide-react';

export default function Navbar({ 
  search, 
  setSearch, 
  cartCount, 
  onOpenCart, 
  onOpenQa, 
  onOpenBugHunter,
  isBuggyMode,
  onOpenAuth, 
  user, 
  onLogout 
}) {
  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Brand */}
        <div className="logo-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🛒</span>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                QA Sandbox Shop
              </h1>
            </div>
          </div>
          <span className="logo-badge">PRACTICE APP</span>
        </div>

        {/* Search */}
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Поиск товаров (например: наушники, худи, книга)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="nav-actions">
          {/* Bug Hunter Quest Button */}
          <button 
            onClick={onOpenBugHunter} 
            className="btn-icon"
            style={{ 
              background: isBuggyMode ? '#fdf2f8' : '#ffffff', 
              color: isBuggyMode ? '#be185d' : '#0f172a', 
              borderColor: isBuggyMode ? '#fbcfe8' : '#e2e8f0',
              fontWeight: 700
            }}
            title="Открыть квест по поиску багов и включить Buggy Mode"
          >
            <Bug size={16} color={isBuggyMode ? '#be185d' : '#4f46e5'} />
            <span>🐞 Bug Hunter</span>
            {isBuggyMode && (
              <span style={{ background: '#be185d', color: '#fff', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '10px' }}>
                ACTIVE
              </span>
            )}
          </button>

          {/* Postman Link */}
          <a 
            href="http://localhost:5000/api/v1/postman" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-icon"
            style={{ background: '#fff7ed', color: '#ea580c', borderColor: '#ffedd5' }}
            title="Инструкции и экспорт готовой коллекции запросов для Postman"
          >
            <Send size={15} />
            <span>Postman</span>
          </a>

          {/* Swagger Link */}
          <a 
            href="http://localhost:5000/api-docs" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-icon btn-swagger"
            title="Открыть интерактивную документацию Swagger UI"
          >
            <BookOpen size={16} />
            <span>Swagger API</span>
          </a>

          {/* QA Chaos Tool Button */}
          <button 
            onClick={onOpenQa} 
            className="btn-icon btn-qa"
            title="Инструменты для тестирования сбоев и задержек"
          >
            <ShieldAlert size={16} />
            <span>🧪 QA Sandbox</span>
          </button>

          {/* Auth Button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '0.85rem', 
                  background: '#f1f5f9', 
                  padding: '6px 12px', 
                  borderRadius: '8px', 
                  fontWeight: 600 
                }}
              >
                <User size={14} />
                <span>{user.name.split(' ')[0]}</span>
              </div>
              <button 
                onClick={onLogout}
                style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'underline' }}
              >
                Выйти
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn-icon">
              <User size={16} />
              <span>Войти</span>
            </button>
          )}

          {/* Cart Button */}
          <button 
            onClick={onOpenCart} 
            className="btn-icon" 
            style={{ background: '#1e1b4b', color: '#ffffff', borderColor: '#1e1b4b' }}
          >
            <ShoppingBag size={18} />
            <span>Корзина</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
