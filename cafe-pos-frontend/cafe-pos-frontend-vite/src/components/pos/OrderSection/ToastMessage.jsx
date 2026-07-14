// OrderSection/ToastMessage.jsx
import React from "react";

function ToastMessage({ toast }) {
  if (!toast) return null;

  return (
    <div className={`p-2 rounded-md text-sm ${
      toast.type === "error" 
        ? "bg-red-100 text-red-800 border border-red-200" 
        : "bg-green-100 text-green-800 border border-green-200"
    }`}>
      {toast.text}
    </div>
  );
}

export default ToastMessage;