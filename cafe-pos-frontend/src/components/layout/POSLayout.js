import React from "react";
import MenuSection from "./MenuSection";
import OrderSection from "./OrderSection";
import Header from "./Header";
import "./POSLayout.css";

function POSLayout() {
  return (
    <div className="pos-container">
      <Header />
      <div className="pos-body">
        <div className="menu-area">
          <MenuSection />
        </div>
        <div className="order-area">
          <OrderSection />
        </div>
      </div>
    </div>
  );
}

export default POSLayout;
