import axiosInstance from "./axiosConfig";

/**
 * Service for managing roles and permissions
 * API endpoints: /roles
 */
const roleService = {
  /**
   * Lấy danh sách tất cả roles có sẵn
   * @returns {Promise} Response chứa danh sách roles
   */
  async getAllRoles() {
    try {
      console.log("Loading all roles...");
      const response = await axiosInstance.get("/roles");

      return {
        roles: response.data.roles || [],
      };
    } catch (error) {
      console.error("Error loading roles:", error);
      throw error;
    }
  },

  /**
   * Lấy permissions của một role cụ thể
   * @param {string} role - Tên role (resident, manager, admin)
   * @returns {Promise} Response chứa role và permissions
   */
  async getRolePermissions(role) {
    try {
      console.log("Loading permissions for role:", role);
      const response = await axiosInstance.get(`/roles/${role}/permissions`);

      return {
        role: response.data.role,
        permissions: response.data.permissions || [],
      };
    } catch (error) {
      console.error("Error loading role permissions:", error);
      throw error;
    }
  },

  /**
   * Gán role cho user
   * @param {number} userId - ID của user
   * @param {string} role - Role cần gán (resident, manager, admin)
   * @returns {Promise} Response xác nhận gán role
   */
  async assignRoleToUser(userId, role) {
    try {
      console.log("Assigning role to user:", { userId, role });

      const payload = {
        role: role,
      };

      console.log("Payload to send:", payload);

      const response = await axiosInstance.post(
        `/roles/assign/${userId}`,
        payload
      );
      console.log("Assign role response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error assigning role:", error);

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
   * Utility function để lấy tên role hiển thị
   * @param {string} role - Role key
   * @returns {string} Role display name
   */
  getRoleDisplayName(role) {
    const roleNames = {
      resident: "Cư dân",
      manager: "Quản lý",
      admin: "Quản trị viên",
    };
    return roleNames[role] || role;
  },

  /**
   * Utility function để lấy màu tag cho role
   * @param {string} role - Role key
   * @returns {string} Color for tag
   */
  getRoleColor(role) {
    const roleColors = {
      resident: "blue",
      manager: "orange",
      admin: "red",
    };
    return roleColors[role] || "default";
  },

  /**
   * Utility function để lấy danh sách roles cho Select
   * @returns {Array} Array of role options
   */
  getRoleOptions() {
    return [
      { value: "resident", label: "Cư dân", color: "blue" },
      { value: "manager", label: "Quản lý", color: "orange" },
      { value: "admin", label: "Quản trị viên", color: "red" },
    ];
  },
};

export default roleService;
