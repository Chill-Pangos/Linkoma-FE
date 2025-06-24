import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDefaultRouteByRole } from "../utils/routeUtils";
import { Spin } from "antd";

const DashboardRedirect = () => {
  const { user, isAuthenticated, isInitialized } = useAuth();

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

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect dựa trên role
  const redirectPath = getDefaultRouteByRole(user?.role);
  return <Navigate to={redirectPath} replace />;
};

export default DashboardRedirect;
