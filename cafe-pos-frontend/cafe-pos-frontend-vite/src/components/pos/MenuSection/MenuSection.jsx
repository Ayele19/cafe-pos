import React, { useState, useEffect } from "react";
import { menuService } from "../../../services/menuService"; // make sure this path is correct
import "./MenuSection.css";

const MenuSection = ({ menuItems, setMenuItems, selectedItems, setSelectedItems }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const res = await menuService.getMenuItems();
        if (Array.isArray(res.data)) setMenuItems(res.data);
      } catch (err) {
        console.error("Failed to load menu:", err);
        setMessage("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [setMenuItems]);

  // Categories
  const categories = ["All", ...new Set(menuItems.map(item => item.category))];

  // Add to order
  const addToOrder = (item) => {
    const existing = selectedItems.find(i => i.id === item.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
    setMessage(`${item.name} added to order`);
    setTimeout(() => setMessage(null), 2000);
  };

  // Delete menu item
 

  // Filtered items
  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter(item => item.category === selectedCategory);

  if (loading) return <p>Loading menu items...</p>;
  if (!menuItems || menuItems.length === 0) return <p>No menu items available.</p>;

  return (
    <div className="menu-section scrollable">
      {message && <div className="toast">{message}</div>}

      <h2>Menu Items</h2>

      {/* Filter by category */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="categoryFilter" style={{ marginRight: "10px" }}>
          Filter by Category:
        </label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: "5px 10px", borderRadius: "4px" }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Menu grid */}
      <div className="menu-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="menu-card">
            <div className="menu-card-image">
              <img
                src={item.imageUrl ? `http://localhost:8080${item.imageUrl}?t=${new Date().getTime()}` : "/placeholder.png"}
                alt={item.name}
              />
            </div>
            <div className="menu-card-info">
              <h4>{item.name}</h4>
              <p>Price: {item.price.toFixed(2)} Birr</p>
              <p>Category: {item.category}</p>
              <p>Unit: {item.unit}</p>
              <button onClick={() => addToOrder(item)}>Add to Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
