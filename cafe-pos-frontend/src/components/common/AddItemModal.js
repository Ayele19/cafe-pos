import React, { useState } from "react";
import "./AddItemModal.css";

function AddItemModal({ isOpen, closeModal, refreshMenu }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Food");

  const addItem = () => {
    if (!name || !price) return alert("Fill name and price!");

    fetch("http://localhost:8080/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: parseFloat(price), category })
    })
      .then(res => res.json())
      .then(() => {
        alert("Item added!");
        setName(""); setPrice(""); setCategory("Food");
        refreshMenu();
        closeModal();
      })
      .catch(err => alert("Failed to add item: " + err));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add New Item</h2>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Drink">Drink</option>
        </select>
        <button onClick={addItem}>Add</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}

export default AddItemModal;
