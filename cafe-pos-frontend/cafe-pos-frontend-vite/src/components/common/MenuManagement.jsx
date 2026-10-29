import React, { useState, useEffect } from 'react';
import { menuService, branchService } from '../../services/api';
import { Can } from '../../auth/Can';
import { PERMISSIONS } from '../../auth/permissions';
import { useAuth } from '../../auth/AuthContext';
import './MenuManagement.css';

const UNITS = [
  { name: "Pieces",   code: "PCS" },
  { name: "Liter",    code: "LTR" },
  { name: "KiloGram", code: "KLG" },
  { name: "Meter",    code: "MTR" },
  { name: "Roll",     code: "ROL" },
];

const EMPTY_FORM = {
  id: null, name: '', price: '', category: '', unit: 'PCS',
  imageFile: null, imageUrl: '',
  forAllBranches: true, selectedBranchIds: []
};

function MenuManagement() {
  const { hasPermission } = useAuth();
  const canWriteMenu = hasPermission(PERMISSIONS.MENU_WRITE);

  const [menuItems, setMenuItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formItem, setFormItem] = useState(EMPTY_FORM);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    loadItems();
    branchService.getAll()
      .then(r => setBranches([...new Map(r.data.map(b => [b.systemNumber, b])).values()]))
      .catch(console.error);
  }, []);

  const loadItems = async () => {
    try {
      const res = await menuService.getMenuItems();
      setMenuItems(res.data.map(item => ({
        ...item,
        imageUrl: item.imageUrl ? `http://localhost:8080${item.imageUrl}?t=${Date.now()}` : ''
      })));
    } catch (err) {
      showMsg('Failed to load menu items', 'error');
    }
  };

  const showMsg = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormItem(p => ({ ...p, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) setFormItem(p => ({ ...p, imageFile: file, imageUrl: URL.createObjectURL(file) }));
  };

  const toggleBranch = (id) => {
    setFormItem(p => ({
      ...p,
      selectedBranchIds: p.selectedBranchIds.includes(id)
        ? p.selectedBranchIds.filter(b => b !== id)
        : [...p.selectedBranchIds, id]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formItem.name || !formItem.category || !formItem.price) {
      showMsg('Please fill all required fields', 'error'); return;
    }

    const sourceSystemIds = formItem.forAllBranches ? [] : formItem.selectedBranchIds;

    try {
      let savedItem;
      const payload = {
        name: formItem.name,
        price: parseFloat(formItem.price),
        category: formItem.category,
        unit: formItem.unit,
        sourceSystemIds
      };

      if (formItem.id) {
        const res = await menuService.updateMenuItem(formItem.id, payload);
        savedItem = res.data;
        if (formItem.imageFile) {
          const fd = new FormData();
          fd.append('file', formItem.imageFile);
          await menuService.uploadMenuItemImage(savedItem.id, fd);
        }
        showMsg('Product updated');
      } else {
        const res = await menuService.addMenuItem(payload);
        savedItem = res.data;
        if (formItem.imageFile) {
          const fd = new FormData();
          fd.append('file', formItem.imageFile);
          await menuService.uploadMenuItemImage(savedItem.id, fd);
        }
        showMsg('Product added');
      }

      setFormItem(EMPTY_FORM);
      loadItems();
    } catch (err) {
      showMsg('Error saving product', 'error');
    }
  };

  const handleRowClick = (item) => {
    if (!canWriteMenu) return;
    const branchIds = (item.sourceSystems || []).map(s => s.id);
    setFormItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      unit: item.unit || 'PCS',
      imageFile: null,
      imageUrl: item.imageUrl,
      forAllBranches: branchIds.length === 0,
      selectedBranchIds: branchIds
    });
  };

  const handleDelete = async (id) => {
    try {
      await menuService.deleteMenuItem(id);
      setMenuItems(prev => prev.filter(i => i.id !== id));
      if (formItem.id === id) setFormItem(EMPTY_FORM);
      showMsg('Product deleted');
    } catch {
      showMsg('Error deleting product', 'error');
    }
  };

  const branchLabel = (item) => {
    const ss = item.sourceSystems || [];
    if (ss.length === 0) return <span style={{ fontSize: '11px', color: '#6b7280', background: '#f3f4f6', borderRadius: '10px', padding: '2px 8px' }}>All branches</span>;
    return ss.map(s => (
      <span key={s.id} style={{ fontSize: '11px', color: '#1b6375', background: '#e0f2fe', borderRadius: '10px', padding: '2px 8px', marginRight: '4px' }}>
        {s.branchName || s.systemNumber}
      </span>
    ));
  };

  return (
    <div className="menu-management">
      {message && (
        <div className="toast" style={{ background: messageType === 'error' ? '#fef2f2' : '#f0fdf4', color: messageType === 'error' ? '#dc2626' : '#16a34a', border: `1px solid ${messageType === 'error' ? '#fca5a5' : '#86efac'}` }}>
          {message}
        </div>
      )}

      <Can permission={PERMISSIONS.MENU_WRITE}>
        <form onSubmit={handleSave} className="menu-form">
          <input type="text" name="name" placeholder="Product Name *" value={formItem.name} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price (Birr) *" value={formItem.price} onChange={handleChange} required min="0" step="0.01" />
          <input type="text" name="category" placeholder="Category *" value={formItem.category} onChange={handleChange} required />
          <select name="unit" value={formItem.unit} onChange={handleChange} required>
            {UNITS.map(u => <option key={u.code} value={u.code}>{u.name} ({u.code})</option>)}
          </select>

          {/* Branch Assignment */}
          <div style={{ gridColumn: '1 / -1', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Branch Assignment
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', marginBottom: '8px' }}>
              <input
                type="checkbox"
                checked={formItem.forAllBranches}
                onChange={e => setFormItem(p => ({ ...p, forAllBranches: e.target.checked, selectedBranchIds: [] }))}
              />
              <span style={{ fontWeight: '600', color: '#1b6375' }}>Available to all branches</span>
            </label>

            {!formItem.forAllBranches && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {branches.length === 0 && <span style={{ fontSize: '12px', color: '#9ca3af' }}>No branches found. Add branches first.</span>}
                {branches.map(b => {
                  const selected = formItem.selectedBranchIds.includes(b.id);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => toggleBranch(b.id)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        border: `2px solid ${selected ? '#1b6375' : '#d1d5db'}`,
                        background: selected ? '#1b6375' : '#fff',
                        color: selected ? '#fff' : '#374151',
                        fontSize: '12px',
                        fontWeight: selected ? '600' : '400',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}>
                      {selected ? '✓ ' : ''}{b.branchName || b.systemNumber}
                      {b.seller ? ` · ${b.seller.legalName}` : ''}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <input type="file" accept="image/*" onChange={handleFileChange} />
          {formItem.imageUrl && (
            <img src={formItem.imageUrl} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '4px' }} />
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={{ flex: 2 }}>{formItem.id ? 'Update Product' : 'Add Product'}</button>
            {formItem.id && (
              <button type="button" onClick={() => setFormItem(EMPTY_FORM)} style={{ flex: 1, background: '#f3f4f6', color: '#374151' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </Can>

      {/* Table */}
      <div className="table-container">
        <table className="menu-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Unit</th>
              <th>Branches</th>
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
                  cursor: canWriteMenu ? 'pointer' : 'default',
                  backgroundColor: formItem.id === item.id ? '#eff6ff' : hoveredRow === item.id ? '#f0f8ff' : index % 2 === 0 ? '#fafafa' : '#fff'
                }}
              >
                <td>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} />
                    : <div style={{ width: '44px', height: '44px', background: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🍽️</div>
                  }
                </td>
                <td style={{ fontWeight: '500' }}>{item.name}</td>
                <td>{item.price.toFixed(2)} ETB</td>
                <td>{item.category}</td>
                <td>{item.unit}</td>
                <td>{branchLabel(item)}</td>
                <td>
                  <Can permission={PERMISSIONS.MENU_WRITE}>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                      style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </Can>
                </td>
              </tr>
            ))}
            {menuItems.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>No products yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuManagement;
