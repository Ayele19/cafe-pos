import React from "react";
import "../../../style/Payment.css";

const PAYMENT_MODES = ["CASH", "CREDIT", "DEBIT"];
const TX_TYPES = ["B2B", "B2C", "B2G"];
const VAT_RATES = [
  { rate: 0,  label: "0%"  },
  { rate: 10, label: "10%" },
  { rate: 15, label: "15%" },
];

function Payment({ paymentDetails, setPaymentDetails, vatRate, setVatRate, transactionType, setTransactionType }) {
  const { mode, paymentTerm } = paymentDetails;

  const Chip = ({ label, active, onClick, color = "#1b6375" }) => (
    <button
      type="button"
      className="pay__chip"
      onClick={onClick}
      style={{
        borderColor: active ? color : "#d1d5db",
        background: active ? color : "#fff",
        color: active ? "#fff" : "#374151",
        fontWeight: active ? "700" : "400",
      }}>
      {label}
    </button>
  );

  return (
    <div className="pay">
      <div className="pay__rows">
        <div className="pay__row">
          <span className="pay__row-label">Type</span>
          <div className="pay__chips">
            {TX_TYPES.map(t => <Chip key={t} label={t} active={transactionType === t} onClick={() => setTransactionType(t)} />)}
          </div>
        </div>
        <div className="pay__row">
          <span className="pay__row-label">Pay</span>
          <div className="pay__chips">
            {PAYMENT_MODES.map(m => <Chip key={m} label={m} active={mode === m} onClick={() => setPaymentDetails(p => ({ ...p, mode: m }))} color="#059669" />)}
          </div>
        </div>
        <div className="pay__row">
          <span className="pay__row-label">VAT</span>
          <div className="pay__chips">
            {VAT_RATES.map(v => <Chip key={v.rate} label={v.label} active={vatRate === v.rate} onClick={() => setVatRate(v.rate)} color="#7c3aed" />)}
          </div>
        </div>
        <div className="pay__row">
          <span className="pay__row-label">Term</span>
          <div className="pay__chips">
            {["IMMEDIATE","Term0","Term1"].map(t => (
              <Chip key={t} label={t === "IMMEDIATE" ? "Immediate" : t} active={paymentTerm === t} onClick={() => setPaymentDetails(p => ({ ...p, paymentTerm: t }))} color="#d97706" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
