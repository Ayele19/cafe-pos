import React from "react";
import "../../../style/ActionButtons.css";

function ActionButtons({ onSave, onCancel, loading, disabled }) {
  return (
    <div className="ab">
      <button className="ab__clear" onClick={onCancel}>Clear</button>
      <button className="ab__submit" onClick={onSave} disabled={disabled || loading}>
        {loading ? <><span className="ab__spinner" /> Processing…</> : "⚡ Register Invoice"}
      </button>
    </div>
  );
}

export default ActionButtons;
