import React, { useState, useEffect } from 'react';
import { menuService } from '../../services/api';
import './MenuManagement.css';

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [message, setMessage] = useState(null);
  const [formItem, setFormItem] = useState({ id: null, name: '', price: '', category: '' });
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await menuService.getMenuItems();
      setMenuItems(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load menu items');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formItem.id) {
        // Update existing
        const res = await menuService.updateMenuItem(formItem.id, formItem);
        setMenuItems(menuItems.map(item => (item.id === res.data.id ? res.data : item)));
        setMessage('Menu item updated successfully');
      } else {
        // Add new
        const res = await menuService.addMenuItem(formItem);
        setMenuItems([...menuItems, res.data]);
        setMessage('Menu item added successfully');
      }
      setFormItem({ id: null, name: '', price: '', category: '' });
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      console.error(err);
      setMessage('Error saving menu item');
    }
  };

  const handleRowClick = (item) => {
    setFormItem({ id: item.id, name: item.name, price: item.price, category: item.category });
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

  return (
    <div className="menu-management">
      {message && <div className="toast">{message}</div>}

      {/* Add/Edit Form */}
      <form onSubmit={handleSave}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formItem.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (Birr)"
          value={formItem.price}
          onChange={handleInputChange}
          required
          min="0"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formItem.category}
          onChange={handleInputChange}
          required
        />
        <button type="submit">
          {formItem.id ? 'Update' : 'Add'}
        </button>
      </form>

      {/* Menu Items Table */}
      <table className="menu-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr
              key={item.id}
              onClick={() => handleRowClick(item)}
              onMouseEnter={() => setHoveredRow(item.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                cursor: 'pointer',
                backgroundColor: hoveredRow === item.id ? '#f0f8ff' : 'white',
              }}
            >
              <td>{item.name}</td>
              <td>{item.price.toFixed(2)}</td>
              <td>{item.category}</td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MenuManagement;