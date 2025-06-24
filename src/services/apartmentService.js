import axiosInstance from "./axiosConfig";

/**
 * Apartment Service - Xử lý các API liên quan đến căn hộ
 */
export const apartmentService = {
  /**
   * Lấy danh sách tất cả căn hộ với filter và pagination
   * @param {Object} params - Các tham số filter và pagination
   * @param {number} params.apartmentTypeId - Filter theo loại căn hộ
   * @param {number} params.floor - Filter theo tầng
   * @param {string} params.status - Filter theo trạng thái (available, rented, maintenance)
   * @param {string} params.sortBy - Sắp xếp theo field:desc/asc (vd: floor:asc)
   * @param {number} params.limit - Số lượng căn hộ tối đa (mặc định 10)
   * @param {number} params.page - Số trang (mặc định 1)
   * @returns {Promise<Object>} Danh sách căn hộ với pagination
   */
  async getAllApartments(params = {}) {
    try {
      const response = await axiosInstance.get("/apartments", { params });
      console.log("Get all apartments response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting all apartments:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một căn hộ
   * @param {number} apartmentId - ID của căn hộ
   * @returns {Promise<Object>} Thông tin chi tiết căn hộ
   */
  async getApartmentById(apartmentId) {
    try {
      const response = await axiosInstance.get(`/apartments/${apartmentId}`);
      console.log("Get apartment by ID response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting apartment by ID:", error);
      throw error;
    }
  },

  /**
   * Tạo căn hộ mới
   * @param {Object} apartmentData - Dữ liệu căn hộ mới
   * @param {number} apartmentData.apartmentTypeId - ID loại căn hộ
   * @param {number} apartmentData.floor - Số tầng
   * @param {string} apartmentData.status - Trạng thái (available, rented, maintenance)
   * @returns {Promise<Object>} Căn hộ vừa tạo
   */
  async createApartment(apartmentData) {
    try {
      const response = await axiosInstance.post("/apartments", apartmentData);
      console.log("Create apartment response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating apartment:", error);
      throw error;
    }
  },

  /**
   * Cập nhật căn hộ
   * @param {number} apartmentId - ID căn hộ cần cập nhật
   * @param {Object} updateData - Dữ liệu cập nhật
   * @param {number} updateData.apartmentTypeId - ID loại căn hộ (optional)
   * @param {number} updateData.floor - Số tầng (optional)
   * @param {string} updateData.status - Trạng thái (optional)
   * @returns {Promise<Object>} Căn hộ sau khi cập nhật
   */
  async updateApartment(apartmentId, updateData) {
    try {
      const response = await axiosInstance.patch(
        `/apartments/${apartmentId}`,
        updateData
      );
      console.log("Update apartment response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating apartment:", error);
      throw error;
    }
  },

  /**
   * Xóa căn hộ
   * @param {number} apartmentId - ID căn hộ cần xóa
   * @returns {Promise<void>}
   */
  async deleteApartment(apartmentId) {
    try {
      const response = await axiosInstance.delete(`/apartments/${apartmentId}`);
      console.log("Delete apartment response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting apartment:", error);
      throw error;
    }
  },
  /**
   * Lấy thống kê căn hộ theo trạng thái
   * @returns {Promise<Object>} Thống kê căn hộ
   */
  async getApartmentStats() {
    try {
      // Gọi 3 API riêng biệt để lấy thống kê chính xác từ server
      const [
        totalResponse,
        availableResponse,
        rentedResponse,
        maintenanceResponse,
      ] = await Promise.all([
        this.getAllApartments({ limit: 1 }), // Chỉ cần pagination info
        this.getAllApartments({ status: "available", limit: 1 }),
        this.getAllApartments({ status: "rented", limit: 1 }),
        this.getAllApartments({ status: "maintenance", limit: 1 }),
      ]);

      const stats = {
        total: totalResponse.pagination?.totalResults || 0,
        available: availableResponse.pagination?.totalResults || 0,
        rented: rentedResponse.pagination?.totalResults || 0,
        maintenance: maintenanceResponse.pagination?.totalResults || 0,
      };

      console.log("Apartment stats:", stats);
      return stats;
    } catch (error) {
      console.error("Error getting apartment stats:", error);
      throw error;
    }
  },

  /**
   * Lấy căn hộ theo trạng thái
   * @param {string} status - Trạng thái căn hộ (available, rented, maintenance)
   * @param {Object} params - Các tham số khác
   * @returns {Promise<Object>} Danh sách căn hộ theo trạng thái
   */
  async getApartmentsByStatus(status, params = {}) {
    try {
      return await this.getAllApartments({ ...params, status });
    } catch (error) {
      console.error("Error getting apartments by status:", error);
      throw error;
    }
  },

  /**
   * Lấy căn hộ theo tầng
   * @param {number} floor - Số tầng
   * @param {Object} params - Các tham số khác
   * @returns {Promise<Object>} Danh sách căn hộ theo tầng
   */
  async getApartmentsByFloor(floor, params = {}) {
    try {
      return await this.getAllApartments({ ...params, floor });
    } catch (error) {
      console.error("Error getting apartments by floor:", error);
      throw error;
    }
  },

  /**
   * Lấy căn hộ theo loại căn hộ
   * @param {number} apartmentTypeId - ID loại căn hộ
   * @param {Object} params - Các tham số khác
   * @returns {Promise<Object>} Danh sách căn hộ theo loại
   */
  async getApartmentsByType(apartmentTypeId, params = {}) {
    try {
      return await this.getAllApartments({ ...params, apartmentTypeId });
    } catch (error) {
      console.error("Error getting apartments by type:", error);
      throw error;
    }
  },
};

export default apartmentService;
