import React from "react";
import "../../../style/Totals.css";

function Totals({ subtotal, vatAmount, totalPrice, vatRate }) {
  return (
    <div className="totals">
      <div className="totals__row">
        <span>Subtotal</span>
        <span>{subtotal.toFixed(2)} ETB</span>
      </div>
      <div className="totals__row">
        <span>VAT ({vatRate}%)</span>
        <span>{vatAmount.toFixed(2)} ETB</span>
      </div>
      <div className="totals__grand">
        <span>Total</span>
        <span className="totals__grand-value">{totalPrice.toFixed(2)} ETB</span>
      </div>
    </div>
  );
}

export default Totals;
