// OrderSection/Totals.jsx
import React from "react";

function Totals({ subtotal, vatAmount, totalPrice, vatRate }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg text-sm">
      <h3 className="font-bold mb-1">Order Summary</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-medium">{subtotal.toFixed(2)} ETB</span>
        </div>
        <div className="flex justify-between">
          <span>VAT ({vatRate}%):</span>
          <span className="font-medium">{vatAmount.toFixed(2)} ETB</span>
        </div>
        <div className="flex justify-between font-bold pt-1 border-t">
          <span>Total:</span>
          <span className="text-blue-600">{totalPrice.toFixed(2)} ETB</span>
        </div>
      </div>
    </div>
  );
}

export default Totals;