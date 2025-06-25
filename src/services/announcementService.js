import axiosInstance from "./axiosConfig";

/**
 * Service for managing announcements/notifications
 * API endpoints: /announcements
 */
const announcementService = {
  /**
   * Lấy danh sách announcements
   * @param {Object} params - Query parameters
   * @returns {Promise} Response chứa danh sách announcements
   */
  async getAllAnnouncements(params = {}) {
    try {
      console.log("Loading announcements with params:", params);
      const response = await axiosInstance.get("/announcements", {
        params,
      });

      return {
        announcements: response.data.results || [],
        totalResults: response.data.totalResults || 0,
        totalPages: response.data.totalPages || 1,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
      };
    } catch (error) {
      console.error("Error loading announcements:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một announcement
   * @param {number} announcementId - ID của announcement
   * @returns {Promise} Response chứa thông tin announcement
   */
  async getAnnouncementById(announcementId) {
    try {
      console.log("Loading announcement detail:", announcementId);
      const response = await axiosInstance.get(
        `/announcements/${announcementId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error loading announcement detail:", error);
      throw error;
    }
  },

  /**
   * Tạo announcement mới
   * @param {Object} announcementData - Dữ liệu announcement
   * @returns {Promise} Response chứa thông tin announcement được tạo
   */
  async createAnnouncement(announcementData) {
    try {
      console.log("Creating announcement:", announcementData);

      const payload = {
        type: announcementData.type,
        priority: announcementData.priority,
        title: announcementData.title,
        content: announcementData.content,
        author: announcementData.author,
      };

      console.log("Payload to send:", payload);

      const response = await axiosInstance.post("/announcements", payload);
      console.log("Create announcement response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating announcement:", error);

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
   * Cập nhật announcement
   * @param {number} announcementId - ID của announcement
   * @param {Object} announcementData - Dữ liệu cần cập nhật
   * @returns {Promise} Response chứa thông tin announcement được cập nhật
   */
  async updateAnnouncement(announcementId, announcementData) {
    try {
      console.log("Updating announcement:", announcementId, announcementData);

      const payload = {
        type: announcementData.type,
        priority: announcementData.priority,
        title: announcementData.title,
        content: announcementData.content,
      };

      // Loại bỏ các trường undefined
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      console.log("Payload to send:", payload);

      const response = await axiosInstance.patch(
        `/announcements/${announcementId}`,
        payload
      );
      console.log("Update announcement response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating announcement:", error);

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
   * Xóa announcement
   * @param {number} announcementId - ID của announcement
   * @returns {Promise} Response xác nhận xóa
   */
  async deleteAnnouncement(announcementId) {
    try {
      console.log("Deleting announcement:", announcementId);
      const response = await axiosInstance.delete(
        `/announcements/${announcementId}`
      );
      console.log("Delete announcement response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting announcement:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách announcements theo user ID
   * @param {number} userId - ID của user
   * @param {Object} params - Query parameters
   * @returns {Promise} Response chứa danh sách announcements của user
   */
  async getAnnouncementsByUserId(userId, params = {}) {
    try {
      console.log("Loading announcements by user:", userId, params);
      const response = await axiosInstance.get(
        `/announcements/user/${userId}`,
        {
          params,
        }
      );

      return {
        announcements: response.data.results || [],
        totalResults: response.data.totalResults || 0,
        totalPages: response.data.totalPages || 1,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
      };
    } catch (error) {
      console.error("Error loading announcements by user:", error);
      throw error;
    }
  },

  /**
   * Lấy thống kê announcements
   * @returns {Promise} Response chứa thống kê
   */
  async getAnnouncementStats() {
    try {
      // Lấy tất cả announcements để tính thống kê
      const response = await this.getAllAnnouncements({ limit: 100 });
      const announcements = response.announcements || [];

      const stats = {
        total: announcements.length,
        general: announcements.filter((a) => a.type === "General").length,
        urgent: announcements.filter((a) => a.type === "Urgent").length,
        maintenance: announcements.filter((a) => a.type === "Maintenance")
          .length,
        event: announcements.filter((a) => a.type === "Event").length,
        low: announcements.filter((a) => a.priority === "Low").length,
        medium: announcements.filter((a) => a.priority === "Medium").length,
        high: announcements.filter((a) => a.priority === "High").length,
        critical: announcements.filter((a) => a.priority === "Critical").length,
        typeDistribution: {
          General: announcements.filter((a) => a.type === "General").length,
          Urgent: announcements.filter((a) => a.type === "Urgent").length,
          Maintenance: announcements.filter((a) => a.type === "Maintenance")
            .length,
          Event: announcements.filter((a) => a.type === "Event").length,
        },
        priorityDistribution: {
          Low: announcements.filter((a) => a.priority === "Low").length,
          Medium: announcements.filter((a) => a.priority === "Medium").length,
          High: announcements.filter((a) => a.priority === "High").length,
          Critical: announcements.filter((a) => a.priority === "Critical")
            .length,
        },
      };

      return stats;
    } catch (error) {
      console.error("Error loading announcement stats:", error);
      throw error;
    }
  },
};

export default announcementService;
