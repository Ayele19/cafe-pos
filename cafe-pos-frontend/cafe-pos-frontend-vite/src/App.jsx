import React, { useState, useEffect } from "react";
import Receipt from "./pages/Receipt";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  menuService,
  orderService,
  buyerService,
  sellerService,
  systemService,
} from "./services/api";

import MenuSection from "./components/pos/MenuSection/MenuSection";
import OrderSection from "./components/pos/OrderSection/OrderSection";
import RightSidebar from "./components/layout/RightSidebar.jsx";
import MenuManagement from "./components/common/MenuManagement.jsx";

const defaultSeller = {
  City: "101",
  Email: "ayele.a@insa.gov.et",
  HouseNumber: "101",
  LegalName: "Ayel Asmamaw",
  Phone: "0939019257",
  Region: "1",
  Tin: "0090004390",
  VatNumber: "43256663343256663322",
  Wereda: "13",
};

function POSLayout() {
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("menu");
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [savedOrders, setSavedOrders] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [vatRate, setVatRate] = useState(15);
  const [paymentDetails, setPaymentDetails] = useState({
    mode: "CASH",
    paymentTerm: "IMMEDIATE",
  });
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  const [invoiceCounter, setInvoiceCounter] = useState(1);
  const [sellers, setSellers] = useState([defaultSeller]);
  const [selectedSeller, setSelectedSeller] = useState(defaultSeller);

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveSection("menu");
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [menuRes, buyerRes, sellerRes, counterRes] = await Promise.all([
          menuService.getMenuItems(),
          buyerService.getBuyers(),
          sellerService.getSellers(),
          systemService.getNextInvoiceCounter(),
        ]);

        setMenuItems(menuRes.data || []);
        setBuyers(buyerRes.data || []);
        if (sellerRes.data?.length > 0) {
          setSellers([defaultSeller, ...sellerRes.data]);
        }
        setInvoiceCounter(counterRes.data?.counter || 1);
      } catch (err) {
        console.error("Initial fetch error:", err);
      }
    };
    fetchInitial();
  }, []);

  useEffect(() => {
    if (activeSection !== "savedOrders") return;

    const loadOrders = async () => {
      try {
        const res = await orderService.getOrders();
        setSavedOrders(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadOrders();
  }, [activeSection]);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const loadOrder = (order) => {
    setSelectedBuyer(order.buyerInfo || null);
    setSelectedSeller(order.sellerInfo || defaultSeller);
    setSelectedItems(
      order.items.map((i) => ({
        id: i.menuItemId,
        name: i.productDescription,
        price: i.unitPrice,
        quantity: i.quantity,
      }))
    );
    setVatRate(order.vatPercentage || 15);
    setPaymentDetails(
      order.paymentDetails || { mode: "CASH", paymentTerm: "IMMEDIATE" }
    );
    setActiveSection("menu");
  };

  const incrementInvoiceCounter = () =>
    setInvoiceCounter((prev) => (prev || 1) + 1);

  return (
    <div className="main-container" style={{ display: "flex", height: "100vh" }}>
      <div className="sidebar" style={{ width: "220px" }}>
        <RightSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </div>

      <div
        className="content-container"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "10px",
        }}
      >
        {activeSection === "menu" && (
          <div style={{ display: "flex", gap: "10px", height: "100%" }}>
            <div className="menu-section scrollable" style={{ flex: 2 }}>
              <MenuSection
                menuItems={menuItems}
                setMenuItems={setMenuItems}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            </div>

            <div className="order-section scrollable" style={{ flex: 1 }}>
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
                setInvoiceCounter={incrementInvoiceCounter}
              />
            </div>
          </div>
        )}

        {activeSection === "savedOrders" && (
          <div style={{ flex: 1 }}>
            <h2 className="text-xl font-bold mb-3">Saved Orders</h2>
            {savedOrders.length === 0 ? (
              <p>No saved orders found.</p>
            ) : (
              <p>Orders loaded successfully</p>
            )}
          </div>
        )}

        {activeSection === "manageMenu" && (
          <div style={{ flex: 1 }}>
            <h2 className="text-xl font-bold mb-3">Menu Management</h2>
            <MenuManagement />
          </div>
        )}
      </div>
    </div>
  );
}

function App({ keycloak }) {
  const logout = () => {
    keycloak.logout();
  };

  return (
    <div>

      {/* Top Login Bar */}
      <div
        style={{
          background: "#111",
          color: "#fff",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          Logged in: {keycloak?.tokenParsed?.preferred_username}
        </span>

        <button onClick={logout}>Logout</button>
      </div>

      <Routes>
        <Route path="/" element={<POSLayout />} />
        <Route path="/receipt" element={<Receipt />} />
      </Routes>

    </div>
  );
}

export default App;