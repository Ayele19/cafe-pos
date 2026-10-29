import React, { useState, useEffect } from "react";
import Receipt from "./pages/Receipt";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  menuService, orderService, buyerService,
  sellerService, systemService, cashierService,
} from "./services/api";

import MenuSection      from "./components/pos/MenuSection/MenuSection";
import OrderSection     from "./components/pos/OrderSection/OrderSection";
import RightSidebar     from "./components/layout/RightSidebar.jsx";
import MenuManagement   from "./components/common/MenuManagement.jsx";
import CustomerManagement from "./components/common/CustomerManagement.jsx";
import SavedOrders      from "./components/common/SavedOrders.jsx";
import CashierManagement from "./components/common/CashierManagement.jsx";
import BranchManagement from "./components/common/BranchManagement.jsx";
import ReportPage       from "./components/common/ReportPage.jsx";
import SellerManagement from "./components/common/SellerManagement.jsx";
import VerifyInvoice    from "./components/common/VerifyInvoice.jsx";
import { useAuth }      from "./auth/AuthContext";
import { PERMISSIONS }  from "./auth/permissions";
import { Can }          from "./auth/Can";
import "./style/App.css";

function POSLayout() {
  const location = useLocation();
  const { hasPermission, hasRole } = useAuth();
  const isAdmin = hasRole("admin");

  const defaultSection = hasPermission(PERMISSIONS.ORDER_CREATE)
    ? "menu"
    : hasPermission(PERMISSIONS.ORDER_READ) ? "savedOrders" : "manageMenu";

  const [activeSection, setActiveSection]   = useState(defaultSection);
  const [menuItems,     setMenuItems]        = useState([]);
  const [selectedItems, setSelectedItems]    = useState([]);
  const [savedOrders,   setSavedOrders]      = useState([]);
  const [buyers,        setBuyers]           = useState([]);
  const [selectedBuyer, setSelectedBuyer]    = useState(null);
  const [vatRate,       setVatRate]          = useState(15);
  const [paymentDetails, setPaymentDetails]  = useState({ mode: "CASH", paymentTerm: "IMMEDIATE" });
  const [invoiceCounter, setInvoiceCounter]  = useState(1);
  const [sellers,       setSellers]          = useState([]);
  const [selectedSeller, setSelectedSeller]  = useState(null);
  const [assignedBranch, setAssignedBranch]  = useState(null);

  useEffect(() => {
    if (location.pathname === "/") setActiveSection("menu");
  }, [location.pathname]);

  useEffect(() => {
    const fetchInitial = async () => {
      const tasks = [];
      if (hasPermission(PERMISSIONS.MENU_READ))
        tasks.push(menuService.getMenuItems().then(r => setMenuItems(r.data || [])).catch(console.error));
      if (hasPermission(PERMISSIONS.CUSTOMER_READ))
        tasks.push(buyerService.getBuyers().then(r => setBuyers(r.data || [])).catch(console.error));
      if (hasPermission(PERMISSIONS.SELLER_READ))
        tasks.push(sellerService.getSellers().then(r => { if (r.data?.length > 0) setSellers(r.data); }).catch(console.error));
      if (hasPermission(PERMISSIONS.SYSTEM_READ))
        tasks.push(systemService.getNextInvoiceCounter().then(r => setInvoiceCounter(r.data?.counter || 1)).catch(console.error));
      await Promise.allSettled(tasks);
      try {
        const me = await cashierService.getMe();
        if (me.status === 200 && me.data) setAssignedBranch(me.data.sourceSystem);
      } catch { /* admin or unassigned */ }
    };
    fetchInitial();
  }, []);

  useEffect(() => {
    if (activeSection !== "savedOrders" || !hasPermission(PERMISSIONS.ORDER_READ)) return;
    orderService.getOrders().then(r => setSavedOrders(r.data || [])).catch(console.error);
  }, [activeSection, hasPermission]);

  const allSidebarItems = [
    { id: "menu",            label: "Sales",     icon: "🛒", show: hasPermission(PERMISSIONS.ORDER_CREATE) },
    { id: "savedOrders",     label: "Orders",    icon: "📋", show: hasPermission(PERMISSIONS.ORDER_READ) },
    { id: "verifyInvoice",   label: "Verify",    icon: "✅", show: hasPermission(PERMISSIONS.ORDER_READ) },
    { id: "manageCustomers", label: "Customers", icon: "👤", show: hasPermission(PERMISSIONS.CUSTOMER_READ) },
    { id: "manageMenu",      label: "Products",  icon: "🍽️", show: isAdmin },
    { id: "manageBranches",  label: "Branches",  icon: "🏢", show: isAdmin },
    { id: "manageCashiers",  label: "Cashiers",  icon: "👷", show: isAdmin },
    { id: "manageCompanies", label: "Companies", icon: "🏛️", show: isAdmin },
    { id: "reports",         label: "Reports",   icon: "📊", show: isAdmin },
  ].filter(i => i.show);

  const isSales = activeSection === "menu";

  return (
    <div className="pos">
      {/* Top nav — Sales only */}
      {isSales && (
        <div className="pos__topnav">
          <div className="pos__topnav-buttons">
            {allSidebarItems.map(item => (
              <button
                key={item.id}
                className={`pos__nav-btn ${activeSection === item.id ? "pos__nav-btn--active" : "pos__nav-btn--idle"}`}
                onClick={() => setActiveSection(item.id)}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pos__main">
        {/* Sidebar — non-Sales */}
        {!isSales && (
          <div className="pos__sidebar-wrapper">
            <RightSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>
        )}

        <div className={`pos__content ${isSales ? "pos__content--sales" : "pos__content--section"}`}>
          {isSales && (
            <Can permission={PERMISSIONS.ORDER_CREATE} fallback={<p className="pos__section" style={{padding:"20px"}}>No permission to create sales.</p>}>
              <div className="pos__menu-area">
                <MenuSection menuItems={menuItems} setMenuItems={setMenuItems} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
              </div>
              <div className="pos__order-area">
                <OrderSection
                  selectedItems={selectedItems} setSelectedItems={setSelectedItems}
                  selectedBuyer={selectedBuyer} setSelectedBuyer={setSelectedBuyer}
                  buyers={buyers} setBuyers={setBuyers}
                  selectedSeller={selectedSeller} setSelectedSeller={setSelectedSeller}
                  sellers={sellers} setSellers={setSellers}
                  vatRate={vatRate} setVatRate={setVatRate}
                  paymentDetails={paymentDetails} setPaymentDetails={setPaymentDetails}
                  invoiceCounter={invoiceCounter} setInvoiceCounter={() => setInvoiceCounter(p => (p||1)+1)}
                  assignedBranch={assignedBranch}
                />
              </div>
            </Can>
          )}

          {activeSection === "savedOrders" && (
            <Can permission={PERMISSIONS.ORDER_READ} fallback={<p>No permission.</p>}>
              <div className="pos__section"><SavedOrders savedOrders={savedOrders} /></div>
            </Can>
          )}
          {activeSection === "manageMenu" && (
            <Can permission={PERMISSIONS.MENU_READ} fallback={<p>No permission.</p>}>
              <div className="pos__section"><MenuManagement /></div>
            </Can>
          )}
          {activeSection === "manageCustomers" && (
            <Can permission={PERMISSIONS.CUSTOMER_READ} fallback={<p>No permission.</p>}>
              <div className="pos__section"><CustomerManagement /></div>
            </Can>
          )}
          {activeSection === "verifyInvoice"   && <div className="pos__section"><VerifyInvoice /></div>}
          {activeSection === "manageCashiers"  && <div className="pos__section"><CashierManagement /></div>}
          {activeSection === "manageBranches"  && <div className="pos__section"><BranchManagement /></div>}
          {activeSection === "reports"         && <div className="pos__section"><ReportPage /></div>}
          {activeSection === "manageCompanies" && <div className="pos__section"><SellerManagement /></div>}
        </div>
      </div>
    </div>
  );
}

function App() {
  const { username, roles, logout } = useAuth();
  const [showProfile, setShowProfile] = React.useState(false);
  const initials = username ? username.slice(0, 2).toUpperCase() : "??";

  if (!roles.length) {
    return (
      <div className="app__denied">
        <h2>Access denied</h2>
        <p>Your account has no CafePOS role. Ask an admin to assign a role.</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Navbar */}
      <div className="app__navbar">
        <span className="app__logo">☕ CafePOS</span>

        <div className="app__profile">
          <button className="app__avatar" onClick={() => setShowProfile(v => !v)}>
            {initials}
          </button>

          {showProfile && (
            <>
              <div className="app__overlay" onClick={() => setShowProfile(false)} />
              <div className="app__dropdown">
                <div className="app__dropdown-user">
                  <div className="app__dropdown-avatar">{initials}</div>
                  <div>
                    <div className="app__dropdown-name">{username}</div>
                    <div className="app__dropdown-role">{roles.join(", ")}</div>
                  </div>
                </div>
                <div className="app__dropdown-divider">
                  <button className="app__btn-logout" onClick={() => { setShowProfile(false); logout(); }}>
                    🚪 Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="app__body">
        <Routes>
          <Route path="/" element={<POSLayout />} />
          <Route path="/receipt" element={<div className="app__receipt-wrapper"><Receipt /></div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
