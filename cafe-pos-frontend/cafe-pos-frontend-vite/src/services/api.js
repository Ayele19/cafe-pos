import axios from "axios";

// Base Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// ---------- Menu Service ----------
export const menuService = {
  getMenuItems: () => api.get("/menu"),
  addMenuItem: (menuItem) => api.post("/menu", menuItem),          // include unit
  updateMenuItem: (id, menuItem) => api.put(`/menu/${id}`, menuItem),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),

  // Upload image for a menu item
  uploadMenuItemImage: (id, formData) =>
    api.post(`/menu/${id}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ---------- Buyer Service ----------
export const buyerService = {
  getBuyers: () => api.get("/buyers"),
  saveBuyer: (buyerData) => api.post("/buyers", buyerData),
  updateBuyer: (id, buyerData) => api.put(`/buyers/${id}`, buyerData),
};

// ---------- Order Service ----------
export const orderService = {
  getOrders: () => api.get("/orders"),
  getOrderById: (id) => api.get(`/orders/${id}`),
  saveOrder: (orderData) => api.post("/orders", orderData),
};

// ---------- Seller Service ----------
export const sellerService = {
  getSellers: () => api.get("/sellers"),
  saveSeller: (sellerData) => api.post("/sellers", sellerData),
  updateSeller: (id, sellerData) => api.put(`/sellers/${id}`, sellerData),
};

// ---------- System Service ----------
export const systemService = {
  getNextInvoiceCounter: () => api.get("/system/invoiceCounter"),
};
