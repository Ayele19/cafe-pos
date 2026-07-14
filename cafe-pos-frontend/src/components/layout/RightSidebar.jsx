import React from 'react';

const RightSidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'menu', label: 'POS', icon: '🛒' },
    { id: 'savedOrders', label: 'Saved Orders', icon: '📋' },
    { id: 'manageMenu', label: 'Manage Menu', icon: '🍽️' }
  ];

  return (
    <div style={{
      width: '200px',
      backgroundColor: '#f8f9fa',
      padding: '20px 10px',
      borderRight: '1px solid #dee2e6',
      minHeight: '100vh'
    }}>
      {menuItems.map(item => (
        <div
          key={item.id}
          onClick={() => setActiveSection(item.id)}
          style={{
            padding: '12px 16px',
            margin: '8px 0',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: activeSection === item.id ? '#7367f0' : 'transparent',
            color: activeSection === item.id ? 'white' : '#333',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default RightSidebar;