import React from "react";

const RightSidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'menu', label: 'Sales', icon: '🛒' },
    { id: 'savedOrders', label: 'Saved Orders', icon: '📋' },
    { id: 'manageMenu', label: 'Products', icon: '🍽️' },
    { id: 'manageCustomers', label: 'Customers', icon: '👤' }
  ];

  return (
    <div style={{
      width: '220px',
      backgroundColor: '#1b637591',
      padding: '20px 10px',
      height: '100vh',
      overflow: 'hidden',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* POS Name */}
      <div style={{
        textAlign: 'center',
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '20px',
        letterSpacing: '1px'
      }}>
        CafePOS
      </div>

      {menuItems.map(item => (
        <div
          key={item.id}
          onClick={() => setActiveSection(item.id)}
          style={{
            padding: '12px 16px',
            margin: '8px 0',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: activeSection === item.id ? '#1fdf85ff' : 'transparent',
            color: activeSection === item.id ? 'white' : '#ffffffff',
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
