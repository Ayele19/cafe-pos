import React, { useEffect, useState } from 'react';
import { menuService } from '../../../services/api';
import './MenuSection.css';

const MenuSection = ({ menuItems, setMenuItems, selectedItems, setSelectedItems }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  useEffect(() => {
    if (!menuItems || menuItems.length === 0) {
      menuService.getMenuItems()
        .then(res => { setMenuItems(res.data); setLoading(false); })
        .catch(err => { console.error('Menu load error:', err); setMessage('Failed to load menu items'); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [menuItems, setMenuItems]);

  const addToOrder = (item) => {
    const existing = selectedItems.find(i => i.id === item.id);
    if (existing) {
      setSelectedItems(selectedItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
    setMessage(`${item.name} added to order`);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleDelete = async (id) => {
    try {
      await menuService.deleteMenuItem(id);
      setMenuItems(menuItems.filter(item => item.id !== id));
      setMessage('Menu item deleted');
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      console.error(err);
      setMessage('Error deleting menu item');
    }
  };

  // Filtered items by category
  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) return <p>Loading menu items...</p>;
  if (!menuItems || menuItems.length === 0) return <p>No menu items available.</p>;

  return (
    <div className="menu-section scrollable">
      {message && <div className="toast">{message}</div>}

      <h2>Menu Items</h2>

      {/* Category Dropdown */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="categoryFilter" style={{ marginRight: '10px' }}>Filter by Category:</label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '5px 10px', borderRadius: '4px' }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Menu Grid */}
      <div className="menu-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="menu-card">
            <h4>{item.name}</h4>
            <p>Price: {item.price.toFixed(2)} Birr</p>
            <p>Category: {item.category}</p>
            <button onClick={() => addToOrder(item)}>Add to Order</button>
            <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '5px' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSection;