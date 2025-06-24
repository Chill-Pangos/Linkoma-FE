import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const location = useLocation();

  // Hiển thị loading khi đang khởi tạo
  if (!isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Chưa đăng nhập, redirect về login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // Kiểm tra role nếu được yêu cầu
  if (requiredRole) {
    const userRole = user?.role;

    // Nếu requiredRole là array
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
    // Nếu requiredRole là string
    else if (userRole !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
