import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/fertilizer/Sidebar';
import { FiBell } from 'react-icons/fi';

const ProviderLayout: React.FC = () => {
  const [userName] = useState<string>('Guest User');
  const navigate = useNavigate();
  const location = useLocation();

  // Derive active sidebar item from URL
  const activeItem = location.pathname.split('/').pop() || 'dashboard';

  const handleSidebarClick = (item: string) => {
    navigate(`/provider/${item}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',        // ✅ fixed height instead of minHeight
        overflow: 'hidden',     // ✅ prevent outer scroll
        backgroundColor: '#f5f7fa',
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen'",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        activeItem={activeItem}
        setActiveItem={handleSidebarClick}
      />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,          // ✅ prevents flex overflow
          overflow: 'hidden',   // ✅ needed so inner div can scroll
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
            flexShrink: 0,      // ✅ navbar never shrinks
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
            <FiBell
              size={22}
              style={{ cursor: 'pointer', color: '#7f8c8d' }}
            />

            <div
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
              }}
            >
              GU
            </div>
          </div>
        </div>

        {/* Page Content — renders matched child route */}
        <div
          style={{
            flex: 1,
            minHeight: 0,       // ✅ KEY FIX: allows flex child to scroll
            padding: '2.5rem',
            overflowY: 'auto',  // ✅ this div actually scrolls
            background:
              'linear-gradient(to bottom, #f8f9fb 0%, #f0f3f7 100%)',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProviderLayout;