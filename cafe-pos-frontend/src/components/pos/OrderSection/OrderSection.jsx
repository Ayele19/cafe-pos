import React, { useState, useEffect, useMemo } from "react";
import { orderService, buyerService } from "../../../services/api"; 
import { useNavigate } from "react-router-dom";
import "./OrderSection.css";

function OrderSection({
  selectedItems,
  setSelectedItems,
  selectedBuyer,
  setSelectedBuyer,
  buyers,
  setBuyers,
  selectedSeller,
  vatRate,
  setVatRate,
  paymentDetails,
  setPaymentDetails,
  invoiceCounter,
  setInvoiceCounter
}) {
  const navigate = useNavigate();
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [transactionType, setTransactionType] = useState("B2C");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { mode: paymentMode, paymentTerm } = paymentDetails;

  /* ---------------- TOAST NOTIFICATION ---------------- */
  const showMessage = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  /* ---------------- CALCULATE TOTALS ---------------- */
  const { subtotal, vatAmount, totalPrice } = useMemo(() => {
    const sub = selectedItems.reduce(
      (sum, item) => sum + (item.price || item.unitPrice || 0) * item.quantity,
      0
    );
    const vat = parseFloat((sub * (vatRate / 100)).toFixed(2));
    const total = parseFloat((sub + vat).toFixed(2));
    return { subtotal: sub, vatAmount: vat, totalPrice: total };
  }, [selectedItems, vatRate]);

  /* ---------------- ITEM ACTIONS ---------------- */
  const adjustQuantity = (id, delta) => {
    setSelectedItems(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(item.quantity + delta, 0) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromOrder = id => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  /* ---------------- SAVE ORDER & REDIRECT ---------------- */
  const saveOrder = async (e) => {
    // 1. Prevent page refresh which kills the redirect
    if (e) e.preventDefault();

    if (!selectedBuyer?.legalName || selectedItems.length === 0) {
      return showMessage("error", "Please select buyer and items");
    }

    setLoading(true);

    try {
      // 2. Map to DTO format for your Java @RequestBody
      const requestData = {
        transactionType,
        version: "1",
        buyerInfo: { ...selectedBuyer },
        sellerInfo: { ...selectedSeller },
        paymentDetails: { mode: paymentMode, paymentTerm },
        sourceSystem: {
          cashierName: "CurrentUser",
          invoiceCounter: invoiceCounter || 1,
          systemType: "POS",
          systemNumber: "POS001"
        },
        valueDetails: {
          taxValue: vatAmount,
          totalValue: totalPrice,
          invoiceCurrency: "ETB",
          discount: 0
        },
        items: selectedItems.map((item, index) => ({
          menuItemId: item.id,
          productDescription: item.name || item.productDescription,
          unitPrice: item.price || item.unitPrice,
          quantity: item.quantity,
          lineNumber: index + 1,
          totalLineAmount: parseFloat(((item.price || item.unitPrice) * item.quantity * (1 + vatRate / 100)).toFixed(2)),
          taxAmount: parseFloat(((item.price || item.unitPrice) * item.quantity * (vatRate / 100)).toFixed(2))
        }))
      };

      // 3. API Call
      const response = await orderService.saveOrder(requestData);
      
      // result matches your F12 screenshot: {success: true, irn: "...", signedQR: "...", ...}
      const result = response.data; 

      // 4. CHECK SUCCESS (Based on your Network Tab)
      if (result && result.success === true) {
        
        // Prepare data for the Receipt Page
        const receiptData = {
          irn: result.irn,
          signedQR: result.signedQR,
          documentNumber: result.documentaNumber, // From F12: "229"
          items: [...selectedItems],
          buyer: { ...selectedBuyer },
          totals: { subtotal, vatAmount, totalPrice },
          payment: { ...paymentDetails }
        };

        // A. Store in LocalStorage as a persistent backup
        localStorage.setItem("lastReceipt", JSON.stringify(receiptData));

        // B. Update local invoice counter
        if (setInvoiceCounter) setInvoiceCounter(prev => (prev || 1) + 1);

        // C. Show Success Toast
        showMessage("success", result.message || "Invoice Registered!");

        // D. 🔥 REDIRECT WITH DELAY
        // Giving the user 1 second to see the success message, then navigating
        setTimeout(() => {
          console.log("Navigating to /receipt...");
          const navigate = useNavigate();
          navigate("/receipt", { state: receiptData });

          // E. Reset POS state ONLY after navigation is triggered
          setSelectedItems([]);
          setSelectedBuyer(null);
        }, 1000);

      } else {
        // This handles cases where success is false
        showMessage("error", result.message || "MOR registration failed");
      }

    } catch (err) {
      console.error("Critical POS Error:", err);
      const errorMsg = err.response?.data?.message || "Connection to Server Failed";
      showMessage("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI RENDERING ---------------- */
  return (
    <div className="order-section modern-container">
      {toast && <div className={`toast ${toast.type}`}>{toast.text}</div>}

      <div className="order-header">
        <h3>Order Summary</h3>
        <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
          <option value="B2C">B2C (Cash)</option>
          <option value="B2B">B2B (Credit)</option>
        </select>
      </div>

      <div className="buyer-selection">
        <label>Buyer:</label>
        <div className="select-row">
            <select
                value={selectedBuyer?.id || ""}
                onChange={(e) => {
                    const b = buyers.find(x => x.id === parseInt(e.target.value));
                    setSelectedBuyer(b || { legalName: "" });
                }}
            >
                <option value="">-- Walk-in Customer --</option>
                {buyers.map(b => (
                    <option key={b.id} value={b.id}>{b.legalName}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="items-list-container">
        {selectedItems.length === 0 ? (
          <p className="empty-cart-msg">Add items to start order</p>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td className="qty-controls">
                    <button onClick={() => adjustQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => adjustQuantity(item.id, 1)}>+</button>
                  </td>
                  <td>{((item.price || item.unitPrice) * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className="remove-item" onClick={() => removeFromOrder(item.id)}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="order-totals">
        <div className="total-line">
          <span>Subtotal:</span>
          <span>{subtotal.toFixed(2)} ETB</span>
        </div>
        <div className="total-line">
          <span>VAT (15%):</span>
          <span>{vatAmount.toFixed(2)} ETB</span>
        </div>
        <div className="total-line grand-total">
          <span>Grand Total:</span>
          <span>{totalPrice.toFixed(2)} ETB</span>
        </div>
      </div>

      {/* Button type="button" is critical to avoid page reloads */}
      <button 
        type="button" 
        className="btn-complete-sale" 
        onClick={saveOrder}
        disabled={loading || selectedItems.length === 0}
      >
        {loading ? "Registering..." : "Complete & Print Receipt"}
      </button>
    </div>
  );
}

export default OrderSection;