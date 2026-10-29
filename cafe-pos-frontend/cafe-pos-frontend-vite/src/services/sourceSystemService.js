import api from "./api";

export const sourceSystemService = {
  getAll: async () => api.get("/source-system/all"),
  getById: async (id) => api.get(`/source-system/${id}`),
  create: async (data) => api.post("/source-system/add", data),
  update: async (id, data) => api.put(`/source-system/update/${id}`, data),
  delete: async (id) => api.delete(`/source-system/delete/${id}`),
};
