import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/fertilizer/Sidebar';
import { FiBell, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import AuthService from '../services/auth.service';

const ProviderLayout: React.FC = () => {
  const [userName] = useState<string>('Guest User');
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const activeItem = location.pathname.split('/').pop() || 'dashboard';

  const handleSidebarClick = (item: string) => {
    navigate(`/provider/${item}`);
  };

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
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#f5f7fa',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen'",
      }}
    >
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} setActiveItem={handleSidebarClick} />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {/* Navbar */}
        <div
          style={{
            background: 'linear-gradient(to right, #f8f9fb 0%, #f0f3f7 100%)',
            padding: '1.5rem 2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#1a2332',
            }}
          >
            Welcome, {userName}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <FiBell size={22} style={{ cursor: 'pointer', color: '#7f8c8d' }} />

            {/* ✅ Profile Avatar with Dropdown */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              {/* Avatar Button */}
              <div
                onClick={() => setOpenProfile(!openProfile)}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: '#2E7D32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(46,125,50,0.3)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <FiUser size={22} color="#fff" />
              </div>

              {/* ✅ Dropdown Menu */}
              {openProfile && (
                <div
                  style={{
                    position: 'absolute',
                    top: '56px',
                    right: '0',
                    width: '180px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    padding: '0.5rem',
                    zIndex: 999,
                  }}
                >
                  {/* Settings */}
                  <button
                    onClick={() => {
                      navigate('/provider/settings');
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
                      color: '#1a2332',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = '#f0f3f7')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'transparent')
                    }
                  >
                    <FiSettings size={16} />
                    Settings
                  </button>

                  {/* Divider */}
                  <div
                    style={{
                      height: '1px',
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      margin: '0.3rem 0',
                    }}
                  />

                  {/* Logout */}
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
                      color: '#e53935',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = '#fff5f5')
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
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: '2.5rem',
            overflowY: 'auto',
            background: 'linear-gradient(to bottom, #f8f9fb 0%, #f0f3f7 100%)',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProviderLayout;