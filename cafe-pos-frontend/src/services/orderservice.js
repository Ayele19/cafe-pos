// src/services/orderService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/orders"; // ✅ your backend endpoint

export const orderService = {
  saveOrder: async (orderData) => {
    return await axios.post(API_URL, orderData, {
      headers: { "Content-Type": "application/json" },
    });
  },
};
