// OrderSection/Payment.jsx (No Icons Version)
import React from "react";

function Payment({ 
  paymentDetails, 
  setPaymentDetails, 
  vatRate, 
  setVatRate,
  transactionType,
  setTransactionType
}) {
  const { mode: paymentMode, paymentTerm } = paymentDetails;

  // Payment mode options
  const paymentOptions = [
    { 
      id: "CASH", 
      label: "Cash",
      color: "bg-green-50 border-green-200 text-green-700",
      activeColor: "bg-green-100 border-green-500 text-green-800",
      hoverColor: "hover:bg-green-100",
    },
    { 
      id: "CREDIT", 
      label: "Credit",
      color: "bg-blue-50 border-blue-200 text-blue-700",
      activeColor: "bg-blue-100 border-blue-500 text-blue-800",
      hoverColor: "hover:bg-blue-100",
    },
    { 
      id: "DEBIT", 
      label: "Debit",
      color: "bg-purple-50 border-purple-200 text-purple-700",
      activeColor: "bg-purple-100 border-purple-500 text-purple-800",
      hoverColor: "hover:bg-purple-100",
      
    }
  ];

  // Transaction type options
  const transactionTypeOptions = [
    { 
      id: "B2B", 
      label: "B2B", 
    
      color: "bg-blue-50 border-blue-200",
      activeColor: "bg-blue-100 border-blue-500",
     
    },
    { 
      id: "B2C", 
      label: "B2C", 
            color: "bg-green-50 border-green-200",
      activeColor: "bg-green-100 border-green-500",
     
    },
    { 
      id: "B2G", 
      label: "B2G", 
      color: "bg-amber-50 border-amber-200",
      activeColor: "bg-amber-100 border-amber-500",
   
    },
    { 
      id: "G2G", 
      label: "G2G", 
      color: "bg-violet-50 border-violet-200",
      activeColor: "bg-violet-100 border-violet-500",
    }
  ];

  return (
    <div className="bg-gray-50 p-4 rounded-lg text-sm">
      <h3 className="font-bold mb-3 text-base">Transaction & Payment Details</h3>
      
      {/* Transaction Type Cards */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Transaction Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {transactionTypeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setTransactionType(option.id)}
              className={`flex items-start p-3 border rounded-lg transition-all duration-200 ${
                transactionType === option.id 
                  ? `${option.activeColor} shadow-sm` 
                  : option.color
              } hover:shadow-md`}
            >
              <span className="text-lg mr-2">{option.badge}</span>
              <div className="text-left">
                <div className="font-semibold">{option.label}</div>
                <div className="text-xs text-gray-600 mt-1">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {transactionTypeOptions.find(opt => opt.id === transactionType)?.requirements}
        </p>
      </div>

      {/* Payment Mode Cards */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Payment Mode
        </label>
        <div className="grid grid-cols-3 gap-3">
          {paymentOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setPaymentDetails(p => ({ ...p, mode: option.id }))}
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all duration-200 ${
                paymentMode === option.id 
                  ? `${option.activeColor} border-2 shadow-md scale-[1.02]` 
                  : `${option.color} border`
              } ${option.hoverColor} hover:shadow-sm`}
            >
              <div className="text-2xl mb-2">{option.badge}</div>
              <div className="font-semibold text-center">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Term and VAT Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Term */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Payment Term
          </label>
          <select
            value={paymentTerm}
            onChange={(e) =>
              setPaymentDetails(p => ({ ...p, paymentTerm: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="IMMEDIATE">Immediate</option>
            <option value="Term0">Term0</option>
            <option value="Term1">Term1</option>
          </select>
        </div>

        {/* VAT Rate Buttons */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            VAT Rate (%)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setVatRate(0)}
              className={`p-3 border rounded-lg text-center transition-all ${
                vatRate === 0 
                  ? "bg-red-100 border-red-500 text-red-800 font-semibold shadow-sm" 
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              0%<span className="block text-xs mt-1"></span>
            </button>
            <button
              type="button"
              onClick={() => setVatRate(10)}
              className={`p-3 border rounded-lg text-center transition-all ${
                vatRate === 10 
                  ? "bg-amber-100 border-amber-500 text-amber-800 font-semibold shadow-sm" 
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              10%<span className="block text-xs mt-1"></span>
            </button>
            <button
              type="button"
              onClick={() => setVatRate(15)}
              className={`p-3 border rounded-lg text-center transition-all ${
                vatRate === 15 
                  ? "bg-blue-100 border-blue-500 text-blue-800 font-semibold shadow-sm" 
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              15%<span className="block text-xs mt-1"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Transaction:</span>
            <span className="font-semibold">
              {transactionTypeOptions.find(opt => opt.id === transactionType)?.label} • 
              {transactionTypeOptions.find(opt => opt.id === transactionType)?.description}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Payment:</span>
            <span className="font-semibold">
              {paymentOptions.find(opt => opt.id === paymentMode)?.label}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">VAT:</span>
            <span className="font-semibold">{vatRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;