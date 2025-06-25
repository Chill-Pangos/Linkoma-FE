import axiosInstance from "./axiosConfig";

/**
 * Service for managing feedbacks (Service and Complaint categories)
 * API endpoints: /feedbacks
 */
const feedbackService = {
  /**
   * Lấy danh sách feedbacks (loại bỏ Maintenance category)
   * @param {Object} params - Query parameters
   * @returns {Promise} Response chứa danh sách feedbacks
   */
  async getAllFeedbacks(params = {}) {
    try {
      // Filter để loại bỏ Maintenance category
      const filteredParams = {
        ...params,
        // Nếu không có category filter, thì lọc bỏ Maintenance
        // Nếu có category filter và không phải Maintenance, thì giữ nguyên
      };

      console.log("Loading feedbacks with params:", filteredParams);
      const response = await axiosInstance.get("/feedbacks", {
        params: filteredParams,
      });

      // Filter kết quả để loại bỏ Maintenance nếu cần
      let feedbacks = response.data.results || [];
      if (!params.category) {
        // Nếu không có filter category, loại bỏ Maintenance
        feedbacks = feedbacks.filter(
          (feedback) => feedback.category !== "Maintenance"
        );
      }

      return {
        feedbacks,
        totalResults: feedbacks.length,
        totalPages: response.data.totalPages || 1,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
      };
    } catch (error) {
      console.error("Error loading feedbacks:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một feedback
   * @param {number} feedbackId - ID của feedback
   * @returns {Promise} Response chứa thông tin feedback
   */
  async getFeedbackById(feedbackId) {
    try {
      console.log("Loading feedback detail:", feedbackId);
      const response = await axiosInstance.get(`/feedbacks/${feedbackId}`);
      return response.data;
    } catch (error) {
      console.error("Error loading feedback detail:", error);
      throw error;
    }
  },

  /**
   * Tạo feedback mới
   * @param {Object} feedbackData - Dữ liệu feedback
   * @returns {Promise} Response chứa thông tin feedback được tạo
   */
  async createFeedback(feedbackData) {
    try {
      console.log("Creating feedback:", feedbackData);

      // Validate để đảm bảo không phải Maintenance category
      if (feedbackData.category === "Maintenance") {
        throw new Error("Use maintenanceService for Maintenance category");
      }

      const payload = {
        userId: feedbackData.userId,
        category: feedbackData.category, // Service hoặc Complaint
        description: feedbackData.description,
        status: feedbackData.status || "Pending",
      };

      console.log("Payload to send:", payload);

      const response = await axiosInstance.post("/feedbacks", payload);
      console.log("Create feedback response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating feedback:", error);

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
   * Cập nhật feedback
   * @param {number} feedbackId - ID của feedback
   * @param {Object} feedbackData - Dữ liệu cần cập nhật
   * @returns {Promise} Response chứa thông tin feedback được cập nhật
   */
  async updateFeedback(feedbackId, feedbackData) {
    try {
      console.log("Updating feedback:", feedbackId, feedbackData);

      const payload = {
        category: feedbackData.category,
        description: feedbackData.description,
      };

      console.log("Payload to send:", payload);

      const response = await axiosInstance.patch(
        `/feedbacks/${feedbackId}`,
        payload
      );
      console.log("Update feedback response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating feedback:", error);

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
   * Xóa feedback
   * @param {number} feedbackId - ID của feedback
   * @returns {Promise} Response xác nhận xóa
   */
  async deleteFeedback(feedbackId) {
    try {
      console.log("Deleting feedback:", feedbackId);
      const response = await axiosInstance.delete(`/feedbacks/${feedbackId}`);
      console.log("Delete feedback response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting feedback:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách feedbacks theo user ID
   * @param {number} userId - ID của user
   * @param {Object} params - Query parameters
   * @returns {Promise} Response chứa danh sách feedbacks của user
   */
  async getFeedbacksByUserId(userId, params = {}) {
    try {
      console.log("Loading feedbacks by user:", userId, params);
      const response = await axiosInstance.get(`/feedbacks/user/${userId}`, {
        params,
      });

      // Filter kết quả để loại bỏ Maintenance nếu cần
      let feedbacks = response.data.results || [];
      if (!params.category) {
        feedbacks = feedbacks.filter(
          (feedback) => feedback.category !== "Maintenance"
        );
      }

      return {
        feedbacks,
        totalResults: feedbacks.length,
        totalPages: response.data.totalPages || 1,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
      };
    } catch (error) {
      console.error("Error loading feedbacks by user:", error);
      throw error;
    }
  },

  /**
   * Cập nhật phản hồi của admin cho feedback
   * @param {number} feedbackId - ID của feedback
   * @param {Object} responseData - Dữ liệu phản hồi
   * @returns {Promise} Response chứa thông tin feedback được cập nhật
   */
  async updateFeedbackResponse(feedbackId, responseData) {
    try {
      console.log("Updating feedback response:", feedbackId, responseData);

      const payload = {
        status: responseData.status,
        response: responseData.response,
      };

      console.log("Payload to send:", payload);

      const response = await axiosInstance.patch(
        `/feedbacks/feedbackresponse/${feedbackId}`,
        payload
      );
      console.log("Update feedback response result:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating feedback response:", error);

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
   * Lấy thống kê feedbacks
   * @returns {Promise} Response chứa thống kê
   */
  async getFeedbackStats() {
    try {
      // Lấy tất cả feedbacks để tính thống kê
      const response = await this.getAllFeedbacks({ limit: 1000 });
      const feedbacks = response.feedbacks || [];

      const stats = {
        total: feedbacks.length,
        pending: feedbacks.filter((f) => f.status === "Pending").length,
        inProgress: feedbacks.filter((f) => f.status === "In Progress").length,
        resolved: feedbacks.filter((f) => f.status === "Resolved").length,
        rejected: feedbacks.filter((f) => f.status === "Rejected").length,
        cancelled: feedbacks.filter((f) => f.status === "Cancelled").length,
        service: feedbacks.filter((f) => f.category === "Service").length,
        complaint: feedbacks.filter((f) => f.category === "Complaint").length,
        statusDistribution: {
          Pending: feedbacks.filter((f) => f.status === "Pending").length,
          "In Progress": feedbacks.filter((f) => f.status === "In Progress")
            .length,
          Resolved: feedbacks.filter((f) => f.status === "Resolved").length,
          Rejected: feedbacks.filter((f) => f.status === "Rejected").length,
          Cancelled: feedbacks.filter((f) => f.status === "Cancelled").length,
        },
        categoryDistribution: {
          Service: feedbacks.filter((f) => f.category === "Service").length,
          Complaint: feedbacks.filter((f) => f.category === "Complaint").length,
        },
      };

      return stats;
    } catch (error) {
      console.error("Error loading feedback stats:", error);
      throw error;
    }
  },
};

export default feedbackService;
