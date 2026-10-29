import React, { useState, useEffect } from "react";
import { sellerService } from "../../services/api";
import "../../style/SellerManagement.css";

const EMPTY = {
  legalName: "", tin: "", vatNumber: "", email: "",
  phone: "", region: "", city: "", wereda: "", houseNumber: "", subCity: "", locality: ""
};

const FIELDS = [
  { key: "legalName",   label: "Company Name",  required: true,  placeholder: "e.g. ABC Trading PLC", full: true },
  { key: "tin",         label: "TIN",           required: true,  placeholder: "e.g. 0090004390" },
  { key: "vatNumber",   label: "VAT Number",    required: true,  placeholder: "e.g. 43256663..." },
  { key: "email",       label: "Email",         required: true,  placeholder: "info@company.com" },
  { key: "phone",       label: "Phone",         required: true,  placeholder: "e.g. 0911000000" },
  { key: "region",      label: "Region",        required: true,  placeholder: "e.g. 14" },
  { key: "city",        label: "City",          required: false, placeholder: "e.g. Addis Ababa" },
  { key: "wereda",      label: "Wereda",        required: false, placeholder: "e.g. 05" },
  { key: "houseNumber", label: "House Number",  required: false, placeholder: "e.g. 101" },
  { key: "subCity",     label: "Sub City",      required: false, placeholder: "e.g. Bole" },
  { key: "locality",    label: "Locality",      required: false, placeholder: "e.g. Near Stadium" },
];

export default function SellerManagement() {
  const [sellers, setSellers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = () => {
    sellerService.getSellers().then(r => setSellers(r.data || [])).catch(console.error);
  };

  const openAdd = () => { setForm(EMPTY); setEditId(null); setError(""); setShowForm(true); };
  const openEdit = s => {
    setForm({ legalName: s.legalName||"", tin: s.tin||"", vatNumber: s.vatNumber||"", email: s.email||"",
      phone: s.phone||"", region: s.region||"", city: s.city||"", wereda: s.wereda||"",
      houseNumber: s.houseNumber||"", subCity: s.subCity||"", locality: s.locality||"" });
    setEditId(s.id); setError(""); setShowForm(true);
  };
  const cancel = () => { setForm(EMPTY); setEditId(null); setShowForm(false); setError(""); };

  const save = async () => {
    const missing = FIELDS.filter(f => f.required && !form[f.key]).map(f => f.label);
    if (missing.length) { setError(`Required: ${missing.join(", ")}`); return; }
    setSaving(true);
    try {
      if (editId) {
        await sellerService.updateSeller(editId, form);
      } else {
        await sellerService.saveSeller(form);
      }
      cancel(); load();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save company");
    } finally { setSaving(false); }
  };

  return (
    <div className="sm">
      <div className="sm__header">
        <div>
          <h2 className="sm__title">Companies</h2>
          <p className="sm__subtitle">Each company represents a business registered on this system.</p>
        </div>
        <button className="sm__btn-add" onClick={showForm ? cancel : openAdd}>
          {showForm ? "Cancel" : "+ Register Company"}
        </button>
      </div>

      {showForm && (
        <div className="sm__form-card">
          <div className="sm__form-header">
            <span>{editId ? "Edit Company" : "Register New Company"}</span>
            <span className="sm__required-note"><span className="sm__star">*</span> required</span>
          </div>
          {error && <div className="sm__error">{error}</div>}
          <div className="sm__form-grid">
            {FIELDS.map(f => (
              <div key={f.key} className={`sm__field${f.full ? " sm__field--full" : ""}`}>
                <label className="sm__label">
                  {f.label}{f.required && <span className="sm__star"> *</span>}
                </label>
                <input type="text" className={`sm__input${f.required && !form[f.key] ? " sm__input--error" : ""}`}
                  placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div className="sm__form-actions">
            <button className="sm__btn-cancel" onClick={cancel}>Cancel</button>
            <button className="sm__btn-save" onClick={save} disabled={saving}>
              {saving ? "Saving…" : editId ? "Update Company" : "Register Company"}
            </button>
          </div>
        </div>
      )}

      <div className="sm__list">
        {sellers.length === 0 ? (
          <div className="sm__empty">
            <div className="sm__empty-icon">🏢</div>
            <p>No companies registered yet.</p>
            <p>Click "Register Company" to add the first one.</p>
          </div>
        ) : sellers.map(s => (
          <div key={s.id} className="sm__card">
            <div className="sm__card-top">
              <div>
                <div className="sm__card-name">{s.legalName}</div>
                <div className="sm__card-tags">
                  <span className="sm__card-tag">TIN: <span>{s.tin}</span></span>
                  <span className="sm__card-tag">VAT: <span>{s.vatNumber}</span></span>
                  {s.phone && <span className="sm__card-tag">📞 {s.phone}</span>}
                  {s.email && <span className="sm__card-tag">✉ {s.email}</span>}
                </div>
                {(s.city || s.region) && (
                  <div className="sm__card-address">
                    📍 {[s.city, s.region, s.wereda].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
              <button className="sm__btn-edit" onClick={() => openEdit(s)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
