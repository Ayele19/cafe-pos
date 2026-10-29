import React, { useState, useEffect } from "react";
import { cashierService, branchService } from "../../services/api";
import "../../style/CashierManagement.css";

const EMPTY = { username: "", displayName: "", email: "", password: "", confirmPassword: "", sourceSystemId: "" };

export default function CashierManagement() {
  const [cashiers, setCashiers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [credentials, setCredentials] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [resetPwd, setResetPwd] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSaving, setResetSaving] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    cashierService.getAll().then(r => setCashiers(r.data)).catch(console.error);
    branchService.getAll().then(r => setBranches(r.data)).catch(console.error);
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const validate = () => {
    if (!form.username.trim()) return "Username is required";
    if (form.username.includes(" ")) return "Username must not contain spaces";
    if (!form.email.includes("@")) return "Valid email is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    if (!form.sourceSystemId) return "Branch is required";
    return null;
  };

  const save = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setSaving(true); setError("");
    try {
      const res = await cashierService.create({
        username: form.username, displayName: form.displayName,
        email: form.email, password: form.password, sourceSystemId: form.sourceSystemId,
      });
      setCashiers(p => [...p, res.data]);
      setCredentials({ username: form.username, password: form.password, displayName: form.displayName });
      setForm(EMPTY); setShowForm(false);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to create cashier");
    } finally { setSaving(false); }
  };

  const deactivate = async id => {
    await cashierService.remove(id);
    setCashiers(p => p.map(c => c.id === id ? { ...c, active: false } : c));
  };

  const reactivate = async id => {
    await cashierService.update(id, { active: true });
    setCashiers(p => p.map(c => c.id === id ? { ...c, active: true } : c));
  };

  const doReset = async () => {
    if (resetPwd.length < 6) { setResetError("Min. 6 characters"); return; }
    setResetSaving(true); setResetError("");
    try {
      await cashierService.resetPassword(resetTarget.id, resetPwd);
      setCredentials({ username: resetTarget.username, password: resetPwd, isReset: true });
      setResetTarget(null); setResetPwd("");
    } catch (e) {
      setResetError(e.response?.data?.error || "Failed to reset");
    } finally { setResetSaving(false); }
  };

  const filtered = cashiers.filter(c =>
    !search ||
    c.username?.toLowerCase().includes(search.toLowerCase()) ||
    c.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cm">

      {/* Credentials modal */}
      {credentials && (
        <div className="cm__modal-overlay">
          <div className="cm__modal">
            <div className="cm__cred-center">
              <div className="cm__cred-emoji">{credentials.isReset ? "🔑" : "✅"}</div>
              <h3 className="cm__cred-title">{credentials.isReset ? "Password Reset" : "Cashier Created!"}</h3>
              <p className="cm__cred-sub">Share with <strong>{credentials.displayName || credentials.username}</strong></p>
            </div>
            <div className="cm__cred-box">
              <CredRow label="Login URL" value={window.location.origin} onCopy={() => copy(window.location.origin, "url")} copied={copied === "url"} />
              <CredRow label="Username"  value={credentials.username}           onCopy={() => copy(credentials.username, "user")} copied={copied === "user"} />
              <CredRow label="Password"  value={credentials.password}           onCopy={() => copy(credentials.password, "pwd")}  copied={copied === "pwd"} />
            </div>
            <p className="cm__cred-warning">⚠️ Save these now — password won't be shown again.</p>
            <button className="cm__cred-done" onClick={() => setCredentials(null)}>Done</button>
          </div>
        </div>
      )}

      {/* Reset password modal */}
      {resetTarget && (
        <div className="cm__modal-overlay">
          <div className="cm__modal">
            <h3 className="cm__reset-title">Reset Password</h3>
            <p className="cm__reset-sub">New password for <strong>{resetTarget.username}</strong></p>
            {resetError && <p className="cm__reset-error">{resetError}</p>}
            <input type="password" className="cm__reset-input" placeholder="New password (min. 6 chars)"
              value={resetPwd} onChange={e => setResetPwd(e.target.value)} />
            <div className="cm__reset-actions">
              <button className="cm__btn-cancel" onClick={() => { setResetTarget(null); setResetPwd(""); setResetError(""); }}>Cancel</button>
              <button className="cm__btn-reset" onClick={doReset} disabled={resetSaving}>
                {resetSaving ? "Saving…" : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="cm__header">
        <div>
          <h2 className="cm__title">👷 Cashiers</h2>
          <p className="cm__subtitle">{cashiers.length} cashier{cashiers.length !== 1 ? "s" : ""} · {cashiers.filter(c => c.active).length} active</p>
        </div>
        <div className="cm__header-actions">
          <input type="text" className="cm__search" placeholder="🔍 Search cashiers…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <button className={`cm__btn-add ${showForm ? "cm__btn-add--open" : "cm__btn-add--closed"}`}
            onClick={() => { setShowForm(v => !v); setError(""); setForm(EMPTY); }}>
            {showForm ? "✕ Cancel" : "+ Add Cashier"}
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="cm__form-card">
          <div className="cm__form-header">
            <span>New Cashier Account</span>
            <span className="cm__required-note"><span className="cm__star">*</span> required</span>
          </div>
          {error && <div className="cm__form-error">{error}</div>}
          <div className="cm__form-grid">
            <FField label="Username"         fkey="username"        placeholder="e.g. abebe.cashier"  required form={form} set={set} />
            <FField label="Display Name"     fkey="displayName"     placeholder="e.g. Abebe Kebede"             form={form} set={set} />
            <FField label="Email"            fkey="email"           placeholder="abebe@cafe.com"      required form={form} set={set} type="email" />
            <div />
            <FField label="Password"         fkey="password"        placeholder="Min. 6 characters"   required form={form} set={set} type="password" />
            <FField label="Confirm Password" fkey="confirmPassword" placeholder="Repeat password"     required form={form} set={set} type="password" />
            <div className="cm__field" style={{ gridColumn: "1 / -1" }}>
              <label className="cm__label">Branch <span className="cm__star">*</span></label>
              <select className={`cm__select${!form.sourceSystemId ? " cm__select--error" : ""}`}
                value={form.sourceSystemId} onChange={e => set("sourceSystemId", e.target.value)}>
                <option value="">— select branch —</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.branchName || b.systemNumber}{b.seller ? ` · ${b.seller.legalName}` : ""}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="cm__form-footer">
            <button className="cm__btn-submit" onClick={save} disabled={saving}>
              {saving ? "Creating account…" : "✓ Create Cashier Account"}
            </button>
          </div>
        </div>
      )}

      {/* Cashier cards */}
      {filtered.length === 0 ? (
        <div className="cm__empty">
          <div className="cm__empty-icon">👷</div>
          <p>{search ? "No cashiers match your search" : "No cashiers yet. Click '+ Add Cashier' to create one."}</p>
        </div>
      ) : (
        <div className="cm__list">
          {filtered.map(c => (
            <div key={c.id} className={`cm__card${c.active ? "" : " cm__card--inactive"}`}>
              <div className={`cm__avatar ${c.active ? "cm__avatar--active" : "cm__avatar--inactive"}`}>
                {(c.displayName || c.username || "?").slice(0, 2).toUpperCase()}
              </div>
              <div className="cm__card-info">
                <div className="cm__card-name">{c.displayName || c.username}</div>
                <div className="cm__card-meta">@{c.username} · {c.sourceSystem?.branchName || c.sourceSystem?.systemNumber || "No branch"}</div>
              </div>
              <span className={`cm__badge ${c.active ? "cm__badge--active" : "cm__badge--inactive"}`}>
                {c.active ? "● Active" : "○ Inactive"}
              </span>
              <div className="cm__card-actions">
                <button className="cm__btn-reset-pw"
                  onClick={() => { setResetTarget({ id: c.id, username: c.username }); setResetPwd(""); setResetError(""); }}>
                  🔑 Reset
                </button>
                {c.active
                  ? <button className="cm__btn-deactivate" onClick={() => deactivate(c.id)}>Deactivate</button>
                  : <button className="cm__btn-reactivate" onClick={() => reactivate(c.id)}>Reactivate</button>
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FField({ label, fkey, placeholder, type = "text", required, form, set }) {
  return (
    <div className="cm__field">
      <label className="cm__label">{label}{required && <span className="cm__star"> *</span>}</label>
      <input type={type} className={`cm__input${required && !form[fkey] ? " cm__input--error" : ""}`}
        placeholder={placeholder} value={form[fkey] || ""} onChange={e => set(fkey, e.target.value)} />
    </div>
  );
}

function CredRow({ label, value, onCopy, copied }) {
  return (
    <div>
      <div className="cm__cred-row-label">{label}</div>
      <div className="cm__cred-row-value">
        <div className="cm__cred-value">{value}</div>
        <button className={`cm__cred-copy${copied ? " cm__cred-copy--done" : ""}`} onClick={onCopy}>
          {copied ? "✓" : "📋"}
        </button>
      </div>
    </div>
  );
}
