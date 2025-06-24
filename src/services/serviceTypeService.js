import axiosInstance from "./axiosConfig";

const serviceTypeService = {
  /**
   * Lấy danh sách tất cả service types
   * @param {Object} params - Tham số query
   * @returns {Promise} Response chứa danh sách service types
   */
  async getAllServiceTypes(params = {}) {
    try {
      console.log("Fetching service types with params:", params);
      const response = await axiosInstance.get("/service-types", { params });
      console.log("Service types response:", response.data);

      return {
        serviceTypes: response.data.results || [],
        pagination: {
          page: response.data.page || 1,
          limit: response.data.limit || 10,
          totalPages: response.data.totalPages || 1,
          totalResults: response.data.totalResults || 0,
        },
      };
    } catch (error) {
      console.error("Error fetching service types:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một service type
   * @param {number} serviceTypeId - ID của service type
   * @returns {Promise} Response chứa thông tin service type
   */
  async getServiceTypeById(serviceTypeId) {
    try {
      console.log("Fetching service type by ID:", serviceTypeId);
      const response = await axiosInstance.get(
        `/service-types/${serviceTypeId}`
      );
      console.log("Service type detail response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching service type by ID:", error);
      throw error;
    }
  },

  /**
   * Tạo service type mới
   * @param {Object} serviceTypeData - Dữ liệu service type
   * @returns {Promise} Response chứa thông tin service type được tạo
   */
  async createServiceType(serviceTypeData) {
    try {
      console.log("Creating service type:", serviceTypeData);
      const response = await axiosInstance.post(
        "/service-types",
        serviceTypeData
      );
      console.log("Create service type response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating service type:", error);
      throw error;
    }
  },

  /**
   * Cập nhật service type
   * @param {number} serviceTypeId - ID của service type
   * @param {Object} serviceTypeData - Dữ liệu cần cập nhật
   * @returns {Promise} Response chứa thông tin service type được cập nhật
   */
  async updateServiceType(serviceTypeId, serviceTypeData) {
    try {
      console.log("Updating service type:", serviceTypeId, serviceTypeData);
      const response = await axiosInstance.patch(
        `/service-types/${serviceTypeId}`,
        serviceTypeData
      );
      console.log("Update service type response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating service type:", error);
      throw error;
    }
  },

  /**
   * Xóa service type
   * @param {number} serviceTypeId - ID của service type
   * @returns {Promise} Response xác nhận xóa
   */
  async deleteServiceType(serviceTypeId) {
    try {
      console.log("Deleting service type:", serviceTypeId);
      const response = await axiosInstance.delete(
        `/service-types/${serviceTypeId}`
      );
      console.log("Delete service type response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting service type:", error);
      throw error;
    }
  },

  /**
   * Lấy thống kê service types
   * @returns {Promise} Response chứa thống kê
   */
  async getServiceTypeStats() {
    try {
      console.log("Fetching service type stats...");

      // Gọi API để lấy tất cả service types (không phân trang)
      const response = await axiosInstance.get("/service-types", {
        params: { limit: 100 }, // Lấy số lượng lớn để tính thống kê
      });

      const serviceTypes = response.data.results || [];

      // Tính toán thống kê
      const stats = {
        total: serviceTypes.length,
        avgUnitPrice: 0,
        minUnitPrice: 0,
        maxUnitPrice: 0,
        unitDistribution: {},
      };

      if (serviceTypes.length > 0) {
        const prices = serviceTypes.map((st) => parseFloat(st.unitPrice) || 0);
        stats.avgUnitPrice =
          prices.reduce((sum, price) => sum + price, 0) / prices.length;
        stats.minUnitPrice = Math.min(...prices);
        stats.maxUnitPrice = Math.max(...prices);

        // Phân bố theo đơn vị
        serviceTypes.forEach((st) => {
          const unit = st.unit || "Không xác định";
          stats.unitDistribution[unit] =
            (stats.unitDistribution[unit] || 0) + 1;
        });
      }

      console.log("Service type stats:", stats);
      return stats;
    } catch (error) {
      console.error("Error fetching service type stats:", error);
      return {
        total: 0,
        avgUnitPrice: 0,
        minUnitPrice: 0,
        maxUnitPrice: 0,
        unitDistribution: {},
      };
    }
  },
};

export default serviceTypeService;
