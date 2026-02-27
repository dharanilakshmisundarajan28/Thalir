import React, { useState, useEffect, useRef } from 'react';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiBarChart,
  FiSettings,
  FiLogOut,
  FiUser,
} from 'react-icons/fi';
import AuthService from '../services/auth.service';

type SidebarProps = {
  activeItem: string;
  setActiveItem: (item: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeItem, setActiveItem }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'products', label: 'Product Management', icon: FiPackage },
    { id: 'orders', label: 'Order History', icon: FiShoppingCart },
    { id: 'analytics', label: 'Revenue Analytics', icon: FiBarChart },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/';
  };

  // Close dropdown when clicking outside
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
    <div
      style={{
        width: '250px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1a2332 0%, #0f1419 100%)',
        color: '#ffffff',
        padding: '2rem 1rem',
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {/* Title */}
        <div
          style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            marginBottom: '2.5rem',
            paddingLeft: '1rem',
            letterSpacing: '1px',
          }}
        >
          THALIR
        </div>

        {/* Menu */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <li key={item.id} style={{ margin: '0.5rem 0' }}>
                <div
                  onClick={() => setActiveItem(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: isActive ? '12px' : '6px',
                    cursor: 'pointer',
                    fontWeight: isActive ? 600 : 500,
                    backgroundColor: isActive ? '#2E7D32' : 'transparent',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                    }
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ✅ PROFILE SECTION AT BOTTOM */}
      <div ref={profileRef} style={{ position: 'relative' }}>

        {/* Popup — renders ABOVE the profile bar */}
        {openProfile && (
          <div
            style={{
              position: 'absolute',
              bottom: '70px',
              left: '0',
              right: '0',
              backgroundColor: '#1e2d3d',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '0.5rem',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <button
              onClick={() => {
                setActiveItem('settings');
                setOpenProfile(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <FiSettings size={16} />
              Settings
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#f87171',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(248,113,113,0.1)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        )}

        {/* Profile Bar — click to toggle popup */}
        <div
          onClick={() => setOpenProfile(!openProfile)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            cursor: 'pointer',
            backgroundColor: openProfile
              ? 'rgba(255,255,255,0.08)'
              : 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = openProfile
              ? 'rgba(255,255,255,0.08)'
              : 'transparent')
          }
        >
          {/* Avatar circle */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#2E7D32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FiUser size={18} color="#fff" />
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.username ?? 'Admin'}
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {user?.roles?.[0]?.replace('ROLE_', '') ?? 'User'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;