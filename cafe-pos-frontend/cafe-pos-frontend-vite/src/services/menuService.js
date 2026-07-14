import axios from 'axios';
const API_URL = "http://localhost:8080/api/menu";

export const menuService = {
  getMenuItems: () => axios.get(API_URL),
  addMenuItem: (data) => axios.post(API_URL, data),
  updateMenuItem: (id, data) => axios.put(`${API_URL}/${id}`, data),
  deleteMenuItem: (id) => axios.delete(`${API_URL}/${id}`),
  uploadMenuItemImage: (id, formData) => axios.post(`${API_URL}/${id}/image`, formData)
};
