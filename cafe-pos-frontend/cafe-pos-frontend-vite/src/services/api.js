import axios from "axios";
import { getAccessToken } from "../lib/keycloak";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      error.rbacDenied = true;
    }
    return Promise.reject(error);
  }
);

export const menuService = {
  getMenuItems: () => api.get("/menu"),
  addMenuItem: (menuItem) => api.post("/menu", menuItem),
  updateMenuItem: (id, menuItem) => api.put(`/menu/${id}`, menuItem),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),
  uploadMenuItemImage: (id, formData) =>
    api.post(`/menu/${id}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const buyerService = {
  getBuyers: () => api.get("/buyers"),
  saveBuyer: (buyerData) => api.post("/buyers", buyerData),
  updateBuyer: (id, buyerData) => api.put(`/buyers/${id}`, buyerData),
  deleteBuyer: (id) => api.delete(`/buyers/${id}`),
};

export const orderService = {
  getOrders: () => api.get("/orders"),
  getOrderById: (id) => api.get(`/orders/${id}`),
  saveOrder: (orderData) => api.post("/orders", orderData),
};

export const sellerService = {
  getSellers: () => api.get("/sellers"),
  saveSeller: (sellerData) => api.post("/sellers", sellerData),
  updateSeller: (id, sellerData) => api.put(`/sellers/${id}`, sellerData),
};

export const systemService = {
  getNextInvoiceCounter: () => api.get("/system/invoiceCounter"),
};

export const authService = {
  me: () => api.get("/auth/me"),
};

export const cashierService = {
  getAll: () => api.get("/cashiers"),
  create: (data) => api.post("/cashiers", data),
  update: (id, data) => api.put(`/cashiers/${id}`, data),
  remove: (id) => api.delete(`/cashiers/${id}`),
  getMe: () => api.get("/cashiers/me"),
  resetPassword: (id, password) => api.post(`/cashiers/${id}/reset-password`, { password }),
};

export const branchService = {
  getAll: (sellerId) => api.get("/branches", { params: sellerId ? { sellerId } : {} }),
  create: (data) => api.post("/branches", data),
  update: (id, data) => api.put(`/branches/${id}`, data),
};

export const reportService = {
  getSummary: (params) => api.get("/reports/sales/summary", { params }),
};

export const verifyService = {
  verifyIrn: (irn) => api.post("/tax/verify", { irn }),
  cancelIrn: (irn, reasonCode, remark) => api.post("/tax/cancel", { irn, reasonCode, remark }),
};

export const auditService = {
  getLogs: () => api.get("/audit"),
  logLogin: () => api.post("/audit/login").catch(() => {}),
  logLogout: () => api.post("/audit/logout").catch(() => {}),
};

export default api;
