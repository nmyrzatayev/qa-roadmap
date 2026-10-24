import React from 'react';
import { Star, ShoppingCart, AlertCircle } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, isAdding }) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card">
      <div className="product-img-wrapper">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="product-img" 
          loading="lazy" 
        />
        <span className={`stock-tag ${isOutOfStock ? 'stock-out' : 'stock-in'}`}>
          {isOutOfStock ? 'Нет в наличии' : `В наличии: ${product.stock} шт.`}
        </span>
      </div>

      <div className="product-info">
        <span className="product-cat">{product.category}</span>
        <h3 className="product-title" title={product.title}>
          {product.title}
        </h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-meta">
          <div className="product-price">
            {product.price.toLocaleString('ru-RU')} ₽
          </div>
          <div className="product-rating">
            <Star size={15} fill="#d97706" color="#d97706" />
            <span>{product.rating}</span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        <button 
          className="btn-add-cart"
          onClick={() => onAddToCart(product.id)}
          disabled={isOutOfStock || isAdding}
          title={isOutOfStock ? 'Товар закончился на складе' : 'Добавить в корзину'}
        >
          {isOutOfStock ? (
            <>
              <AlertCircle size={16} />
              <span>Распродано</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>{isAdding ? 'Добавление...' : 'В корзину'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
