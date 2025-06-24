/**
 * Lấy default route dựa trên role của user
 * @param {string} role - User role
 * @returns {string} - Default route path
 */
export const getDefaultRouteByRole = (role) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "manager":
      return "/manager/dashboard";
    case "resident":
      return "/resident/dashboard";
    default:
      return "/login";
  }
};

/**
 * Kiểm tra xem user có quyền truy cập route không
 * @param {string} userRole - Role của user
 * @param {string} routePath - Path của route
 * @returns {boolean} - true nếu có quyền
 */
export const canAccessRoute = (userRole, routePath) => {
  if (!userRole || !routePath) return false;

  // Admin có thể truy cập tất cả routes
  if (userRole === "admin") return true;

  // Manager chỉ có thể truy cập manager routes và một số admin routes
  if (userRole === "manager") {
    return (
      routePath.startsWith("/manager") ||
      routePath.startsWith("/admin/residents") ||
      routePath.startsWith("/admin/maintenance") ||
      routePath.startsWith("/admin/feedback")
    );
  }

  // Resident chỉ có thể truy cập resident routes
  if (userRole === "resident") {
    return routePath.startsWith("/resident");
  }

  return false;
};

/**
 * Redirect về route phù hợp dựa trên role
 * @param {object} user - User object
 * @param {string} intendedPath - Path user muốn truy cập
 * @returns {string} - Route path để redirect
 */
export const getRedirectPath = (user, intendedPath = null) => {
  if (!user || !user.role) {
    return "/login";
  }

  // Nếu có intended path và user có quyền truy cập
  if (intendedPath && canAccessRoute(user.role, intendedPath)) {
    return intendedPath;
  }

  // Ngược lại redirect về default route của role
  return getDefaultRouteByRole(user.role);
};
