import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onProceedToCheckout,
  promoCode,
  setPromoCode,
  promoDiscount,
  setPromoDiscount,
  isBuggyMode = false
}) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  
  const handleApplyPromo = () => {
    setPromoError('');
    // In buggy mode: NO uppercase conversion! Lowercase 'qa2026' fails!
    const code = isBuggyMode ? promoInput.trim() : promoInput.trim().toUpperCase();
    if (code === 'QA2026') {
      setPromoCode('QA2026');
      setPromoDiscount({ percent: 20, freeShipping: false, text: 'Скидка 20% по промокоду QA2026' });
    } else if (code === 'FREESHIP') {
      setPromoCode('FREESHIP');
      setPromoDiscount({ percent: 0, freeShipping: true, text: 'Бесплатная доставка' });
    } else if (code === 'FIRST10') {
      setPromoCode('FIRST10');
      setPromoDiscount({ percent: 10, freeShipping: false, text: 'Скидка 10% на первый заказ' });
    } else {
      setPromoError('Недействительный промокод. Попробуйте: QA2026, FREESHIP или FIRST10');
    }
  };

  // In buggy mode: float without Math.round
  const discountAmount = promoDiscount?.percent 
    ? (isBuggyMode ? ((subtotal * promoDiscount.percent) / 100) : Math.round((subtotal * promoDiscount.percent) / 100))
    : 0;

  const shippingCost = cartItems.length === 0 
    ? 0 
    : (promoDiscount?.freeShipping ? 0 : 350);

  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#4f46e5" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Корзина покупок</h2>
          </div>
          <button onClick={onClose} style={{ color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛒</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>
                Ваша корзина пуста
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                Выберите подходящие товары из каталога и добавьте их в корзину
              </p>
              <button onClick={onClose} className="btn-primary">
                Вернуться к покупкам
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {cartItems.map((item) => (
                  <div key={item.productId} className="cart-item">
                    <img 
                      src={item.product?.imageUrl || 'https://via.placeholder.com/60'} 
                      alt={item.product?.title} 
                      className="cart-item-img" 
                    />
                    
                    <div style={{ flex: 1 }}>
                      <div className="cart-item-title">{item.product?.title}</div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                        {item.product?.price?.toLocaleString('ru-RU')} ₽ за шт.
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="qty-control">
                      <button 
                        onClick={() => onUpdateQuantity(item.productId, isBuggyMode ? item.quantity - 1 : (item.quantity > 1 ? item.quantity - 1 : 1))}
                        style={{ padding: '4px', color: '#64748b' }}
                        title="Уменьшить"
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        style={{ padding: '4px', color: '#64748b' }}
                        title="Увеличить"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>
                      {item.subtotal?.toLocaleString('ru-RU')} ₽
                    </div>

                    <button 
                      onClick={() => onRemoveItem(item.productId)}
                      style={{ color: '#ef4444', padding: '6px' }}
                      title="Удалить из корзины"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Promo Code section */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      placeholder="Промокод (QA2026, FREESHIP)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <button onClick={handleApplyPromo} className="btn-secondary" style={{ padding: '8px 14px' }}>
                    Применить
                  </button>
                </div>
                {promoError && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>
                    {promoError}
                  </div>
                )}
                {promoDiscount && (
                  <div style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '6px', fontWeight: 600 }}>
                    ✓ {promoDiscount.text}
                  </div>
                )}
              </div>

              {/* Calculation Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Товары ({cartItems.length}):</span>
                  <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                    <span>Скидка ({promoCode}):</span>
                    <span>-{discountAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Доставка курьером:</span>
                  <span>{shippingCost === 0 ? 'Бесплатно' : `${shippingCost} ₽`}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginTop: '8px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' }}>
                  <span>Итого к оплате:</span>
                  <span style={{ color: '#4f46e5' }}>{total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="modal-footer">
            <button onClick={onClose} className="btn-secondary">
              Продолжить покупки
            </button>
            <button 
              onClick={onProceedToCheckout} 
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>Оформить заказ</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
