import React, { useState } from "react";
import { verifyService } from "../../services/api";
import "../../style/VerifyInvoice.css";

const CANCEL_REASONS = [
  { label: "Duplicate",          code: "1" },
  { label: "Data entry mistake", code: "2" },
  { label: "Order cancelled",    code: "3" },
  { label: "Others",             code: "4" },
];

export default function VerifyInvoice() {
  const [irn, setIrn] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openSections, setOpenSections] = useState({ doc: true, seller: true, buyer: true, payment: true, items: true, source: false });
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("1");
  const [cancelRemark, setCancelRemark] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelResult, setCancelResult] = useState(null);
  const [cancelError, setCancelError] = useState("");

  const toggle = key => setOpenSections(p => ({ ...p, [key]: !p[key] }));

  const verify = async () => {
    if (!irn.trim()) { setError("Please enter an IRN"); return; }
    setLoading(true); setError(""); setResult(null); setCancelResult(null); setShowCancel(false);
    try {
      const res = await verifyService.verifyIrn(irn.trim());
      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      if (data.statusCode === 200 && data.message === "SUCCESS") {
        setResult(data.body);
      } else if (data.status === "Error" && data.message?.toLowerCase().includes("cancelled")) {
        setResult({ Irn: irn.trim(), Status: "C", _cancelledMessage: data.message });
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Connection error");
    } finally { setLoading(false); }
  };

  const doCancel = async () => {
    if (!result?.Irn) return;
    setCancelLoading(true); setCancelError("");
    try {
      const res = await verifyService.cancelIrn(result.Irn, cancelReason, cancelRemark);
      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      if (data.statusCode === 200) {
        setCancelResult(data.body); setShowCancel(false);
        setResult(r => ({ ...r, Status: "C" }));
      } else {
        setCancelError(data.message || "Cancellation failed");
      }
    } catch (e) {
      setCancelError(e.response?.data?.message || e.message || "Cancellation failed");
    } finally { setCancelLoading(false); }
  };

  const copyIrn = () => {
    navigator.clipboard.writeText(result?.Irn || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isActive    = result?.Status === "A";
  const isCancelled = result?.Status === "C";

  return (
    <div className="vi">
      <div className="vi__header">
        <h2 className="vi__title">🔍 Invoice Verification</h2>
        <p className="vi__subtitle">Verify or cancel invoices registered on MOR e-invoicing system.</p>
      </div>

      {/* Search */}
      <div className="vi__search-box">
        <label className="vi__search-label">Invoice Reference Number (IRN)</label>
        <div className="vi__search-row">
          <input className="vi__input" type="text" value={irn} onChange={e => setIrn(e.target.value)}
            onKeyDown={e => e.key === "Enter" && verify()}
            placeholder="e.g. test-4f1927203a9d5b1e…" />
          <button className="vi__btn-verify" onClick={verify} disabled={loading}>
            {loading ? <><span className="vi__spinner" /> Verifying…</> : "🔍 Verify"}
          </button>
        </div>
        {error && <div className="vi__error">✗ {error}</div>}
      </div>

      {/* Result */}
      {result && (
        <div className="vi__result">
          {/* Status card */}
          <div className={`vi__status-card${isActive ? " vi__status-card--active" : " vi__status-card--cancelled"}`}>
            <div>
              <div className={isActive ? "vi__status-label--active" : "vi__status-label--cancelled"}>
                {isActive ? "✓ Active" : "✗ Cancelled"}
              </div>
              <div className="vi__status-meta">
                <span className="vi__irn">{result.Irn}</span>
                <button className={`vi__btn-copy${copied ? " vi__btn-copy--done" : ""}`} onClick={copyIrn} title="Copy IRN">
                  {copied ? "✓ Copied" : "📋"}
                </button>
              </div>
              {result._cancelledMessage && <p className="vi__cancelled-msg">{result._cancelledMessage}</p>}
            </div>
            <div className="vi__status-actions">
              {result.TransactionType && <span className="vi__tx-badge">{result.TransactionType}</span>}
              {isActive && !showCancel && (
                <button className="vi__btn-cancel-invoice" onClick={() => { setShowCancel(true); setCancelError(""); }}>
                  🚫 Cancel Invoice
                </button>
              )}
            </div>
          </div>

          {/* Cancel form */}
          {showCancel && isActive && (
            <div className="vi__cancel-form">
              <div className="vi__cancel-title">🚫 Cancel Invoice</div>
              {cancelError && <div className="vi__cancel-error">{cancelError}</div>}
              <div className="vi__cancel-grid">
                <div className="vi__field">
                  <label className="vi__label">Cancellation Reason *</label>
                  <select className="vi__select" value={cancelReason} onChange={e => setCancelReason(e.target.value)}>
                    {CANCEL_REASONS.map(r => <option key={r.code} value={r.code}>{r.label}</option>)}
                  </select>
                </div>
                <div className="vi__field">
                  <label className="vi__label">Remark (optional)</label>
                  <input className="vi__remark" type="text" placeholder="Additional remarks…"
                    value={cancelRemark} onChange={e => setCancelRemark(e.target.value)} />
                </div>
              </div>
              <div className="vi__cancel-actions">
                <button className="vi__btn-back" onClick={() => setShowCancel(false)}>Back</button>
                <button className="vi__btn-confirm" onClick={doCancel} disabled={cancelLoading}>
                  {cancelLoading ? <><span className="vi__spinner" /> Cancelling…</> : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          )}

          {/* Cancellation success */}
          {cancelResult && (
            <div className="vi__cancel-success">
              ✓ Invoice cancelled on <strong>{cancelResult.cancellationDate}</strong>
            </div>
          )}

          {/* Detail sections */}
          {!result._cancelledMessage && (
            <div className="vi__sections">
              <Section title="📄 Document" open={openSections.doc} onToggle={() => toggle("doc")}>
                <div className="vi__kv-grid">
                  <KV label="Document #" value={result.DocumentDetails?.DocumentNumber} bold />
                  <KV label="Date"        value={result.DocumentDetails?.Date} />
                  <KV label="Type"        value={result.DocumentDetails?.Type} />
                  <KV label="Version"     value={result.Version} />
                </div>
              </Section>

              <Section title="🏢 Seller" open={openSections.seller} onToggle={() => toggle("seller")}>
                <div className="vi__kv-grid">
                  <KV label="Company Name" value={result.SellerDetails?.LegalName} bold />
                  <KV label="TIN"          value={result.SellerDetails?.Tin} />
                  <KV label="VAT Number"   value={result.SellerDetails?.VatNumber} />
                  <KV label="Phone"        value={result.SellerDetails?.Phone} />
                  <KV label="Email"        value={result.SellerDetails?.Email} />
                  <KV label="Region"       value={result.SellerDetails?.Region} />
                </div>
              </Section>

              <Section title="👤 Buyer" open={openSections.buyer} onToggle={() => toggle("buyer")}>
                <div className="vi__kv-grid">
                  <KV label="Name"      value={result.BuyerDetails?.LegalName} bold />
                  <KV label="Phone"     value={result.BuyerDetails?.Phone} />
                  <KV label="Email"     value={result.BuyerDetails?.Email} />
                  <KV label="ID Type"   value={result.BuyerDetails?.IdType} />
                  <KV label="ID Number" value={result.BuyerDetails?.IdNumber} />
                  <KV label="Region"    value={result.BuyerDetails?.Region} />
                </div>
              </Section>

              <Section title="💳 Payment & Value" open={openSections.payment} onToggle={() => toggle("payment")}>
                <div className="vi__kv-grid">
                  <KV label="Payment Mode" value={result.PaymentDetails?.Mode} />
                  <KV label="Payment Term" value={result.PaymentDetails?.PaymentTerm} />
                  <KV label="Currency"     value={result.ValueDetails?.InvoiceCurrency} />
                  <KV label="Tax Amount"   value={result.ValueDetails?.TaxValue != null ? `${Number(result.ValueDetails.TaxValue).toFixed(2)} ETB` : null} />
                  <KV label="Total Amount" value={result.ValueDetails?.TotalValue != null ? `${Number(result.ValueDetails.TotalValue).toFixed(2)} ETB` : null} bold />
                </div>
              </Section>

              <Section title="🛒 Items" open={openSections.items} onToggle={() => toggle("items")}>
                <div style={{ overflowX: "auto" }}>
                  <table className="vi__items-table">
                    <thead>
                      <tr>
                        {["#","Description","Qty","Unit","Unit Price","Tax","Total"].map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {(result.ItemList || []).map((item, i) => (
                        <tr key={i}>
                          <td>{item.LineNumber}</td>
                          <td>{item.ProductDescription}</td>
                          <td>{item.Quantity}</td>
                          <td>{item.Unit}</td>
                          <td className="vi__td-right">{Number(item.UnitPrice).toFixed(2)}</td>
                          <td className="vi__td-right">{Number(item.TaxAmount).toFixed(2)}</td>
                          <td className="vi__td-right vi__td-bold">{Number(item.TotalLineAmount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section title="🖥️ Source System" open={openSections.source} onToggle={() => toggle("source")}>
                <div className="vi__kv-grid">
                  <KV label="System Number"   value={result.SourceSystem?.SystemNumber} />
                  <KV label="System Type"     value={result.SourceSystem?.SystemType} />
                  <KV label="Invoice Counter" value={result.SourceSystem?.InvoiceCounter} />
                  <KV label="Cashier"         value={result.SourceSystem?.CashierName} />
                  <KV label="Sales Person"    value={result.SourceSystem?.SalesPersonName} />
                </div>
              </Section>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, open, onToggle, children }) {
  return (
    <div className="vi__section">
      <button className={`vi__section-btn${open ? " vi__section-btn--open" : ""}`} onClick={onToggle}>
        <span>{title}</span>
        <span className={`vi__section-arrow${open ? " vi__section-arrow--open" : ""}`}>▼</span>
      </button>
      {open && <div className="vi__section-body">{children}</div>}
    </div>
  );
}

function KV({ label, value, bold }) {
  if (value === undefined || value === null) return null;
  return (
    <div className="vi__kv">
      <span className="vi__kv-label">{label}</span>
      <span className={bold ? "vi__kv-value vi__kv-value--bold" : "vi__kv-value"}>{value}</span>
    </div>
  );
}
