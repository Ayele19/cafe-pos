import React, { useState } from "react";

function SavedOrders({ savedOrders = [], onOrderClick }) {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="saved-orders">
      <h2>Saved Orders</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>Buyer</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {savedOrders.length === 0 ? (
            <tr>
              <td colSpan="4" style={emptyRowStyle}>No saved orders</td>
            </tr>
          ) : (
            savedOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const buyer = order.buyerInfo || {};
              const payment = order.paymentDetails || {};
              const value = order.valueDetails || {};

              return (
                <React.Fragment key={order.id}>
                  <tr
                    onClick={() => toggleExpand(order.id)}
                    style={{ cursor: "pointer", backgroundColor: isExpanded ? "#eef" : "white" }}
                  >
                    <td style={tdStyle}>{order.documentDetails?.documentNumber || order.id}</td>
                    <td style={tdStyle}>{buyer.legalName}</td>
                    <td style={tdStyle}>{value.totalValue?.toFixed(2)}</td>
                    <td style={tdStyle}>{new Date(order.documentDetails?.date || order.timestamp).toLocaleString()}</td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan="4" style={expandedTdStyle}>
                        {/* Buyer Info */}
                        <strong>Buyer Info:</strong><br />
                        Name: {buyer.legalName}<br />
                        Phone: {buyer.phone}<br />
                        Email: {buyer.email}<br />
                        Address: {buyer.houseNumber}, {buyer.kebele}, {buyer.zone}, {buyer.wereda}, {buyer.city}, {buyer.region}<br />
                        TIN: {buyer.tin}<br />
                        VAT: {buyer.vatNumber}<br />
                        ID: {buyer.idNumber} ({buyer.idType})<br />
                        Country: {buyer.country}<br /><br />

                        {/* Items */}
                        <strong>Items:</strong>
                        <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                          {order.items?.map((item) => (
                            <li key={item.lineNumber || item.menuItemId}>
                              {item.productDescription} (x{item.quantity}) - Unit: {item.unitPrice.toFixed(2)}, Total: {item.totalLineAmount.toFixed(2)}, Tax: {item.taxAmount.toFixed(2)}
                            </li>
                          ))}
                        </ul>

                        {/* Totals */}
                        <strong>Subtotal:</strong> {(value.totalValue - value.taxValue).toFixed(2)}<br />
                        <strong>VAT ({value.taxValue ? ((value.taxValue / (value.totalValue - value.taxValue)) * 100).toFixed(2) : 0}%):</strong> {value.taxValue?.toFixed(2)}<br />
                        <strong>Total:</strong> {value.totalValue?.toFixed(2)}<br /><br />

                        {/* Payment */}
                        <strong>Payment Details:</strong><br />
                        Mode: {payment.mode}<br />
                        Term: {payment.paymentTerm}<br /><br />

                        {/* Source/System */}
                        <strong>Source System:</strong><br />
                        Cashier: {order.sourceSystem?.cashierName}<br />
                        Salesperson: {order.sourceSystem?.salesPersonName}<br />
                        System: {order.sourceSystem?.systemNumber} ({order.sourceSystem?.systemType})<br /><br />

                        <button onClick={() => onOrderClick(order)} style={{ marginTop: "8px" }}>
                          Load This Order
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const thStyle = { padding: "8px", border: "1px solid #ccc" };
const tdStyle = { padding: "6px", border: "1px solid #ccc" };
const emptyRowStyle = { textAlign: "center", padding: "8px" };
const expandedTdStyle = { padding: "10px", border: "1px solid #ccc", backgroundColor: "#f9f9f9" };

export default SavedOrders;
