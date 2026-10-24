import React, { useState } from 'react';
import { X, User, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('tester@qa.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Заполните email и пароль');
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.login(email, password);
      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMockCredentials = () => {
    setEmail('tester@qa.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="#4f46e5" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Вход в профиль</h2>
          </div>
          <button onClick={onClose} style={{ color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Пароль
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                placeholder="••••••••"
              />
            </div>

            {/* QA Hint */}
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
              <div style={{ color: '#64748b', marginBottom: '4px' }}>Тестовые учетные данные:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <code>tester@qa.com / password123</code>
                <button 
                  type="button" 
                  onClick={handleUseMockCredentials}
                  style={{ color: '#4f46e5', fontWeight: 600 }}
                >
                  Вставить
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
              style={{ marginTop: '8px' }}
            >
              {isLoading ? 'Проверка...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
