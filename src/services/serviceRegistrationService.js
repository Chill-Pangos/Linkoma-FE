import axiosInstance from "./axiosConfig";

const serviceRegistrationService = {
  /**
   * Lấy danh sách tất cả service registrations
   * @param {Object} params - Tham số query
   * @returns {Promise} Response chứa danh sách service registrations
   */
  async getAllServiceRegistrations(params = {}) {
    try {
      console.log("Fetching service registrations with params:", params);
      const response = await axiosInstance.get("/service-registrations", {
        params,
      });
      console.log("Service registrations response:", response.data);

      return {
        serviceRegistrations: response.data.results || [],
        pagination: {
          page: response.data.page || 1,
          limit: response.data.limit || 10,
          totalPages: response.data.totalPages || 1,
          totalResults: response.data.totalResults || 0,
        },
      };
    } catch (error) {
      console.error("Error fetching service registrations:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một service registration
   * @param {number} serviceRegistrationId - ID của service registration
   * @returns {Promise} Response chứa thông tin service registration
   */
  async getServiceRegistrationById(serviceRegistrationId) {
    try {
      console.log(
        "Fetching service registration by ID:",
        serviceRegistrationId
      );
      const response = await axiosInstance.get(
        `/service-registrations/${serviceRegistrationId}`
      );
      console.log("Service registration detail response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching service registration by ID:", error);
      throw error;
    }
  },
  /**
   * Tạo service registration mới
   * @param {Object} serviceRegistrationData - Dữ liệu service registration
   * @returns {Promise} Response chứa thông tin service registration được tạo
   */ async createServiceRegistration(serviceRegistrationData) {
    try {
      console.log("Creating service registration:", serviceRegistrationData); // Map the fields to API format
      const payload = {
        apartmentId:
          serviceRegistrationData.apartment_id ||
          serviceRegistrationData.apartmentId,
        serviceTypeId:
          serviceRegistrationData.service_type_id ||
          serviceRegistrationData.serviceTypeId,
        startDate:
          serviceRegistrationData.request_date ||
          serviceRegistrationData.startDate,
        status: serviceRegistrationData.status || "Active",
        note:
          serviceRegistrationData.notes || serviceRegistrationData.note || "",
      };

      // Only add endDate if it has a value
      if (
        serviceRegistrationData.endDate &&
        serviceRegistrationData.endDate !== null
      ) {
        payload.endDate = serviceRegistrationData.endDate;
      }

      console.log("Payload to send:", payload);

      const response = await axiosInstance.post(
        "/service-registrations",
        payload
      );
      console.log("Create service registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating service registration:", error);

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
   * Cập nhật service registration
   * @param {number} serviceRegistrationId - ID của service registration
   * @param {Object} serviceRegistrationData - Dữ liệu cần cập nhật
   * @returns {Promise} Response chứa thông tin service registration được cập nhật
   */ async updateServiceRegistration(
    serviceRegistrationId,
    serviceRegistrationData
  ) {
    try {
      console.log(
        "Updating service registration:",
        serviceRegistrationId,
        serviceRegistrationData
      ); // Map the fields to API format
      const payload = {
        apartmentId:
          serviceRegistrationData.apartment_id ||
          serviceRegistrationData.apartmentId,
        serviceTypeId:
          serviceRegistrationData.service_type_id ||
          serviceRegistrationData.serviceTypeId,
        startDate:
          serviceRegistrationData.request_date ||
          serviceRegistrationData.startDate,
        status: serviceRegistrationData.status,
        note:
          serviceRegistrationData.notes || serviceRegistrationData.note || "",
      };

      // Only add endDate if it has a value
      if (
        serviceRegistrationData.endDate &&
        serviceRegistrationData.endDate !== null
      ) {
        payload.endDate = serviceRegistrationData.endDate;
      }

      console.log("Payload to send:", payload);

      const response = await axiosInstance.patch(
        `/service-registrations/${serviceRegistrationId}`,
        payload
      );
      console.log("Update service registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating service registration:", error);

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
   * Xóa service registration
   * @param {number} serviceRegistrationId - ID của service registration
   * @returns {Promise} Response xác nhận xóa
   */
  async deleteServiceRegistration(serviceRegistrationId) {
    try {
      console.log("Deleting service registration:", serviceRegistrationId);
      const response = await axiosInstance.delete(
        `/service-registrations/${serviceRegistrationId}`
      );
      console.log("Delete service registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting service registration:", error);
      throw error;
    }
  },

  /**
   * Lấy thống kê service registrations
   * @returns {Promise} Response chứa thống kê
   */
  async getServiceRegistrationStats() {
    try {
      console.log("Fetching service registration stats...");

      // Gọi API để lấy tất cả service registrations (không phân trang)
      const response = await axiosInstance.get("/service-registrations", {
        params: { limit: 100 }, // Lấy số lượng lớn để tính thống kê
      });

      const registrations = response.data.results || [];

      // Tính toán thống kê
      const stats = {
        total: registrations.length,
        active: 0,
        inactive: 0,
        cancelled: 0,
        statusDistribution: {},
        apartmentDistribution: {},
        serviceTypeDistribution: {},
      };

      registrations.forEach((reg) => {
        // Thống kê theo status
        const status = reg.status || "Unknown";
        stats.statusDistribution[status] =
          (stats.statusDistribution[status] || 0) + 1;

        if (status === "Active") stats.active++;
        else if (status === "Inactive") stats.inactive++;
        else if (status === "Cancelled") stats.cancelled++;

        // Thống kê theo apartment
        const apartmentId = reg.apartmentId || "Unknown";
        stats.apartmentDistribution[apartmentId] =
          (stats.apartmentDistribution[apartmentId] || 0) + 1;

        // Thống kê theo service type
        const serviceTypeId = reg.serviceTypeId || "Unknown";
        stats.serviceTypeDistribution[serviceTypeId] =
          (stats.serviceTypeDistribution[serviceTypeId] || 0) + 1;
      });

      console.log("Service registration stats:", stats);
      return stats;
    } catch (error) {
      console.error("Error fetching service registration stats:", error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        cancelled: 0,
        statusDistribution: {},
        apartmentDistribution: {},
        serviceTypeDistribution: {},
      };
    }
  },
};

export default serviceRegistrationService;
