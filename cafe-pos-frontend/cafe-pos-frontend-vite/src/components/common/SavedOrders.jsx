import React, { useState } from "react";
import './SavedOrders.css';

function SavedOrders({ savedOrders = []}) {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="saved-orders">
      <h2>Saved Orders</h2>

      <div className="table-container">
        <table className="saved-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {savedOrders.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-row">No saved orders</td>
              </tr>
            ) : (
              savedOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const buyer = order.buyerInfo || {};
                const value = order.valueDetails || {};
                const items = order.items || [];

                return (
                  <React.Fragment key={order.id}>
                    <tr
                      onClick={() => toggleExpand(order.id)}
                      className={isExpanded ? "expanded-row" : ""}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{order.documentDetails?.documentNumber || order.id}</td>
                      <td>{buyer.legalName}</td>
                      <td>{value.totalValue?.toFixed(2)}</td>
                      <td>{new Date(order.documentDetails?.date || order.timestamp).toLocaleString()}</td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan="4" className="expanded-td">
                          <strong>Buyer Info:</strong><br />
                          Name: {buyer.legalName}<br />
                          Email: {buyer.email || '-'}<br />
                          Phone: {buyer.phone || '-'}<br />
                          Address: {buyer.address || '-'}<br /><br />

                          <strong>Items:</strong><br />
                          {items.length === 0 ? 'No items' : (
                            <ul>
                              {items.map((item, idx) => (
                                <li key={idx}>
                                  {item.name} - {item.quantity} {item.unit} - {item.price.toFixed(2)} Birr
                                </li>
                              ))}
                            </ul>
                          )}
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
    </div>
  );
}

export default SavedOrders;
