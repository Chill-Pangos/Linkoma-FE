import axiosInstance from "./axiosConfig";

/**
 * Service Types & Service Registrations API
 */
const serviceService = {
  /**
   * Lấy danh sách service types
   * @returns {Promise} Response chứa danh sách service types
   */
  async getServiceTypes() {
    try {
      const response = await axiosInstance.get("/service-types");
      return response.data;
    } catch (error) {
      console.error("Error getting service types:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách service registrations
   * @param {Object} params - Query parameters
   * @param {number} params.apartmentId - Filter by apartment ID
   * @param {number} params.serviceTypeId - Filter by service type ID
   * @param {string} params.status - Filter by status (Active, Inactive, Cancelled)
   * @param {string} params.startDate - Filter by start date
   * @param {string} params.endDate - Filter by end date
   * @param {string} params.sortBy - Sort by field:order (e.g., startDate:desc)
   * @param {number} params.limit - Maximum number of registrations (default: 10)
   * @param {number} params.page - Page number (default: 1)
   * @returns {Promise} Response chứa danh sách service registrations
   */
  async getServiceRegistrations(params = {}) {
    try {
      const response = await axiosInstance.get("/service-registrations", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting service registrations:", error);
      throw error;
    }
  },

  /**
   * Tạo service registration mới
   * @param {Object} registrationData - Dữ liệu registration
   * @param {number} registrationData.apartmentId - ID của apartment
   * @param {number} registrationData.serviceTypeId - ID của service type
   * @param {string} registrationData.startDate - Ngày bắt đầu (YYYY-MM-DD)
   * @param {string} registrationData.endDate - Ngày kết thúc (YYYY-MM-DD)
   * @param {string} registrationData.status - Trạng thái (Active, Inactive, Cancelled)
   * @param {string} registrationData.note - Ghi chú
   * @returns {Promise} Response của registration được tạo
   */
  async createServiceRegistration(registrationData) {
    try {
      const response = await axiosInstance.post(
        "/service-registrations",
        registrationData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating service registration:", error);
      throw error;
    }
  },

  /**
   * Lấy service registration theo ID
   * @param {number} id - ID của service registration
   * @returns {Promise} Response chứa service registration
   */
  async getServiceRegistrationById(id) {
    try {
      const response = await axiosInstance.get(`/service-registrations/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting service registration:", error);
      throw error;
    }
  },

  /**
   * Cập nhật service registration
   * @param {number} id - ID của service registration
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise} Response của registration được cập nhật
   */
  async updateServiceRegistration(id, updateData) {
    try {
      const response = await axiosInstance.patch(
        `/service-registrations/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating service registration:", error);
      throw error;
    }
  },

  /**
   * Xóa service registration
   * @param {number} id - ID của service registration
   * @returns {Promise} Response xác nhận xóa
   */
  async deleteServiceRegistration(id) {
    try {
      const response = await axiosInstance.delete(
        `/service-registrations/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting service registration:", error);
      throw error;
    }
  },
};

export default serviceService;
