import axiosInstance from "./axiosConfig";

export const adminService = {
  // Get dashboard data (Vietnamese version)
  getDashboardVN: async (params = {}) => {
    try {
      const response = await axiosInstance.get("/admin/dashboard-vn", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },

  // Get report data
  getReport: async (params = {}) => {
    try {
      const response = await axiosInstance.get("/admin/report", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching report data:", error);
      throw error;
    }
  },

  // Get monthly revenue (additional API for detailed reports)
  getMonthlyRevenue: async (year) => {
    try {
      const response = await axiosInstance.get("/admin/revenue/monthly", {
        params: { year },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
      throw error;
    }
  },

  // Get service revenue statistics (additional API for detailed reports)
  getServiceRevenue: async (year) => {
    try {
      const response = await axiosInstance.get("/admin/revenue/service-types", {
        params: { year },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching service revenue:", error);
      throw error;
    }
  },

  // Get overview data (additional API)
  getOverview: async () => {
    try {
      const response = await axiosInstance.get("/admin/overview");
      return response.data;
    } catch (error) {
      console.error("Error fetching overview data:", error);
      throw error;
    }
  },
};

export default adminService;
