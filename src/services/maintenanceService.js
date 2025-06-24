import axiosInstance from "./axiosConfig";

/**
 * Service for managing maintenance requests (Maintenance category only)
 * API endpoints: /feedbacks (filtered by category=Maintenance)
 */
const maintenanceService = {
  /**
   * Lấy danh sách maintenance requests
   * @param {Object} params - Query parameters
   * @returns {Promise} Response chứa danh sách maintenance requests
   */
  async getAllMaintenanceRequests(params = {}) {
    try {
      // Luôn filter category=Maintenance
      const filteredParams = {
        ...params,
        category: "Maintenance",
      };

      console.log("Loading maintenance requests with params:", filteredParams);
      const response = await axiosInstance.get("/feedbacks", {
        params: filteredParams,
      });

      return {
        maintenanceRequests: response.data.results || [],
        totalResults: response.data.totalResults || 0,
        totalPages: response.data.totalPages || 1,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
      };
    } catch (error) {
      console.error("Error loading maintenance requests:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một maintenance request
   * @param {number} feedbackId - ID của maintenance request
   * @returns {Promise} Response chứa thông tin maintenance request
   */
  async getMaintenanceRequestById(feedbackId) {
    try {
      console.log("Loading maintenance request detail:", feedbackId);
      const response = await axiosInstance.get(`/feedbacks/${feedbackId}`);

      // Validate category
      if (response.data.category !== "Maintenance") {
        throw new Error("This is not a maintenance request");
      }

      return response.data;
    } catch (error) {
      console.error("Error loading maintenance request detail:", error);
      throw error;
    }
  },

  /**
   * Tạo maintenance request mới
   * @param {Object} maintenanceData - Dữ liệu maintenance request
   * @returns {Promise} Response chứa thông tin maintenance request được tạo
   */
  async createMaintenanceRequest(maintenanceData) {
    try {
      console.log("Creating maintenance request:", maintenanceData);

      const payload = {
        userId: maintenanceData.userId,
        category: "Maintenance", // Luôn set category = Maintenance
        description: maintenanceData.description,
        status: maintenanceData.status || "Pending",
      };

      console.log("Payload to send:", payload);

      const response = await axiosInstance.post("/feedbacks", payload);
      console.log("Create maintenance request response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating maintenance request:", error);

      // Log detailed error information
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }

      throw error;
    }
  },

  /**
   * Cập nhật maintenance request
   * @param {number} feedbackId - ID của maintenance request
   * @param {Object} maintenanceData - Dữ liệu cần cập nhật
   * @returns {Promise} Response chứa thông tin maintenance request được cập nhật
   */
  async updateMaintenanceRequest(feedbackId, maintenanceData) {
    try {
      console.log("Updating maintenance request:", feedbackId, maintenanceData);

      const payload = {
        category: "Maintenance", // Luôn set category = Maintenance
        description: maintenanceData.description,
      };

      console.log("Payload to send:", payload);

      const response = await axiosInstance.patch(
        `/feedbacks/${feedbackId}`,
        payload
      );
      console.log("Update maintenance request response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating maintenance request:", error);

      // Log detailed error information
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }

      throw error;
    }
  },

  /**
   * Xóa maintenance request
   * @param {number} feedbackId - ID của maintenance request
   * @returns {Promise} Response xác nhận xóa
   */
  async deleteMaintenanceRequest(feedbackId) {
    try {
      console.log("Deleting maintenance request:", feedbackId);
      const response = await axiosInstance.delete(`/feedbacks/${feedbackId}`);
      console.log("Delete maintenance request response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting maintenance request:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách maintenance requests theo user ID
   * @param {number} userId - ID của user
   * @param {Object} params - Query parameters
   * @returns {Promise} Response chứa danh sách maintenance requests của user
   */
  async getMaintenanceRequestsByUserId(userId, params = {}) {
    try {
      const filteredParams = {
        ...params,
        category: "Maintenance", // Luôn filter category=Maintenance
      };

      console.log(
        "Loading maintenance requests by user:",
        userId,
        filteredParams
      );
      const response = await axiosInstance.get(`/feedbacks/user/${userId}`, {
        params: filteredParams,
      });

      return {
        maintenanceRequests: response.data.results || [],
        totalResults: response.data.totalResults || 0,
        totalPages: response.data.totalPages || 1,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
      };
    } catch (error) {
      console.error("Error loading maintenance requests by user:", error);
      throw error;
    }
  },

  /**
   * Cập nhật phản hồi của admin cho maintenance request
   * @param {number} feedbackId - ID của maintenance request
   * @param {Object} responseData - Dữ liệu phản hồi
   * @returns {Promise} Response chứa thông tin maintenance request được cập nhật
   */
  async updateMaintenanceResponse(feedbackId, responseData) {
    try {
      console.log("Updating maintenance response:", feedbackId, responseData);

      const payload = {
        status: responseData.status,
        response: responseData.response,
      };

      console.log("Payload to send:", payload);

      const response = await axiosInstance.patch(
        `/feedbacks/feedbackresponse/${feedbackId}`,
        payload
      );
      console.log("Update maintenance response result:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating maintenance response:", error);

      // Log detailed error information
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }

      throw error;
    }
  },

  /**
   * Lấy thống kê maintenance requests
   * @returns {Promise} Response chứa thống kê
   */
  async getMaintenanceStats() {
    try {
      // Lấy tất cả maintenance requests để tính thống kê
      const response = await this.getAllMaintenanceRequests({ limit: 1000 });
      const maintenanceRequests = response.maintenanceRequests || [];

      const stats = {
        total: maintenanceRequests.length,
        pending: maintenanceRequests.filter((m) => m.status === "Pending")
          .length,
        inProgress: maintenanceRequests.filter(
          (m) => m.status === "In Progress"
        ).length,
        resolved: maintenanceRequests.filter((m) => m.status === "Resolved")
          .length,
        rejected: maintenanceRequests.filter((m) => m.status === "Rejected")
          .length,
        cancelled: maintenanceRequests.filter((m) => m.status === "Cancelled")
          .length,
        statusDistribution: {
          Pending: maintenanceRequests.filter((m) => m.status === "Pending")
            .length,
          "In Progress": maintenanceRequests.filter(
            (m) => m.status === "In Progress"
          ).length,
          Resolved: maintenanceRequests.filter((m) => m.status === "Resolved")
            .length,
          Rejected: maintenanceRequests.filter((m) => m.status === "Rejected")
            .length,
          Cancelled: maintenanceRequests.filter((m) => m.status === "Cancelled")
            .length,
        },
      };

      return stats;
    } catch (error) {
      console.error("Error loading maintenance stats:", error);
      throw error;
    }
  },
};

export default maintenanceService;
