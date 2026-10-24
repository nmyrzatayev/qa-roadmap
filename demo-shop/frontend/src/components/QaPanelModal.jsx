import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, RotateCcw, Clock, Zap, CheckCircle2, AlertOctagon } from 'lucide-react';
import { api } from '../api';

export default function QaPanelModal({ isOpen, onClose, onDbReset }) {
  const [delayMs, setDelayMs] = useState(0);
  const [forceStatus, setForceStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    try {
      const data = await api.getQaStatus();
      setDelayMs(data.settings.artificialDelayMs || 0);
      setForceStatus(data.settings.forceErrorStatus || null);
      setStats(data.stats);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const handleApplyChaos = async () => {
    setIsLoading(true);
    setStatusMessage('');
    try {
      await api.setChaos(delayMs, forceStatus);
      setStatusMessage('Настройки симуляции хаоса успешно применены');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Сбросить базу данных? Все созданные заказы и измененные остатки вернутся к начальным значениям.')) {
      return;
    }

    setIsLoading(true);
    try {
      await api.resetDatabase();
      setStatusMessage('База данных успешно сброшена');
      await loadStatus();
      onDbReset();
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header" style={{ background: '#fef3c7', borderBottomColor: '#fde68a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e' }}>
            <ShieldAlert size={22} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              🧪 QA Chaos & Testing Control Panel
            </h2>
          </div>
          <button onClick={onClose} style={{ color: '#92400e' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Специальный тренажер для тестировщиков: эмулируйте медленную сеть, серверные 500-е ошибки и проверяйте, как клиент обрабатывает внештатные ситуации.
          </p>

          {statusMessage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Artificial Latency */}
          <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '8px' }}>
              <Clock size={16} color="#4f46e5" />
              <span>Искусственная задержка сети (Slow 3G / High Latency)</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              {[
                { label: '0 мс (Быстро)', value: 0 },
                { label: '1 200 мс (3G)', value: 1200 },
                { label: '2 500 мс (Slow)', value: 2500 }
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDelayMs(opt.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: `2px solid ${delayMs === opt.value ? '#4f46e5' : '#e2e8f0'}`,
                    background: delayMs === opt.value ? '#eef2ff' : '#ffffff'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Forced Server Error */}
          <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '8px' }}>
              <AlertOctagon size={16} color="#ef4444" />
              <span>Принудительный сбой бэкенда (Chaos Testing)</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              {[
                { label: 'Штатный режим', value: null },
                { label: '500 Server Error', value: 500 },
                { label: '503 Unavailable', value: 503 }
              ].map(opt => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setForceStatus(opt.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: `2px solid ${forceStatus === opt.value ? '#ef4444' : '#e2e8f0'}`,
                    background: forceStatus === opt.value ? '#fef2f2' : '#ffffff',
                    color: forceStatus === opt.value ? '#b91c1c' : '#0f172a'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleApplyChaos} 
            className="btn-primary" 
            disabled={isLoading}
            style={{ width: '100%', background: '#1e1b4b' }}
          >
            Применить настройки симуляции
          </button>

          {/* Database Reset and Stats */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Тестовые данные:</span>
              <button 
                onClick={handleResetDb} 
                disabled={isLoading}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  color: '#b91c1c', 
                  fontSize: '0.85rem', 
                  fontWeight: 600,
                  background: '#fef2f2',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #fecaca'
                }}
              >
                <RotateCcw size={14} />
                <span>Сбросить БД к началу</span>
              </button>
            </div>

            {stats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
                <div style={{ background: '#f8fafc', padding: '10px 4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{stats.productsCount}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Товаров</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{stats.ordersCount}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Заказов</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{stats.cartItemsCount}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>В корзине</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{stats.usersCount}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Юзеров</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
