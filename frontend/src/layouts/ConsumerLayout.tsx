// PATH: src/layouts/ConsumerLayout.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
  FiPackage,
  FiSettings,
  FiLogOut,
  FiUser,
} from 'react-icons/fi';
import AuthService from '../services/auth.service';

const menuItems = [
  { id: 'home', label: 'Dashboard', icon: FiHome, path: '/consumer/home' },
  { id: 'products', label: 'Browse Produce', icon: FiShoppingBag, path: '/consumer/products' },
  { id: 'cart', label: 'My Cart', icon: FiShoppingCart, path: '/consumer/cart' },
  { id: 'orders', label: 'My Orders', icon: FiPackage, path: '/consumer/orders' },
  { id: 'settings', label: 'Settings', icon: FiSettings, path: '/consumer/settings' },
];

const ConsumerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const user = AuthService.getCurrentUser();

  // Outlet context state (consumed by ConsumerDashboard and other child pages)
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [openCart, setOpenCart] = useState(false);

  // Derive active item from current URL path
  const activeItem = menuItems.find(m => location.pathname.startsWith(m.path))?.id ?? 'home';

  const handleNavigate = (path: string) => navigate(path);

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: '250px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1a2332 0%, #0f1419 100%)',
        color: '#ffffff',
        padding: '2rem 1rem',
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          {/* Brand */}
          <div style={{
            fontSize: '1.4rem', fontWeight: 700,
            marginBottom: '2.5rem', paddingLeft: '1rem', letterSpacing: '1px',
          }}>
            THALIR
          </div>

          {/* Role badge */}
          <div style={{
            background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700,
            color: '#4ade80', marginBottom: '1.5rem', marginLeft: '1rem', display: 'inline-block',
          }}>
            CONSUMER
          </div>

          {/* Sidebar search bar */}
          <div style={{ margin: '0 0 1rem 0', padding: '0 0.5rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: '0.5rem 0.75rem',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                style={{
                  border: 'none', background: 'transparent', outline: 'none',
                  color: '#fff', fontSize: 13, width: '100%',
                }}
              />
            </div>
          </div>

          {/* Menu items */}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const isCart = item.id === 'cart';
              return (
                <li key={item.id} style={{ margin: '0.5rem 0' }}>
                  <div
                    onClick={() => handleNavigate(item.path)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: isActive ? '12px' : '6px',
                      cursor: 'pointer',
                      fontWeight: isActive ? 600 : 500,
                      backgroundColor: isActive ? '#2E7D32' : 'transparent',
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.color = '#ffffff';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </div>
                    {isCart && cartCount > 0 && (
                      <span style={{
                        background: '#ef4444', color: '#fff', borderRadius: '50%',
                        minWidth: 18, height: 18, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 10, fontWeight: 700, padding: '0 4px',
                      }}>{cartCount}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Profile section ── */}
        <div ref={profileRef} style={{ position: 'relative' }}>

          {/* Popup menu */}
          {openProfile && (
            <div style={{
              position: 'absolute', bottom: '70px', left: 0, right: 0,
              backgroundColor: '#1e2d3d', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '0.5rem',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
            }}>
              <button
                onClick={() => { handleNavigate('/consumer/settings'); setOpenProfile(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px',
                  border: 'none', backgroundColor: 'transparent',
                  color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem',
                  cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <FiSettings size={16} /> Settings
              </button>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px',
                  border: 'none', backgroundColor: 'transparent',
                  color: '#f87171', fontSize: '0.875rem',
                  cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          )}

          {/* Profile bar */}
          <div
            onClick={() => setOpenProfile(!openProfile)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem', borderRadius: '12px', cursor: 'pointer',
              backgroundColor: openProfile ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = openProfile ? 'rgba(255,255,255,0.08)' : 'transparent')}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              backgroundColor: '#2E7D32', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <FiUser size={18} color="#fff" />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{
                fontSize: '0.875rem', fontWeight: 600,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.username ?? 'Consumer'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                {user?.roles?.[0]?.replace('ROLE_', '') ?? 'Consumer'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content area ── */}
      <div style={{ flex: 1, overflow: 'auto', background: '#f3f4f6' }}>
        <Outlet context={{ search, setSearch, cartCount, setCartCount, openCart, setOpenCart }} />
      </div>

    </div>
  );
};

export default ConsumerLayout;