import React from "react";
import MenuSection from "../pos/MenuSection/MenuSection";
import OrderSection from "../pos/OrderSection/OrderSection";
import RightSidebar from "./RightSidebar";
import MenuManagement from "../common/MenuManagement";
import SavedOrdersSection from "../common/SavedOrdersSection";
import CustomerManagement from "../common/CustomerManagement";

function POSLayout({
  activeSection,
  setActiveSection,
  menuItems,
  setMenuItems,
  selectedItems,
  setSelectedItems,
  buyers,
  setBuyers,
  selectedBuyer,
  setSelectedBuyer,
  sellers,
  setSellers,
  selectedSeller,
  setSelectedSeller,
  vatRate,
  setVatRate,
  paymentDetails,
  setPaymentDetails,
  invoiceCounter,
  setInvoiceCounter
}) {
  return (
    <div className="pos-container" style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <RightSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="pos-body" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Body */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Menu + Order Sections */}
          {activeSection === "menu" && (
            <>
              <div style={{ flex: 2, overflowY: "auto" }}>
                <MenuSection
                  menuItems={menuItems}
                  setMenuItems={setMenuItems}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
              </div>

              <div style={{ flex: 1, overflowY: "auto" }}>
                <OrderSection
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  selectedBuyer={selectedBuyer}
                  setSelectedBuyer={setSelectedBuyer}
                  buyers={buyers}
                  setBuyers={setBuyers}
                  selectedSeller={selectedSeller}
                  setSelectedSeller={setSelectedSeller}
                  sellers={sellers}
                  setSellers={setSellers}
                  vatRate={vatRate}
                  setVatRate={setVatRate}
                  paymentDetails={paymentDetails}
                  setPaymentDetails={setPaymentDetails}
                  invoiceCounter={invoiceCounter}
                  setInvoiceCounter={setInvoiceCounter}
                />
              </div>
            </>
          )}

          {/* Saved Orders */}
          {activeSection === "savedOrders" && (
            <div style={{ flex: 1, overflowY: "auto" }}>
              <SavedOrdersSection />
            </div>
          )}

          {/* Menu Management */}
          {activeSection === "manageMenu" && (
            <div style={{ flex: 1, overflowY: "auto" }}>
              <MenuManagement />
            </div>
          )}

          {/* Customer Management */}
        {activeSection === "manageCustomers" && (
  <div style={{ flex: 1, overflowY: "auto" }}>
    <CustomerManagement />
  </div>
)}

          )

        </div>
      </div>
    </div>
  );
}

export default POSLayout;
