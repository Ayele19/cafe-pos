import React, { useState } from "react";

function OrderForm() {
  const [items, setItems] = useState([{ itemName: "", quantity: 1, price: 0 }]);
  const [buyerId, setBuyerId] = useState(""); // choose buyer
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Add new item row
  const addItem = () => {
    setItems([...items, { itemName: "", quantity: 1, price: 0 }]);
  };

  // Submit order
  const handleSubmit = (e) => {
    e.preventDefault();

    const order = {
      orderItems: items,   // ✅ match backend
    };

    fetch(`http://localhost:8080/api/buyers/${buyerId}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage("✅ Order saved with ID: " + data.id);
        setItems([{ itemName: "", quantity: 1, price: 0 }]); // reset form
      })
      .catch((err) => setMessage("❌ Error saving order: " + err));
  };

  return (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-3">📝 Place New Order</h2>
      <form onSubmit={handleSubmit}>
        {/* Buyer selection */}
        <input
          type="number"
          placeholder="Buyer ID"
          value={buyerId}
          onChange={(e) => setBuyerId(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />

        {items.map((item, index) => (
          <div key={index} className="mb-3 flex gap-2">
            <input
              type="text"
              placeholder="Item name"
              value={item.itemName}
              onChange={(e) => handleChange(index, "itemName", e.target.value)}
              className="border p-2 rounded w-1/3"
              required
            />
            <input
              type="number"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) =>
                handleChange(index, "quantity", Number(e.target.value))
              }
              className="border p-2 rounded w-1/4"
              min="1"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) =>
                handleChange(index, "price", Number(e.target.value))
              }
              className="border p-2 rounded w-1/4"
              min="0"
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          ➕ Add Item
        </button>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 ml-2 rounded"
        >
          💾 Save Order
        </button>
      </form>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default OrderForm;
