import React from "react";
import "../../../style/ToastMessage.css";

function ToastMessage({ toast }) {
  if (!toast) return null;
  const type = toast.type || "info";
  return (
    <div className={`toast-msg toast-msg--${type}`}>
      {type === "error" ? "✗" : type === "success" ? "✓" : "ℹ"} {toast.text}
    </div>
  );
}

export default ToastMessage;
