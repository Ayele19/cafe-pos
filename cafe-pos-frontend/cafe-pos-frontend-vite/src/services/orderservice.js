import api from "./api";

export const orderService = {
  saveOrder: async (orderData) => api.post("/orders", orderData),
  getInvoiceCounter: async () => api.get("/system/invoiceCounter"),
};
