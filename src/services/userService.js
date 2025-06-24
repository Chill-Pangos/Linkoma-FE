import axiosInstance from "./axiosConfig";

export const userService = {
  // Lấy danh sách tất cả người dùng
  getAllUsers: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get("/users", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Lấy người dùng theo role
  getUsersByRole: async (role) => {
    try {
      const response = await axiosInstance.get(`/users/role/${role}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users by role:", error);
      throw error;
    }
  },

  // Lấy thống kê số lượng người dùng theo role
  getUserStats: async () => {
    try {
      const response = await axiosInstance.get("/users/stats/count-by-role");
      return response.data;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  },

  // Lấy thông tin một người dùng
  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  // Tạo người dùng mới
  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Cập nhật người dùng
  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Xóa người dùng
  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};

export default userService;
