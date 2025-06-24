/**
 * Decode JWT token
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload hoặc null nếu invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

/**
 * Kiểm tra token có hết hạn không
 * @param {string} token - JWT token
 * @returns {boolean} - true nếu token còn hạn
 */
export const isTokenValid = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return false;

  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

/**
 * Lấy thời gian hết hạn của token
 * @param {string} token - JWT token
 * @returns {Date|null} - Thời gian hết hạn hoặc null
 */
export const getTokenExpiry = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;

  return new Date(decoded.exp * 1000);
};

/**
 * Format error message từ API response
 * @param {Error} error - Error object
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.message) {
    return error.message;
  }

  return "Có lỗi xảy ra, vui lòng thử lại!";
};

/**
 * Lấy role từ user object
 * @param {object} user - User object
 * @returns {string} - User role
 */
export const getUserRole = (user) => {
  return user?.role || "guest";
};

/**
 * Kiểm tra user có quyền truy cập không
 * @param {object} user - User object
 * @param {string|array} requiredRoles - Required role(s)
 * @returns {boolean} - true nếu có quyền
 */
export const hasPermission = (user, requiredRoles) => {
  if (!user || !requiredRoles) return false;

  const userRole = getUserRole(user);

  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }

  return userRole === requiredRoles;
};
