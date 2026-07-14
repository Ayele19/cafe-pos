// OrderSection/ActionButtons.jsx
import React from "react";

function ActionButtons({ onSave, onCancel, loading, disabled }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onSave}
        disabled={disabled || loading}
        className="flex-1 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm"
      >
        {loading ? "Saving..." : "Save Order"}
      </button>
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-300 transition text-sm"
      >
        Cancel
      </button>
    </div>
  );
}

export default ActionButtons;