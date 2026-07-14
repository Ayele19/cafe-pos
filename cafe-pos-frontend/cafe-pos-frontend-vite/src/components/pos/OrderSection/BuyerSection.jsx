// OrderSection/BuyerSection.jsx
import React from "react";

function BuyerSection({
  selectedBuyer,
  setSelectedBuyer,
  buyers,
  showBuyerForm,
  setShowBuyerForm,
  saveBuyer,
  isSavingBuyer,
  initialBuyer
}) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <label className="font-medium text-sm">Buyer:</label>
        <select
          value={selectedBuyer?.id || ""}
          onChange={(e) => {
            const buyer = buyers.find(b => b.id === Number(e.target.value));
            setSelectedBuyer(buyer || initialBuyer);
          }}
          className="border rounded px-2 py-3 w-full max-w-xs text-sm"
        >
          <option value="">-- New Buyer --</option>
          {buyers.map((buyer) => (
            <option key={buyer.id} value={buyer.id}>
              {buyer.legalName} ({buyer.tin})
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowBuyerForm(!showBuyerForm)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        >
          {showBuyerForm ? "Close" : "Add Buyer"}
        </button>
      </div>

      {showBuyerForm && selectedBuyer && (
        <div className="border p-3 rounded-lg bg-gray-50 space-y-2 text-sm">
          <h3 className="font-bold">Buyer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(selectedBuyer)
              .filter(([key]) => key !== 'id')
              .map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    placeholder={key}
                    value={value || ""}
                    onChange={(e) =>
                      setSelectedBuyer({
                        ...selectedBuyer,
                        [key]: e.target.value
                      })
                    }
                    className="w-full border rounded px-2 py-2 text-sm"
                  />
                </div>
              ))}
          </div>
          <button
            onClick={saveBuyer}
            disabled={isSavingBuyer}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 text-sm"
          >
            {isSavingBuyer ? "Saving..." : "Save Buyer"}
          </button>
        </div>
      )}
    </>
  );
}

export default BuyerSection;