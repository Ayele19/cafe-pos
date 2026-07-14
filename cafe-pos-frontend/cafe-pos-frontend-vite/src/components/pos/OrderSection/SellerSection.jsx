// OrderSection/SellerSection.jsx
import React from "react";

function SellerSection({ sellerInfo, setSellerInfo, sellersList }) {
  return (
    <div className="flex items-center space-x-2">
      <label className="font-medium text-sm">Seller:</label>
      <select
        value={sellerInfo.id || ""}
        onChange={(e) => {
          const seller = sellersList.find(s => s.id === Number(e.target.value));
          setSellerInfo(seller || sellersList[0]);
        }}
        className="border rounded px-2 py-1 w-full max-w-xs text-sm"
      >
        {sellersList.map((seller) => (
          <option key={seller.id} value={seller.id}>
            {seller.legalName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SellerSection;