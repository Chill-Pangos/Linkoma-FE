import axiosInstance from "./axiosConfig";

/**
 * Apartment Type Service - Xử lý các API liên quan đến loại căn hộ
 */
export const apartmentTypeService = {
  /**
   * Lấy danh sách tất cả loại căn hộ với filter và pagination
   * @param {Object} params - Các tham số filter và pagination
   * @param {string} params.typeName - Filter theo tên loại căn hộ (partial match)
   * @param {number} params.minArea - Filter diện tích tối thiểu
   * @param {number} params.maxArea - Filter diện tích tối đa
   * @param {number} params.numBedrooms - Filter theo số phòng ngủ
   * @param {number} params.numBathrooms - Filter theo số phòng tắm
   * @param {number} params.minRentFee - Filter giá thuê tối thiểu
   * @param {number} params.maxRentFee - Filter giá thuê tối đa
   * @param {string} params.sortBy - Sắp xếp theo field:desc/asc (vd: rentFee:asc)
   * @param {number} params.limit - Số lượng loại căn hộ tối đa (mặc định 10)
   * @param {number} params.page - Số trang (mặc định 1)
   * @returns {Promise<Object>} Danh sách loại căn hộ với pagination
   */
  async getAllApartmentTypes(params = {}) {
    try {
      const response = await axiosInstance.get("/apartment-types", { params });
      console.log("Get all apartment types response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting all apartment types:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một loại căn hộ
   * @param {number} apartmentTypeId - ID của loại căn hộ
   * @returns {Promise<Object>} Thông tin chi tiết loại căn hộ
   */
  async getApartmentTypeById(apartmentTypeId) {
    try {
      const response = await axiosInstance.get(
        `/apartment-types/${apartmentTypeId}`
      );
      console.log("Get apartment type by ID response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting apartment type by ID:", error);
      throw error;
    }
  },

  /**
   * Tạo loại căn hộ mới
   * @param {Object} apartmentTypeData - Dữ liệu loại căn hộ mới
   * @param {string} apartmentTypeData.typeName - Tên loại căn hộ
   * @param {number} apartmentTypeData.area - Diện tích
   * @param {number} apartmentTypeData.numBedrooms - Số phòng ngủ
   * @param {number} apartmentTypeData.numBathrooms - Số phòng tắm
   * @param {number} apartmentTypeData.rentFee - Giá thuê
   * @param {string} apartmentTypeData.description - Mô tả (optional)
   * @returns {Promise<Object>} Loại căn hộ vừa tạo
   */
  async createApartmentType(apartmentTypeData) {
    try {
      const response = await axiosInstance.post(
        "/apartment-types",
        apartmentTypeData
      );
      console.log("Create apartment type response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating apartment type:", error);
      throw error;
    }
  },

  /**
   * Cập nhật loại căn hộ
   * @param {number} apartmentTypeId - ID loại căn hộ cần cập nhật
   * @param {Object} updateData - Dữ liệu cập nhật
   * @param {string} updateData.typeName - Tên loại căn hộ (optional)
   * @param {number} updateData.area - Diện tích (optional)
   * @param {number} updateData.numBedrooms - Số phòng ngủ (optional)
   * @param {number} updateData.numBathrooms - Số phòng tắm (optional)
   * @param {number} updateData.rentFee - Giá thuê (optional)
   * @param {string} updateData.description - Mô tả (optional)
   * @returns {Promise<Object>} Loại căn hộ sau khi cập nhật
   */
  async updateApartmentType(apartmentTypeId, updateData) {
    try {
      const response = await axiosInstance.patch(
        `/apartment-types/${apartmentTypeId}`,
        updateData
      );
      console.log("Update apartment type response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating apartment type:", error);
      throw error;
    }
  },

  /**
   * Xóa loại căn hộ
   * @param {number} apartmentTypeId - ID loại căn hộ cần xóa
   * @returns {Promise<void>}
   */
  async deleteApartmentType(apartmentTypeId) {
    try {
      const response = await axiosInstance.delete(
        `/apartment-types/${apartmentTypeId}`
      );
      console.log("Delete apartment type response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting apartment type:", error);
      throw error;
    }
  },

  /**
   * Lấy thống kê loại căn hộ
   * @returns {Promise<Object>} Thống kê loại căn hộ
   */
  async getApartmentTypeStats() {
    try {
      // Lấy tất cả loại căn hộ để tính thống kê
      const allTypes = await this.getAllApartmentTypes({ limit: 100 });

      const stats = {
        total: allTypes.apartmentTypes.length,
        avgArea:
          allTypes.apartmentTypes.reduce((sum, type) => sum + type.area, 0) /
            allTypes.apartmentTypes.length || 0,
        avgRentFee:
          allTypes.apartmentTypes.reduce(
            (sum, type) => sum + parseFloat(type.rentFee),
            0
          ) / allTypes.apartmentTypes.length || 0,
        minRentFee: Math.min(
          ...allTypes.apartmentTypes.map((type) => parseFloat(type.rentFee))
        ),
        maxRentFee: Math.max(
          ...allTypes.apartmentTypes.map((type) => parseFloat(type.rentFee))
        ),
        bedroomDistribution: allTypes.apartmentTypes.reduce((acc, type) => {
          acc[type.numBedrooms] = (acc[type.numBedrooms] || 0) + 1;
          return acc;
        }, {}),
      };

      console.log("Apartment type stats:", stats);
      return stats;
    } catch (error) {
      console.error("Error getting apartment type stats:", error);
      throw error;
    }
  },

  /**
   * Tìm kiếm loại căn hộ theo tên
   * @param {string} typeName - Tên loại căn hộ cần tìm
   * @param {Object} params - Các tham số khác
   * @returns {Promise<Object>} Danh sách loại căn hộ phù hợp
   */
  async searchApartmentTypesByName(typeName, params = {}) {
    try {
      return await this.getAllApartmentTypes({ ...params, typeName });
    } catch (error) {
      console.error("Error searching apartment types by name:", error);
      throw error;
    }
  },

  /**
   * Lấy loại căn hộ theo khoảng giá
   * @param {number} minRentFee - Giá thuê tối thiểu
   * @param {number} maxRentFee - Giá thuê tối đa
   * @param {Object} params - Các tham số khác
   * @returns {Promise<Object>} Danh sách loại căn hộ trong khoảng giá
   */
  async getApartmentTypesByPriceRange(minRentFee, maxRentFee, params = {}) {
    try {
      return await this.getAllApartmentTypes({
        ...params,
        minRentFee,
        maxRentFee,
      });
    } catch (error) {
      console.error("Error getting apartment types by price range:", error);
      throw error;
    }
  },

  /**
   * Lấy loại căn hộ theo số phòng ngủ
   * @param {number} numBedrooms - Số phòng ngủ
   * @param {Object} params - Các tham số khác
   * @returns {Promise<Object>} Danh sách loại căn hộ theo số phòng ngủ
   */
  async getApartmentTypesByBedrooms(numBedrooms, params = {}) {
    try {
      return await this.getAllApartmentTypes({ ...params, numBedrooms });
    } catch (error) {
      console.error("Error getting apartment types by bedrooms:", error);
      throw error;
    }
  },
};

export default apartmentTypeService;
