import React, { useState, useEffect } from "react";
import { buyerService } from "../../services/api";
import { Can } from "../../auth/Can";
import { PERMISSIONS } from "../../auth/permissions";
import "../../style/CustomerManagement.css";

const EMPTY = { id: null, legalName: "", phone: "", email: "", tin: "", vatNumber: "", region: "", city: "", wereda: "" };

function CustomerManagement() {
  const [buyers, setBuyers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await buyerService.getBuyers();
      setBuyers(res.data || []);
    } catch { showToast("Failed to load customers", "error"); }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const openAdd  = () => { setForm(EMPTY); setShowForm(true); };
  const openEdit = (b) => { setForm({ ...b }); setShowForm(true); };
  const cancel   = () => { setForm(EMPTY); setShowForm(false); };

  const save = async () => {
    if (!form.legalName.trim()) { showToast("Name is required", "error"); return; }
    setSaving(true);
    try {
      let res;
      if (form.id) {
        res = await buyerService.updateBuyer(form.id, form);
        setBuyers(prev => prev.map(b => b.id === res.data.id ? res.data : b));
        showToast("Customer updated");
      } else {
        res = await buyerService.saveBuyer(form);
        setBuyers(prev => [...prev, res.data]);
        showToast("Customer added");
      }
      cancel();
    } catch (e) {
      showToast(e.response?.data?.message || "Failed to save", "error");
    } finally { setSaving(false); }
  };

  const confirmDelete = async id => {
    try {
      await buyerService.deleteBuyer(id);
      setBuyers(prev => prev.filter(b => b.id !== id));
      setDeleteId(null);
      showToast("Customer deleted");
    } catch { showToast("Failed to delete", "error"); }
  };

  const filtered = buyers.filter(b =>
    !search ||
    b.legalName?.toLowerCase().includes(search.toLowerCase()) ||
    b.phone?.includes(search) ||
    b.email?.toLowerCase().includes(search.toLowerCase()) ||
    b.tin?.includes(search)
  );

  return (
    <div className="cust">

      {toast && (
        <div className={`cust__toast cust__toast--${toast.type}`}>
          {toast.type === "error" ? "✗" : "✓"} {toast.msg}
        </div>
      )}

      {deleteId && (
        <div className="cust__modal-overlay">
          <div className="cust__modal">
            <div className="cust__modal-emoji">🗑️</div>
            <h3 className="cust__modal-title">Delete Customer?</h3>
            <p className="cust__modal-sub">This action cannot be undone.</p>
            <div className="cust__modal-actions">
              <button className="cust__btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="cust__btn-delete" onClick={() => confirmDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="cust__header">
        <div>
          <h2 className="cust__title">👤 Customers</h2>
          <p className="cust__subtitle">{buyers.length} registered customers</p>
        </div>
        <div className="cust__header-actions">
          <input type="text" className="cust__search" placeholder="🔍 Search by name, phone, TIN…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <Can permission={PERMISSIONS.CUSTOMER_WRITE}>
            <button className="cust__btn-add" onClick={openAdd}>+ Add Customer</button>
          </Can>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="cust__form-card">
          <div className="cust__form-header">
            <span>{form.id ? "Edit Customer" : "New Customer"}</span>
            <span className="cust__required-note"><span className="cust__star">*</span> required</span>
          </div>
          <div className="cust__form-grid">
            <div className="cust__field cust__field--full">
              <FField label="Full Name / Company" fkey="legalName" placeholder="e.g. Abebe Kebede" required form={form} set={set} />
            </div>
            <FField label="Phone"      fkey="phone"     placeholder="e.g. 0911000000" required form={form} set={set} />
            <FField label="Email"      fkey="email"     placeholder="e.g. abebe@gmail.com"        form={form} set={set} />
            <FField label="TIN"        fkey="tin"       placeholder="e.g. 0011223344"             form={form} set={set} />
            <FField label="VAT Number" fkey="vatNumber" placeholder="e.g. 123456789"              form={form} set={set} />
            <FField label="Region"     fkey="region"    placeholder="e.g. 14"                     form={form} set={set} />
            <FField label="City"       fkey="city"      placeholder="e.g. Addis Ababa"            form={form} set={set} />
            <FField label="Wereda"     fkey="wereda"    placeholder="e.g. 05"                     form={form} set={set} />
          </div>
          <div className="cust__form-actions">
            <button className="cust__btn-form-cancel" onClick={cancel}>Cancel</button>
            <button className="cust__btn-save" onClick={save} disabled={saving}>
              {saving ? "Saving…" : form.id ? "Update Customer" : "Save Customer"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="cust__empty">
          <div className="cust__empty-icon">👤</div>
          <p>{search ? "No customers match your search" : 'No customers yet. Click "+ Add Customer" to start.'}</p>
        </div>
      ) : (
        <table className="cust__table">
          <thead>
            <tr>
              {["Name","Phone","Email","TIN","City","Actions"].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td className="cust__td-name">{b.legalName}</td>
                <td>{b.phone || "—"}</td>
                <td className="cust__td-secondary">{b.email || "—"}</td>
                <td className="cust__td-mono">{b.tin || "—"}</td>
                <td>{b.city || "—"}</td>
                <td>
                  <div className="cust__row-actions">
                    <Can permission={PERMISSIONS.CUSTOMER_WRITE}>
                      <button className="cust__btn-edit" onClick={() => openEdit(b)}>Edit</button>
                    </Can>
                    <Can permission={PERMISSIONS.CUSTOMER_DELETE}>
                      <button className="cust__btn-del" onClick={() => setDeleteId(b.id)}>Delete</button>
                    </Can>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function FField({ label, fkey, placeholder, required, form, set }) {
  return (
    <div className="cust__field">
      <label className="cust__label">{label}{required && <span className="cust__star"> *</span>}</label>
      <input type="text" className={`cust__input${required && !form[fkey] ? " cust__input--error" : ""}`}
        placeholder={placeholder} value={form[fkey] || ""} onChange={e => set(fkey, e.target.value)} />
    </div>
  );
}

export default CustomerManagement;
