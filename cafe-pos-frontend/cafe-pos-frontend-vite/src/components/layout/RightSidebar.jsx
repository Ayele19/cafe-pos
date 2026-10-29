import React from "react";
import { useAuth } from "../../auth/AuthContext";
import { PERMISSIONS } from "../../auth/permissions";
import "../../style/RightSidebar.css";

const RightSidebar = ({ activeSection, setActiveSection }) => {
  const { hasPermission, hasRole } = useAuth();
  const isAdmin = hasRole("admin");

  const allItems = [
    { id: "menu",            label: "Sales",     icon: "🛒", show: hasPermission(PERMISSIONS.ORDER_CREATE) },
    { id: "savedOrders",     label: "Orders",    icon: "📋", show: hasPermission(PERMISSIONS.ORDER_READ) },
    { id: "verifyInvoice",   label: "Verify",    icon: "✅", show: hasPermission(PERMISSIONS.ORDER_READ) },
    { id: "manageCustomers", label: "Customers", icon: "👤", show: hasPermission(PERMISSIONS.CUSTOMER_READ) },
    { id: "manageMenu",      label: "Products",  icon: "🍽️", show: isAdmin },
    { id: "manageBranches",  label: "Branches",  icon: "🏢", show: isAdmin },
    { id: "manageCashiers",  label: "Cashiers",  icon: "👷", show: isAdmin },
    { id: "manageCompanies", label: "Companies", icon: "🏛️", show: isAdmin },
    { id: "reports",         label: "Reports",   icon: "📊", show: isAdmin },
  ].filter(item => item.show);

  return (
    <div className="sidebar">
      <div className="sidebar__logo">CafePOS</div>

      {allItems.map(item => (
        <div
          key={item.id}
          className={`sidebar__item${activeSection === item.id ? " sidebar__item--active" : ""}`}
          onClick={() => setActiveSection(item.id)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default RightSidebar;
