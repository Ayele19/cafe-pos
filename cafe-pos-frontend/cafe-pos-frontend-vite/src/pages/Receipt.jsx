import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/Receipt.css";

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receipt = location.state;

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.style.display = "none";
    document.body.style.marginLeft = "0";

    return () => {
      if (sidebar) sidebar.style.display = "";
      document.body.style.marginLeft = "";
    };
  }, []);

  if (!receipt) {
    return (
      <div className="receipt-container">
        <div className="receipt-card">
          <h2>No Receipt Data</h2>
          <button onClick={() => navigate("/")}>Back to POS</button>
        </div>
      </div>
    );
  }

  const {
    items = [],
    buyer,
    seller,
    subtotal = 0,
    vatAmount = 0,
    totalPrice = 0,
    irn,
    invoiceNumber,
    timestamp,
    signedQR,
    morResponse
  } = receipt;

  /* ===============================
     SAFE SIGNED QR EXTRACTION
     (Handles all backend formats)
  ================================ */
  const actualSignedQR =
    signedQR ||
    morResponse?.signedQR ||
    morResponse?.body?.signedQR ||
    morResponse?.body?.SignedQR ||
    morResponse?.data?.signedQR ||
    null;

  /* ===============================
     CONVERT BASE64 → IMAGE SRC
  ================================ */
  const getQrImageSrc = () => {
    if (!actualSignedQR) return null;

    // If already full data URL
    if (actualSignedQR.startsWith("data:image")) {
      return actualSignedQR;
    }

    // Convert Base64 string to PNG image
    return `data:image/png;base64,${actualSignedQR}`;
  };

  const verificationUrl = irn
    ? `https://portal.mor.gov.et/public/invoice?irn=${irn}`
    : null;

  const formatDate = (ts) => {
    if (!ts) return new Date().toLocaleString();
    const d = new Date(ts);
    return isNaN(d.getTime())
      ? new Date().toLocaleString()
      : d.toLocaleString();
  };

  const copyToClipboard = () => {
    if (!irn) return;
    navigator.clipboard.writeText(irn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrImageSrc = getQrImageSrc();

  return (
    <div className="receipt-container">
      <div className="receipt-card traditional-receipt">

        {/* ================= HEADER ================= */}
        <div className="receipt-header">
          <div className="business-code">
            TIN {seller?.tin || "0000000000"}
          </div>

          <h1 className="business-name">
            {seller?.legalName || "DROONGO SYSTEM SOLUTIONS PLC"}
          </h1>

          <div className="business-address">
            <p>
              {seller?.city || "Addis Ababa"} | Woreda {seller?.wereda || "N/A"}
            </p>
            <p>Tel: {seller?.phone || "N/A"}</p>
          </div>
        </div>

        {/* ================= INFO ================= */}
        <div className="receipt-info-section">
          <div><strong>Date:</strong> {formatDate(timestamp)}</div>
          <div><strong>Invoice No:</strong> {invoiceNumber}</div>
          <div><strong>Customer:</strong> {buyer?.legalName || "Walk-in Customer"}</div>
        </div>

        <div className="invoice-header">
          <h2>CASH INVOICE</h2>
        </div>

        {/* ================= ITEMS ================= */}
        <div className="table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Price</th>
                <th>VAT</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.productDescription}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>{item.unitPrice?.toFixed(2)}</td>
                    <td>{item.taxAmount?.toFixed(2)}</td>
                    <td>{item.totalLineAmount?.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="divider"></div>

        {/* ================= TOTALS ================= */}
        <div className="totals-section">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)} ETB</span>
          </div>
          <div className="total-row">
            <span>VAT:</span>
            <span>{vatAmount.toFixed(2)} ETB</span>
          </div>
          <div className="total-row grand-total">
            <span>Total:</span>
            <span>{totalPrice.toFixed(2)} ETB</span>
          </div>
        </div>

        <div className="divider"></div>

        {/* ================= OFFICIAL MOR SIGNED QR ================= */}
        {qrImageSrc && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <img
              src={qrImageSrc}
              alt="MOR Certified QR Code"
              style={{
                width: "220px",
                height: "220px",
                objectFit: "contain"
              }}
            />
            <p style={{ fontWeight: "bold" }}>
              MOR Certified Invoice QR
            </p>
          </div>
        )}

        {/* ================= IRN ================= */}
        {irn && (
          <div className="irn-display-vertical">
            <strong>IRN:</strong>
            <div>{irn}</div>
            <button onClick={copyToClipboard}>
              {copied ? "✓ Copied" : "Copy IRN"}
            </button>
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="receipt-footer">
          <p>Thank you for your business!</p>
          <p>Printed: {new Date().toLocaleString()}</p>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="action-buttons no-print">
          <button onClick={() => navigate("/")}>Back to POS</button>
          <button onClick={() => window.print()}>Print</button>
          {verificationUrl && (
            <button onClick={() => window.open(verificationUrl, "_blank")}>
              Verify on MOR Portal
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Receipt;