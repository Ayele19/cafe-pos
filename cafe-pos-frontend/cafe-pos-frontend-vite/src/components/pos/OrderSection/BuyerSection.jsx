// OrderSection/BuyerSection.jsx
import React, { useState } from "react";

const WALKING_ID = "walking";

const FIELD_CONFIG = [
  { key: "legalName",   label: "Full Name",    required: ["B2B","B2C","B2G"], placeholder: "e.g. Abebe Kebede" },
  { key: "phone",       label: "Phone",        required: ["B2B","B2C","B2G"], placeholder: "e.g. 0911000000" },
  { key: "email",       label: "Email",        required: [],                  placeholder: "e.g. abebe@gmail.com" },
  { key: "tin",         label: "TIN",          required: ["B2B","B2G"],       placeholder: "e.g. 0011223344" },
  { key: "vatNumber",   label: "VAT Number",   required: ["B2B","B2G"],       placeholder: "e.g. 123456789" },
  { key: "idType",      label: "ID Type",      required: [],                  placeholder: "KID / NID / PST …", type: "select",
    options: ["KID","NID","SID","WID","PST","DLS","MRS"] },
  { key: "idNumber",    label: "ID Number",    required: [],                  placeholder: "e.g. 11122233344" },
  { key: "region",      label: "Region",       required: [],                  placeholder: "e.g. 14" },
  { key: "city",        label: "City",         required: [],                  placeholder: "e.g. Addis Ababa" },
  { key: "wereda",      label: "Wereda",       required: [],                  placeholder: "e.g. 05" },
  { key: "kebele",      label: "Kebele",       required: [],                  placeholder: "e.g. 03" },
  { key: "zone",        label: "Zone",         required: [],                  placeholder: "e.g. SHA" },
  { key: "houseNumber", label: "House No.",    required: [],                  placeholder: "e.g. 101" },
  { key: "country",     label: "Country",      required: [],                  placeholder: "e.g. 70" },
];

function Field({ cfg, value, onChange, txType }) {
  const required = cfg.required.includes(txType);
  const empty    = !value || String(value).trim() === "";
  const invalid  = required && empty;

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {cfg.label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {cfg.type === "select" ? (
        <select
          value={value || ""}
          onChange={e => onChange(cfg.key, e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
            ${invalid ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}`}
        >
          <option value="">— select —</option>
          {cfg.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type="text"
          placeholder={cfg.placeholder}
          value={value || ""}
          onChange={e => onChange(cfg.key, e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
            ${invalid ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}`}
        />
      )}
    </div>
  );
}

function BuyerSection({
  selectedBuyer,
  setSelectedBuyer,
  buyers,
  showBuyerForm,
  setShowBuyerForm,
  saveBuyer,
  isSavingBuyer,
  initialBuyer,
  walkingCustomer,
  setTransactionType,
  transactionType
}) {
  const isWalking = selectedBuyer?.id === WALKING_ID;
  const [tab, setTab] = useState("basic"); // "basic" | "address"

  const basicKeys   = ["legalName","phone","email","tin","vatNumber","idType","idNumber"];
  const addressKeys = ["region","city","wereda","kebele","zone","houseNumber","country"];

  const handleChange = (key, val) =>
    setSelectedBuyer(prev => ({ ...prev, [key]: val }));

  const missingRequired = FIELD_CONFIG
    .filter(f => f.required.includes(transactionType))
    .filter(f => !selectedBuyer?.[f.key])
    .map(f => f.label);

  return (
    <div className="space-y-2">
      {/* ── Buyer selector row ── */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Buyer:</label>

        <select
          value={selectedBuyer?.id ?? WALKING_ID}
          onChange={(e) => {
            const val = e.target.value;
            if (val === WALKING_ID) {
              setSelectedBuyer(walkingCustomer);
              setTransactionType("B2C");
              setShowBuyerForm(false);
            } else if (val === "new") {
              setSelectedBuyer(initialBuyer);
              setShowBuyerForm(true);
              setTab("basic");
            } else {
              const b = buyers.find(x => x.id === Number(val));
              if (b) {
                setSelectedBuyer(b);
                setTransactionType(b.tin ? "B2B" : "B2C");
              }
              setShowBuyerForm(false);
            }
          }}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={WALKING_ID}>🚶 Walking Customer</option>
          {buyers.map(b => (
            <option key={b.id} value={b.id}>
              {b.legalName}{b.tin ? ` · ${b.tin}` : b.phone ? ` · ${b.phone}` : ""}
            </option>
          ))}
          <option value="new">＋ New Buyer</option>
        </select>

        {!isWalking && selectedBuyer?.id !== null && (
          <button
            onClick={() => setShowBuyerForm(v => !v)}
            className="px-3 py-2 text-xs rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
          >
            {showBuyerForm ? "▲ Close" : "✏ Edit"}
          </button>
        )}
      </div>

      {/* ── Buyer form ── */}
      {showBuyerForm && !isWalking && (
        <div className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
            <span className="font-semibold text-gray-800 text-sm">
              {selectedBuyer?.id ? "Edit Buyer" : "New Buyer"}
            </span>
            <span className="text-xs text-gray-400">
              <span className="text-red-500">*</span> required
            </span>
          </div>

          {/* Tabs */}
          <div className="flex border-b text-sm">
            {["basic","address"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 font-medium transition
                  ${tab === t
                    ? "border-b-2 border-blue-500 text-blue-600 bg-white"
                    : "text-gray-500 hover:text-gray-700 bg-gray-50"}`}
              >
                {t === "basic" ? "👤 Basic Info" : "📍 Address"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="p-4 grid grid-cols-2 gap-3">
            {FIELD_CONFIG
              .filter(f => (tab === "basic" ? basicKeys : addressKeys).includes(f.key))
              .map(cfg => (
                <Field
                  key={cfg.key}
                  cfg={cfg}
                  value={selectedBuyer?.[cfg.key]}
                  onChange={handleChange}
                  txType={transactionType}
                />
              ))}
          </div>

          {/* Validation hint */}
          {missingRequired.length > 0 && (
            <div className="mx-4 mb-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
              Required: {missingRequired.join(", ")}
            </div>
          )}

          {/* Save button */}
          <div className="px-4 pb-4">
            <button
              onClick={saveBuyer}
              disabled={isSavingBuyer || missingRequired.length > 0}
              className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold
                hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {isSavingBuyer ? "Saving…" : "💾 Save Buyer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerSection;
