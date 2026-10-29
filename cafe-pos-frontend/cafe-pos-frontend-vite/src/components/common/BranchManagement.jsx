import React, { useState, useEffect } from "react";
import { branchService, sellerService } from "../../services/api";
import "../../style/BranchManagement.css";

const EMPTY = { systemNumber: "", systemType: "POS", branchName: "", sellerId: "" };

export default function BranchManagement() {
  const [branches, setBranches] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    branchService.getAll().then(r => setBranches(r.data)).catch(console.error);
    sellerService.getSellers().then(r => setSellers(r.data)).catch(console.error);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => { setForm(EMPTY); setEditId(null); setError(""); setShowForm(true); };
  const openEdit = (b) => {
    setForm({ systemNumber: b.systemNumber || "", systemType: b.systemType || "POS", branchName: b.branchName || "", sellerId: b.seller?.id || "" });
    setEditId(b.id); setError(""); setShowForm(true);
  };
  const cancel = () => { setForm(EMPTY); setEditId(null); setShowForm(false); setError(""); };

  const save = async () => {
    if (!form.systemNumber.trim()) { setError("System number is required"); return; }
    if (!form.sellerId) { setError("Company is required"); return; }
    setSaving(true); setError("");
    try {
      if (editId) {
        const res = await branchService.update(editId, form);
        setBranches(p => p.map(b => b.id === editId ? res.data : b));
        showToast("Branch updated");
      } else {
        const res = await branchService.create(form);
        setBranches(p => [...p, res.data]);
        showToast("Branch created");
      }
      cancel();
    } catch (e) {
      setError(e.response?.data?.error || "Failed to save branch");
    } finally { setSaving(false); }
  };

  const unique = [...new Map(branches.map(b => [b.systemNumber, b])).values()];
  const filtered = unique.filter(b =>
    !search ||
    b.branchName?.toLowerCase().includes(search.toLowerCase()) ||
    b.systemNumber?.toLowerCase().includes(search.toLowerCase()) ||
    b.seller?.legalName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bm">

      {toast && (
        <div className={`bm__toast bm__toast--${toast.type}`}>
          {toast.type === "error" ? "✗" : "✓"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bm__header">
        <div>
          <h2 className="bm__title">🏢 Branches</h2>
          <p className="bm__subtitle">{unique.length} branch{unique.length !== 1 ? "es" : ""}</p>
        </div>
        <div className="bm__header-actions">
          <input
            type="text"
            className="bm__search"
            placeholder="🔍 Search branches…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="bm__btn-add" onClick={openAdd}>+ Add Branch</button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bm__form-card">
          <div className="bm__form-header">
            <span>{editId ? "Edit Branch" : "New Branch"}</span>
            <span className="bm__required-note"><span className="bm__star">*</span> required</span>
          </div>

          {error && <div className="bm__error">{error}</div>}

          <div className="bm__form-grid">
            <FField label="System Number" fkey="systemNumber" placeholder="e.g. 4249E11DD6" required form={form} set={set} />
            <FField label="Branch Name"   fkey="branchName"   placeholder="e.g. Main Branch"              form={form} set={set} />
            <FField label="System Type"   fkey="systemType"   placeholder="POS"                           form={form} set={set} />
            <div className="bm__field">
              <label className="bm__label">Company <span className="bm__star">*</span></label>
              <select
                className={`bm__select${!form.sellerId ? " bm__select--error" : ""}`}
                value={form.sellerId}
                onChange={e => set("sellerId", e.target.value)}
              >
                <option value="">— select company —</option>
                {sellers.map(s => (
                  <option key={s.id} value={s.id}>{s.legalName}{s.tin ? ` (${s.tin})` : ""}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bm__form-actions">
            <button className="bm__btn-cancel" onClick={cancel}>Cancel</button>
            <button className="bm__btn-save" onClick={save} disabled={saving}>
              {saving ? "Saving…" : editId ? "Update Branch" : "Save Branch"}
            </button>
          </div>
        </div>
      )}

      {/* Branch cards */}
      {filtered.length === 0 ? (
        <div className="bm__empty">
          <div className="bm__empty-icon">🏢</div>
          <p>{search ? "No branches match your search" : "No branches yet. Click '+ Add Branch' to create one."}</p>
        </div>
      ) : (
        <div className="bm__list">
          {filtered.map(b => (
            <div key={b.id} className="bm__card">
              <div className="bm__card-icon">🏢</div>
              <div className="bm__card-info">
                <div className="bm__card-name">{b.branchName || b.systemNumber}</div>
                <div className="bm__card-meta">
                  <span>#{b.systemNumber}</span>
                  <span>·</span>
                  <span>{b.systemType}</span>
                  {b.seller && <><span>·</span><span className="bm__card-company">{b.seller.legalName}</span></>}
                </div>
              </div>
              <button className="bm__btn-edit" onClick={() => openEdit(b)}>Edit</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FField({ label, fkey, placeholder, required, form, set }) {
  const hasError = required && !form[fkey];
  return (
    <div className="bm__field">
      <label className="bm__label">
        {label}{required && <span className="bm__star"> *</span>}
      </label>
      <input
        type="text"
        className={`bm__input${hasError ? " bm__input--error" : ""}`}
        placeholder={placeholder}
        value={form[fkey] || ""}
        onChange={e => set(fkey, e.target.value)}
      />
    </div>
  );
}
