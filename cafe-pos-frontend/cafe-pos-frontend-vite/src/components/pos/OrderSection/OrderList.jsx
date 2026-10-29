import React from "react";
import "../../../style/OrderList.css";

function OrderList({ selectedItems, adjustQuantity }) {
  if (selectedItems.length === 0) {
    return (
      <div className="ol__empty">
        <div>
          <div className="ol__empty-icon">🛒</div>
          <p>No items added yet</p>
          <p style={{ fontSize: "11px", marginTop: "2px" }}>Click items from the menu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ol">
      {selectedItems.map(item => (
        <div key={item.id} className="ol__item">
          <div className="ol__item-info">
            <div className="ol__item-name">{item.name}</div>
            <div className="ol__item-price">{item.price.toFixed(2)} ETB each</div>
          </div>
          <div className="ol__qty">
            <button className="ol__qty-btn" onClick={() => adjustQuantity(item.id, -1)}>−</button>
            <span className="ol__qty-count">{item.quantity}</span>
            <button className="ol__qty-btn" onClick={() => adjustQuantity(item.id, 1)}>+</button>
          </div>
          <div className="ol__line-total">{(item.price * item.quantity).toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}

export default OrderList;
