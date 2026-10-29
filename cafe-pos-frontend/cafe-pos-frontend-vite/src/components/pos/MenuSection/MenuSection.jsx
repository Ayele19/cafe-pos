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
    <div className="menu-section">
      {message && <div className="toast">{message}</div>}

      {/* Filter by category — buttons side by side */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px", flexShrink: 0 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "5px 14px",
              borderRadius: "20px",
              border: `1.5px solid ${selectedCategory === cat ? "#1b6375" : "#d1d5db"}`,
              background: selectedCategory === cat ? "#1b6375" : "#fff",
              color: selectedCategory === cat ? "#fff" : "#374151",
              fontSize: "12px",
              fontWeight: selectedCategory === cat ? "700" : "400",
              cursor: "pointer",
              transition: "all 0.15s"
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      <div className="menu-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="menu-card" onClick={() => addToOrder(item)} style={{ cursor: "pointer" }}>
            <div className="menu-card-image">
              <img
                src={item.imageUrl ? `http://localhost:8080${item.imageUrl}?t=${new Date().getTime()}` : "/placeholder.png"}
                alt={item.name}
              />
            </div>
            <div className="menu-card-info">
              <h4>{item.name}</h4>
              <p>{item.price.toFixed(2)} ETB</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
