// OrderSection/OrderList.jsx
import React from "react";

function OrderList({ selectedItems, adjustQuantity }) {
  if (selectedItems.length === 0) {
    return <p className="text-gray-500 italic text-sm">No items selected.</p>;
  }

  return (
    <div>
      <h3 className="font-bold mb-1 text-sm">Order Items</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-left text-xs">Item</th>
              <th className="border px-2 py-1 text-xs">Qty</th>
              <th className="border px-2 py-1 text-xs">Price</th>
              <th className="border px-2 py-1 text-xs">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 text-sm">
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      className="w-6 h-6 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs"
                      onClick={() => adjustQuantity(item.id, -1)}
                    >
                      -
                    </button>
                    <span className="min-w-[20px] text-center">{item.quantity}</span>
                    <button
                      className="w-6 h-6 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs"
                      onClick={() => adjustQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="border px-2 py-1 text-right">{item.price.toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">
                  {(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList;