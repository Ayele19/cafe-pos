import React from 'react';

const Header = ({ activeTab, setActiveTab }) => {
  return (
    <header style={{
      backgroundColor: '#fff',
      padding: '16px 20px',
      borderBottom: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ margin: 0, color: '#333', fontSize: '24px' }}>Point Of Sale</h1>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ color: '#666' }}>Welcome, User</span>
      </div>
    </header>
  );
};

export default Header;