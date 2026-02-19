import React from 'react';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiBarChart,
  FiSettings,
} from 'react-icons/fi';

type SidebarProps = {
  activeItem: string;
  setActiveItem: (item: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'products', label: 'Product Management', icon: FiPackage },
    { id: 'orders', label: 'Order History', icon: FiShoppingCart },
    { id: 'analytics', label: 'Revenue Analytics', icon: FiBarChart },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div
      style={{
        width: '250px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1a2332 0%, #0f1419 100%)',
        color: '#ffffff',
        padding: '2rem 1rem',
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
      }}
    >
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
                  color: isActive
                    ? '#ffffff'
                    : 'rgba(255,255,255,0.8)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background =
                      'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color =
                      'rgba(255,255,255,0.8)';
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
  );
};

export default Sidebar;