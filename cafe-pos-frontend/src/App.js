import React from "react";
import { Routes, Route } from "react-router-dom";
import POS from "./pages/POS";
import Receipt from "./pages/Receipt";

function App() {
  return (
    <Routes>
      {/* POS Page */}
      <Route path="/" element={<POS />} />

      {/* Receipt Page */}
      <Route path="/receipt" element={<Receipt />} />
    </Routes>
  );
}

export default App;
