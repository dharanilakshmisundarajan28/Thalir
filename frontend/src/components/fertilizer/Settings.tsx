import React from 'react';

const Settings: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f5f7fa' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a2332', margin: 0 }}>
          Settings
        </h1>
      </div>

      {/* Content */}
      <div style={{ display: 'grid', gap: '2.5rem' }}>
        {/* General Settings */}
        <div
          style={{
            background: '#ffffff',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            General Settings
          </h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {[
              { label: 'Business Name', type: 'text', value: 'THALIR' },
              { label: 'Business Email', type: 'email', value: 'info@thalir.com' },
            ].map((item) => (
              <div key={item.label}>
                <h3 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>
                  {item.label}
                </h3>
                <input
                  type={item.type}
                  defaultValue={item.value}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}

            <div>
              <h3 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Currency</h3>
              <select
                defaultValue="INR"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>
                Low Stock Threshold
              </h3>
              <input
                type="number"
                defaultValue={50}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
              <small style={{ color: '#7f8c8d' }}>
                Products below this quantity will be marked as low stock
              </small>
            </div>
          </div>

          <button
            style={{
              marginTop: '2rem',
              padding: '0.75rem 2rem',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Save Settings
          </button>
        </div>

        {/* Account Settings */}
        <div
          style={{
            background: '#ffffff',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Account Settings
          </h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Full Name</h3>
              <input
                type="text"
                defaultValue="Admin User"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>
                Change Password
              </h3>
              {['Current Password', 'New Password', 'Confirm New Password'].map(
                (placeholder) => (
                  <input
                    key={placeholder}
                    type="password"
                    placeholder={placeholder}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      marginBottom: '0.75rem',
                      boxSizing: 'border-box',
                    }}
                  />
                )
              )}
            </div>
          </div>

          <button
            style={{
              marginTop: '2rem',
              padding: '0.75rem 2rem',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Update Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;