import axios from "axios";

const BASE_URL = "http://localhost:8080/api/source-system";

export const sourceSystemService = {
  getAll: async () => axios.get(`${BASE_URL}/all`),
  getById: async (id) => axios.get(`${BASE_URL}/${id}`),
  create: async (data) => axios.post(`${BASE_URL}/add`, data),
  update: async (id, data) => axios.put(`${BASE_URL}/update/${id}`, data),
  delete: async (id) => axios.delete(`${BASE_URL}/delete/${id}`)
};
