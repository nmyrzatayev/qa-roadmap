import React, { useState, useEffect } from 'react';
import { X, Package, Clock, Truck, CheckCircle, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { api } from '../api';

const STATUS_CONFIG = {
  PAID: { label: 'Оплачен', color: '#0284c7', bg: '#e0f2fe' },
  PROCESSING: { label: 'В сборке', color: '#d97706', bg: '#fef3c7' },
  SHIPPED: { label: 'В пути', color: '#7c3aed', bg: '#ede9fe' },
  DELIVERED: { label: 'Доставлен', color: '#16a34a', bg: '#dcfce7' },
  CANCELLED: { label: 'Отменен', color: '#dc2626', bg: '#fee2e2' }
};

export default function OrdersModal({ isOpen, onClose, showToast }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      if (showToast) showToast(err.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      if (showToast) showToast(`Статус заказа ${orderId} изменен на ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      await fetchOrders();
    } catch (err) {
      if (showToast) showToast(err.message, true);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={22} color="#4f46e5" />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Журнал заказов (State Machine)</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Полигон для тестирования переходов состояний жизненного цикла заказов
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={fetchOrders} 
              className="btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              title="Обновить список"
              disabled={isLoading}
            >
              <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
              <span>Обновить</span>
            </button>
            <button onClick={onClose} style={{ color: '#64748b' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <h3>Заказов пока нет</h3>
              <p style={{ fontSize: '0.9rem' }}>Оформите первый заказ в магазине, чтобы увидеть его здесь</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => {
                const statusInfo = STATUS_CONFIG[order.status] || { label: order.status, color: '#334155', bg: '#f1f5f9' };
                const isUpdating = updatingId === order.id;

                return (
                  <div 
                    key={order.id} 
                    style={{ 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px', 
                      padding: '16px',
                      background: '#ffffff'
                    }}
                  >
                    {/* Header info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{order.id}</span>
                          <span 
                            style={{ 
                              background: statusInfo.bg, 
                              color: statusInfo.color, 
                              padding: '2px 8px', 
                              borderRadius: '20px', 
                              fontSize: '0.75rem', 
                              fontWeight: 700 
                            }}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                          {new Date(order.createdAt).toLocaleString('ru-RU')}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#4f46e5' }}>
                          {order.total?.toLocaleString('ru-RU')} ₽
                        </div>
                        {order.discount > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>
                            Скидка: -{order.discount?.toLocaleString('ru-RU')} ₽
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer & address */}
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '12px', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                      <div><b>Покупатель:</b> {order.customerName} ({order.customerEmail}, {order.customerPhone})</div>
                      <div><b>Адрес:</b> {order.customerAddress}</div>
                    </div>

                    {/* Items */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Состав заказа:</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {(order.itemsJson || []).map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span>• {item.title} <span style={{ color: '#94a3b8' }}>× {item.quantity}</span></span>
                            <span style={{ fontWeight: 600 }}>{item.total?.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* State transition buttons for QA */}
                    <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '10px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Тестирование перехода статуса (State Transition):
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {order.status !== 'PROCESSING' && (
                          <button 
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(order.id, 'PROCESSING')}
                            style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #fde68a', background: '#fef3c7', color: '#b45309', cursor: 'pointer', fontWeight: 600 }}
                          >
                            ➡️ В сборку
                          </button>
                        )}
                        {order.status !== 'SHIPPED' && (
                          <button 
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(order.id, 'SHIPPED')}
                            style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #ddd6fe', background: '#ede9fe', color: '#6d28d9', cursor: 'pointer', fontWeight: 600 }}
                          >
                            🚚 Отправить (В пути)
                          </button>
                        )}
                        {order.status !== 'DELIVERED' && (
                          <button 
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                            style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #bbf7d0', background: '#dcfce7', color: '#15803d', cursor: 'pointer', fontWeight: 600 }}
                          >
                            ✅ Доставить
                          </button>
                        )}
                        {order.status !== 'CANCELLED' && (
                          <button 
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                            style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #fecaca', background: '#fee2e2', color: '#b91c1c', cursor: 'pointer', fontWeight: 600 }}
                          >
                            ❌ Отменить
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
