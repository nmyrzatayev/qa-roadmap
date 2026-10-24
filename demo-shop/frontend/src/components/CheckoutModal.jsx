import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, CreditCard, Banknote, Loader2 } from 'lucide-react';
import { api } from '../api';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  promoCode, 
  onOrderSuccess,
  isBuggyMode = false
}) {
  const [formData, setFormData] = useState({
    name: 'Иван Тестеров',
    email: 'tester@qa.com',
    phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Автотестовая, д. 404, кв. 1',
    paymentMethod: 'CARD'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Укажите ваше имя';
    if (!formData.email.trim()) {
      errs.email = 'Укажите email';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      errs.email = 'Некорректный формат email';
    }
    
    // In normal mode: validate that phone contains real digits
    if (!isBuggyMode) {
      if (!formData.phone.trim()) {
        errs.phone = 'Укажите номер телефона';
      } else if (!/^[\d\s\+\-\(\)]{7,20}$/.test(formData.phone)) {
        errs.phone = 'Номер телефона содержит недопустимые символы';
      }
    } else {
      // Buggy Mode: accepts any string including 'abc' or 'телефон'
      if (!formData.phone.trim()) errs.phone = 'Укажите номер телефона';
    }

    if (!formData.address.trim()) errs.address = 'Укажите адрес доставки';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      const itemsPayload = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const res = await api.checkout({
        customer: formData,
        promoCode: promoCode || undefined,
        items: itemsPayload
      });

      setCompletedOrder(res.order);
      onOrderSuccess();
    } catch (err) {
      setApiError(err.message || 'Ошибка при оформлении заказа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setApiError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {completedOrder ? 'Заказ успешно оформлен' : 'Оформление доставки'}
          </h2>
          <button onClick={handleClose} style={{ color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {completedOrder ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
                Спасибо за заказ!
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
                Номер вашего заказа: <b style={{ color: '#0f172a' }}>{completedOrder.id}</b>
              </p>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', textAlign: 'left', fontSize: '0.9rem', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Получатель:</span>
                  {isBuggyMode ? (
                    <b dangerouslySetInnerHTML={{ __html: completedOrder.customer.name }} />
                  ) : (
                    <b>{completedOrder.customer.name}</b>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Адрес:</span>
                  <span style={{ textAlign: 'right', maxWidth: '240px' }}>{completedOrder.customer.address}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Оплата:</span>
                  <span>{completedOrder.paymentMethod === 'CARD' ? 'Банковская карта' : 'Наличные курьеру'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '8px', marginTop: '8px', fontWeight: 700, fontSize: '1.05rem' }}>
                  <span>Оплачено:</span>
                  <span style={{ color: '#4f46e5' }}>{completedOrder.total?.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              <button onClick={handleClose} className="btn-primary" style={{ width: '100%' }}>
                Вернуться в магазин
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {apiError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', color: '#b91c1c', fontSize: '0.9rem' }}>
                  <AlertTriangle size={18} />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  ФИО получателя *
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${errors.name ? '#ef4444' : '#cbd5e1'}` }}
                  placeholder="Иван Иванов"
                />
                {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.name}</span>}
              </div>

              {/* Email & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                    Email *
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${errors.email ? '#ef4444' : '#cbd5e1'}` }}
                    placeholder="email@example.com"
                  />
                  {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.email}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                    Телефон *
                  </label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${errors.phone ? '#ef4444' : '#cbd5e1'}` }}
                    placeholder="+7 (999) 000-00-00"
                  />
                  {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.phone}</span>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  Адрес доставки *
                </label>
                <textarea 
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${errors.address ? '#ef4444' : '#cbd5e1'}` }}
                  placeholder="Город, улица, дом, квартира"
                />
                {errors.address && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.address}</span>}
              </div>

              {/* Payment Method */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                  Способ оплаты
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'CARD' })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `2px solid ${formData.paymentMethod === 'CARD' ? '#4f46e5' : '#e2e8f0'}`,
                      background: formData.paymentMethod === 'CARD' ? '#eef2ff' : '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  >
                    <CreditCard size={18} color="#4f46e5" />
                    <span>Карта онлайн</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'CASH' })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `2px solid ${formData.paymentMethod === 'CASH' ? '#4f46e5' : '#e2e8f0'}`,
                      background: formData.paymentMethod === 'CASH' ? '#eef2ff' : '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  >
                    <Banknote size={18} color="#10b981" />
                    <span>При получении</span>
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleClose} className="btn-secondary" disabled={isLoading}>
                  Отмена
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isBuggyMode ? false : isLoading}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  <span>{isLoading ? 'Обработка платежа...' : 'Подтвердить и оплатить'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
