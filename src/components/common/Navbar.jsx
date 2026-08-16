import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { INITIAL_CITIES } from '../../data/seedData';
import {
  Film,
  MapPin,
  Search,
  Tag,
  Ticket,
  ShieldAlert,
  CheckCircle,
  LogOut,
  ChevronDown,
  User,
  SlidersHorizontal
} from 'lucide-react';

export function Navbar({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery
}) {
  const {
    currentUser,
    isAdmin,
    selectedCity,
    changeCity,
    logout,
    openLoginModal,
    switchDemoUser
  } = useAuth();

  const { openHistory } = useBooking();
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div
          className="brand-logo"
          onClick={() => setActiveView('movies')}
        >
          <div className="brand-icon">
            <Film size={20} />
          </div>
          <div className="brand-text">
            Cine<span>loom</span>
          </div>
        </div>

        {/* City Location Selector */}
        <div style={{ position: 'relative' }}>
          <button
            className="city-selector"
            onClick={() => setCityMenuOpen(!cityMenuOpen)}
          >
            <MapPin size={14} color="var(--accent-primary)" />
            <span>{selectedCity}</span>
            <ChevronDown size={13} />
          </button>

          {cityMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '6px',
                minWidth: '150px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 600
              }}
              onMouseLeave={() => setCityMenuOpen(false)}
            >
              {INITIAL_CITIES.map(city => (
                <div
                  key={city}
                  onClick={() => {
                    changeCity(city);
                    setCityMenuOpen(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    fontWeight: city === selectedCity ? '700' : '500',
                    color: city === selectedCity ? 'var(--accent-primary)' : 'var(--text-primary)',
                    background: city === selectedCity ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Movie Search Bar */}
        <div className="nav-search">
          <Search size={16} className="nav-search-icon" />
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search movies, cast, directors..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              if (activeView !== 'movies') setActiveView('movies');
            }}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="nav-actions">
          <button
            className={`nav-link-btn ${activeView === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveView('movies')}
          >
            <Film size={15} /> Movies
          </button>

          <button
            className={`nav-link-btn ${activeView === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveView('offers')}
          >
            <Tag size={15} /> Offers
          </button>

          <button
            className="nav-link-btn"
            onClick={() => {
              if (currentUser) {
                openHistory();
              } else {
                openLoginModal('login');
              }
            }}
          >
            <Ticket size={15} /> My Bookings
          </button>

          <button
            className={`nav-link-btn ${activeView === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveView('admin')}
            style={{ color: isAdmin ? 'var(--accent-gold)' : undefined }}
          >
            <ShieldAlert size={15} /> Admin Portal
          </button>

          <button
            className={`nav-link-btn ${activeView === 'unit-tests' ? 'active' : ''}`}
            onClick={() => setActiveView('unit-tests')}
            style={{ color: 'var(--accent-teal)' }}
          >
            <CheckCircle size={15} /> Unit Tests
          </button>

          {/* User Account / Profile */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <div
                className="user-profile-menu"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="user-avatar">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown size={13} />
              </div>

              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    minWidth: '220px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-light)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{currentUser.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                    <span className="badge badge-cert" style={{ marginTop: '4px' }}>
                      {currentUser.role}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '4px 10px', fontWeight: 700 }}>
                    Switch Demo Role:
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', fontSize: '12px' }}
                    onClick={() => {
                      switchDemoUser('CUSTOMER');
                      setUserMenuOpen(false);
                    }}
                  >
                    <User size={13} /> As Customer
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', fontSize: '12px' }}
                    onClick={() => {
                      switchDemoUser('ADMINISTRATOR');
                      setUserMenuOpen(false);
                    }}
                  >
                    <ShieldAlert size={13} color="var(--accent-gold)" /> As Administrator
                  </button>

                  <div style={{ height: '1px', background: 'var(--border-light)', margin: '4px 0' }} />

                  <button
                    className="btn btn-danger btn-sm"
                    style={{ justifyContent: 'flex-start', fontSize: '12px' }}
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => openLoginModal('login')}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
