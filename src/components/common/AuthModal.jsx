import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRoles } from '../../services/authService';
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export function AuthModal() {
  const {
    authModalOpen,
    authInitialTab,
    closeLoginModal,
    login,
    register,
    switchDemoUser
  } = useAuth();

  const [activeTab, setActiveTab] = useState(authInitialTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(UserRoles.CUSTOMER);
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, phone, role });
      }
    } catch {
      // Error handled by AuthContext notification
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (roleType) => {
    if (roleType === UserRoles.ADMINISTRATOR) {
      setEmail('admin@cineloom.com');
      setPassword('adminpassword');
    } else {
      setEmail('customer@cineloom.com');
      setPassword('password123');
    }
    setActiveTab('login');
  };

  return (
    <div className="modal-backdrop" onClick={closeLoginModal}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3>{activeTab === 'login' ? 'Sign In to Cineloom' : 'Create Account'}</h3>
          <button className="modal-close-btn" onClick={closeLoginModal}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick Demo Access Bar */}
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--accent-gold)', marginBottom: '8px' }}>
              <Sparkles size={14} /> Quick Demo Profiles:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '11.5px' }}
                onClick={() => handleDemoFill(UserRoles.CUSTOMER)}
              >
                Fill Customer
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '11.5px' }}
                onClick={() => handleDemoFill(UserRoles.ADMINISTRATOR)}
              >
                Fill Admin
              </button>
            </div>
          </div>

          <div className="status-tabs" style={{ marginBottom: '20px' }}>
            <button
              type="button"
              className={`status-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              style={{ flex: 1 }}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`status-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              style={{ flex: 1 }}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeTab === 'register' && (
              <>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Alex Mercer"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                    <User size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="+1 555 019 2834"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                    <Phone size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Account Role</label>
                  <select
                    className="input-field"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  >
                    <option value={UserRoles.CUSTOMER}>Customer</option>
                    <option value={UserRoles.ADMINISTRATOR}>Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="input-field"
                  placeholder="name@cineloom.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Mail size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <Lock size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
