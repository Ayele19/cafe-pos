import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronRight } from "lucide-react";


function SavedOrdersSection() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="p-6 overflow-auto max-h-screen">
      <h2 className="text-xl font-bold mb-4">Saved Orders</h2>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2"></th>
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">Buyer ID</th>
            <th className="border px-4 py-2">Total Price</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              {/* Row */}
              <tr
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => toggleExpand(order.id)}
              >
                <td className="border px-4 py-2 text-center">
                  {expandedOrderId === order.id ? (
                    <ChevronDown className="inline w-5 h-5" />
                  ) : (
                    <ChevronRight className="inline w-5 h-5" />
                  )}
                </td>
                <td className="border px-4 py-2">{order.id}</td>
                <td className="border px-4 py-2">{order.buyerId}</td>
                <td className="border px-4 py-2">
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td className="border px-4 py-2">{order.timestamp}</td>
              </tr>

              {/* Expandable details */}
              <AnimatePresence>
                {expandedOrderId === order.id && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <td colSpan={5} className="border px-4 py-2 bg-gray-50">
                      <div className="overflow-auto max-h-80">
                        <h4 className="font-semibold mb-2">Buyer Details</h4>
                        <p>
                          <strong>Name:</strong> {order.buyerName}
                        </p>
                        <p>
                          <strong>Phone:</strong> {order.buyerPhone}
                        </p>
                        <p>
                          <strong>Email:</strong> {order.buyerEmail}
                        </p>
                        <p>
                          <strong>Address:</strong> {order.buyerAddress}
                        </p>

                        <h4 className="font-semibold mt-3 mb-2">Items</h4>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border px-4 py-2">Menu Item</th>
                              <th className="border px-4 py-2">Quantity</th>
                              <th className="border px-4 py-2">Price</th>
                              <th className="border px-4 py-2">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="border px-4 py-2">
                                  {item.menuItemName || `Item #${item.menuItemId}`}
                                </td>
                                <td className="border px-4 py-2">{item.quantity}</td>
                                <td className="border px-4 py-2">
                                  ${item.price.toFixed(2)}
                                </td>
                                <td className="border px-4 py-2">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SavedOrdersSection;
