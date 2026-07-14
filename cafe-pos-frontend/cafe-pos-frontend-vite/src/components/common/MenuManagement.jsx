import React, { useState, useEffect } from 'react';
import { menuService } from '../../services/api';
import './MenuManagement.css';

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [message, setMessage] = useState(null);
  const [formItem, setFormItem] = useState({
    id: null,
    name: '',
    price: '',
    category: '',
    unit: 'PCS',
    imageFile: null,
    imageUrl: ''
  });
  const [hoveredRow, setHoveredRow] = useState(null);

  // Load menu items
  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await menuService.getMenuItems();
        // prepend backend URL for images
        const itemsWithFullUrl = res.data.map(item => ({
          ...item,
          imageUrl: item.imageUrl ? `http://localhost:8080${item.imageUrl}?t=${new Date().getTime()}` : ''
        }));
        setMenuItems(itemsWithFullUrl);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load menu items');
      }
    };
    loadItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormItem(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormItem(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: URL.createObjectURL(file) // preview immediately
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!formItem.name || !formItem.category || !formItem.price) {
        setMessage('Please fill all fields');
        setTimeout(() => setMessage(null), 2000);
        return;
      }

      let savedItem;

      if (formItem.id) {
        // Update existing
        const res = await menuService.updateMenuItem(formItem.id, {
          name: formItem.name,
          price: parseFloat(formItem.price),
          category: formItem.category,
          unit: formItem.unit
        });
        savedItem = res.data;

        if (formItem.imageFile) {
          const formData = new FormData();
          formData.append('file', formItem.imageFile);
          const imgRes = await menuService.uploadMenuItemImage(savedItem.id, formData);
          savedItem.imageUrl = imgRes.data; // backend returns full URL
        } else if (savedItem.imageUrl) {
          savedItem.imageUrl = `http://localhost:8080${savedItem.imageUrl}?t=${new Date().getTime()}`;
        }

        setMenuItems(menuItems.map(item => item.id === savedItem.id ? savedItem : item));
        setMessage('Menu item updated successfully');
      } else {
        // Add new
        const res = await menuService.addMenuItem({
          name: formItem.name,
          price: parseFloat(formItem.price),
          category: formItem.category,
          unit: formItem.unit
        });
        savedItem = res.data;

        if (formItem.imageFile) {
          const formData = new FormData();
          formData.append('file', formItem.imageFile);
          const imgRes = await menuService.uploadMenuItemImage(savedItem.id, formData);
          savedItem.imageUrl = imgRes; // backend returns full URL
        }

        setMenuItems([...menuItems, savedItem]);
        setMessage('Menu item added successfully');
      }

      // Reset form
      setFormItem({ id: null, name: '', price: '', category: '', unit: 'PCS', imageFile: null, imageUrl: '' });
      setTimeout(() => setMessage(null), 2000);

    } catch (err) {
      console.error(err);
      setMessage('Error saving menu item');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleRowClick = (item) => {
    setFormItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      unit: item.unit,
      imageFile: null,
      imageUrl: item.imageUrl
    });
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
      setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <div className="menu-management">
      {message && <div className="toast">{message}</div>}

      {/* Add/Edit Form */}
      <form onSubmit={handleSave} className="menu-form">
        <input type="text" name="name" placeholder="Item Name" value={formItem.name} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="Price (Birr)" value={formItem.price} onChange={handleInputChange} required min="0" />
        <input type="text" name="category" placeholder="Category" value={formItem.category} onChange={handleInputChange} required />
        <input type="text" name="unit" placeholder="Unit" value={formItem.unit} onChange={handleInputChange} required />
        <input type="file" onChange={handleFileChange} />
        {formItem.imageUrl && (
          <img src={formItem.imageUrl} alt="preview" className="image-preview" style={{ width: '100px', marginTop: '10px' }} />
        )}
        <button type="submit">{formItem.id ? 'Update' : 'Add'}</button>
      </form>

      {/* Menu Items Table */}
      <div className="table-container">
        <table className="menu-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => handleRowClick(item)}
                onMouseEnter={() => setHoveredRow(item.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: hoveredRow === item.id ? '#f0f8ff' : index % 2 === 0 ? '#fafafa' : '#ffffff'
                }}
              >
                <td>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="table-image" style={{ width: '50px' }} />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.price.toFixed(2)}</td>
                <td>{item.category}</td>
                <td>{item.unit}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuManagement;
