import axiosInstance from "./axiosConfig";

// User API
export const userAPI = {
  getAll: () => axiosInstance.get("/users"),
  getById: (id) => axiosInstance.get(`/users/${id}`),
  create: (data) => axiosInstance.post("/users", data),
  update: (id, data) => axiosInstance.put(`/users/${id}`, data),
  delete: (id) => axiosInstance.delete(`/users/${id}`),
};

// Apartment API
export const apartmentAPI = {
  getAll: () => axiosInstance.get("/apartments"),
  getById: (id) => axiosInstance.get(`/apartments/${id}`),
  create: (data) => axiosInstance.post("/apartments", data),
  update: (id, data) => axiosInstance.put(`/apartments/${id}`, data),
  delete: (id) => axiosInstance.delete(`/apartments/${id}`),
};

// Bill API
export const billAPI = {
  getAll: () => axiosInstance.get("/bills"),
  getById: (id) => axiosInstance.get(`/bills/${id}`),
  getByUserId: (userId) => axiosInstance.get(`/bills/user/${userId}`),
  create: (data) => axiosInstance.post("/bills", data),
  update: (id, data) => axiosInstance.put(`/bills/${id}`, data),
  delete: (id) => axiosInstance.delete(`/bills/${id}`),
  pay: (id, paymentData) => axiosInstance.post(`/bills/${id}/pay`, paymentData),
};

// Maintenance API
export const maintenanceAPI = {
  getAll: () => axiosInstance.get("/maintenance"),
  getById: (id) => axiosInstance.get(`/maintenance/${id}`),
  getByUserId: (userId) => axiosInstance.get(`/maintenance/user/${userId}`),
  create: (data) => axiosInstance.post("/maintenance", data),
  update: (id, data) => axiosInstance.put(`/maintenance/${id}`, data),
  delete: (id) => axiosInstance.delete(`/maintenance/${id}`),
};

// Service API
export const serviceAPI = {
  getAll: () => axiosInstance.get("/services"),
  getById: (id) => axiosInstance.get(`/services/${id}`),
  create: (data) => axiosInstance.post("/services", data),
  update: (id, data) => axiosInstance.put(`/services/${id}`, data),
  delete: (id) => axiosInstance.delete(`/services/${id}`),
  book: (id, bookingData) =>
    axiosInstance.post(`/services/${id}/book`, bookingData),
};

// Notification API
export const notificationAPI = {
  getAll: () => axiosInstance.get("/notifications"),
  getById: (id) => axiosInstance.get(`/notifications/${id}`),
  getByUserId: (userId) => axiosInstance.get(`/notifications/user/${userId}`),
  create: (data) => axiosInstance.post("/notifications", data),
  update: (id, data) => axiosInstance.put(`/notifications/${id}`, data),
  delete: (id) => axiosInstance.delete(`/notifications/${id}`),
  markAsRead: (id) => axiosInstance.patch(`/notifications/${id}/read`),
};

// Feedback API
export const feedbackAPI = {
  getAll: () => axiosInstance.get("/feedback"),
  getById: (id) => axiosInstance.get(`/feedback/${id}`),
  getByUserId: (userId) => axiosInstance.get(`/feedback/user/${userId}`),
  create: (data) => axiosInstance.post("/feedback", data),
  update: (id, data) => axiosInstance.put(`/feedback/${id}`, data),
  delete: (id) => axiosInstance.delete(`/feedback/${id}`),
};

// Report API
export const reportAPI = {
  getDashboardStats: () => axiosInstance.get("/reports/dashboard"),
  getUserStats: () => axiosInstance.get("/reports/users"),
  getBillStats: () => axiosInstance.get("/reports/bills"),
  getMaintenanceStats: () => axiosInstance.get("/reports/maintenance"),
  getServiceStats: () => axiosInstance.get("/reports/services"),
};
