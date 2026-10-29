import React, { useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8080/api/public" });

const STEPS = [
  { label: "Company Info" },
  { label: "Admin Account" },
  { label: "Done" },
];

const INITIAL = {
  // Company
  legalName: "", tin: "", vatNumber: "", email: "",
  phone: "", region: "", city: "", wereda: "", houseNumber: "",
  // Account
  username: "", password: "", confirmPassword: "",
};

export default function Register({ onGoToLogin }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const validateStep0 = () => {
    if (!form.legalName.trim()) return "Company name is required";
    if (!form.tin.trim()) return "TIN is required";
    if (!form.vatNumber.trim()) return "VAT Number is required";
    if (!form.email.trim() || !form.email.includes("@")) return "Valid email is required";
    if (!form.phone.trim()) return "Phone is required";
    if (!form.region.trim()) return "Region is required";
    return null;
  };

  const validateStep1 = () => {
    if (!form.username.trim()) return "Username is required";
    if (form.username.includes(" ")) return "Username must not contain spaces";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  };

  const next = () => {
    setError("");
    if (step === 0) {
      const err = validateStep0();
      if (err) { setError(err); return; }
    }
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
      submit();
      return;
    }
    setStep(s => s + 1);
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/register", {
        legalName: form.legalName,
        tin: form.tin,
        vatNumber: form.vatNumber,
        email: form.email,
        phone: form.phone,
        region: form.region,
        city: form.city,
        wereda: form.wereda,
        houseNumber: form.houseNumber,
        username: form.username,
        password: form.password,
      });
      setStep(2);
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "520px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1b6375, #1fdf85)",
          padding: "24px",
          textAlign: "center",
          color: "#fff"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "4px" }}>☕</div>
          <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: 0 }}>CafePOS</h1>
          <p style={{ fontSize: "13px", opacity: 0.85, marginTop: "4px" }}>
            Register your business to get started
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{
              flex: 1,
              padding: "12px",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: i === step ? "700" : "400",
              color: i === step ? "#1b6375" : i < step ? "#1fdf85" : "#9ca3af",
              borderBottom: i === step ? "2px solid #1b6375" : "2px solid transparent",
              transition: "all 0.2s"
            }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: i < step ? "#1fdf85" : i === step ? "#1b6375" : "#e5e7eb",
                color: i <= step ? "#fff" : "#6b7280",
                fontSize: "11px",
                fontWeight: "bold",
                marginRight: "6px"
              }}>{i < step ? "✓" : i + 1}</span>
              {s.label}
            </div>
          ))}
        </div>

        <div style={{ padding: "24px" }}>
          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: "8px",
              padding: "10px 14px",
              color: "#dc2626",
              fontSize: "13px",
              marginBottom: "16px"
            }}>
              {error}
            </div>
          )}

          {/* Step 0 — Company Info */}
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "#111827" }}>
                Company Details
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Company Name" required col2
                  value={form.legalName} onChange={v => set("legalName", v)}
                  placeholder="e.g. ABC Cafe PLC" />
                <Field label="TIN" required
                  value={form.tin} onChange={v => set("tin", v)}
                  placeholder="e.g. 0090004390" />
                <Field label="VAT Number" required
                  value={form.vatNumber} onChange={v => set("vatNumber", v)}
                  placeholder="e.g. 43256663..." />
                <Field label="Email" required
                  value={form.email} onChange={v => set("email", v)}
                  placeholder="info@company.com" />
                <Field label="Phone" required
                  value={form.phone} onChange={v => set("phone", v)}
                  placeholder="e.g. 0911000000" />
                <Field label="Region" required
                  value={form.region} onChange={v => set("region", v)}
                  placeholder="e.g. 14" />
                <Field label="City"
                  value={form.city} onChange={v => set("city", v)}
                  placeholder="e.g. Addis Ababa" />
                <Field label="Wereda"
                  value={form.wereda} onChange={v => set("wereda", v)}
                  placeholder="e.g. 05" />
              </div>
            </div>
          )}

          {/* Step 1 — Admin Account */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px", color: "#111827" }}>
                Create Admin Account
              </h2>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "16px" }}>
                This account will be the administrator for <strong>{form.legalName}</strong>.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Field label="Username" required
                  value={form.username} onChange={v => set("username", v)}
                  placeholder="e.g. abebe.kebede" />
                <Field label="Password" required type="password"
                  value={form.password} onChange={v => set("password", v)}
                  placeholder="Min. 6 characters" />
                <Field label="Confirm Password" required type="password"
                  value={form.confirmPassword} onChange={v => set("confirmPassword", v)}
                  placeholder="Repeat password" />
              </div>
            </div>
          )}

          {/* Step 2 — Success */}
          {step === 2 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "52px", marginBottom: "12px" }}>🎉</div>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
                Registration Successful!
              </h2>
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "6px" }}>
                <strong>{form.legalName}</strong> is now registered on CafePOS.
              </p>
              <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "24px" }}>
                Log in with username <strong>{form.username}</strong> to set up your branches and cashiers.
              </p>
              <button
                onClick={onGoToLogin}
                style={{
                  background: "#1b6375",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 32px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  width: "100%"
                }}>
                Go to Login →
              </button>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 2 && (
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {step > 0 && (
                <button
                  onClick={() => { setStep(s => s - 1); setError(""); }}
                  style={{
                    flex: 1,
                    padding: "11px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    background: "#fff",
                    fontSize: "14px",
                    cursor: "pointer",
                    color: "#374151"
                  }}>
                  ← Back
                </button>
              )}
              <button
                onClick={next}
                disabled={loading}
                style={{
                  flex: 2,
                  padding: "11px",
                  background: loading ? "#9ca3af" : "#1b6375",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer"
                }}>
                {loading ? "Registering…" : step === 1 ? "Complete Registration" : "Next →"}
              </button>
            </div>
          )}

          {/* Login link */}
          {step < 2 && (
            <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#6b7280" }}>
              Already registered?{" "}
              <button
                onClick={onGoToLogin}
                style={{
                  background: "none", border: "none",
                  color: "#1b6375", fontWeight: "600",
                  cursor: "pointer", fontSize: "13px"
                }}>
                Log in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, value, onChange, placeholder, type = "text", col2 }) {
  return (
    <div style={{ gridColumn: col2 ? "1 / -1" : undefined }}>
      <label style={{
        display: "block",
        fontSize: "12px",
        fontWeight: "600",
        color: "#374151",
        marginBottom: "4px"
      }}>
        {label}
        {required && <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          border: required && !value ? "1px solid #fca5a5" : "1px solid #d1d5db",
          borderRadius: "8px",
          padding: "9px 12px",
          fontSize: "13px",
          background: required && !value ? "#fef2f2" : "#fff",
          outline: "none",
          boxSizing: "border-box"
        }}
        onFocus={e => e.target.style.borderColor = "#1b6375"}
        onBlur={e => e.target.style.borderColor = required && !value ? "#fca5a5" : "#d1d5db"}
      />
    </div>
  );
}
