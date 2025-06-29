import { Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import NotFoundPage from "../pages/NotFoundPage";

// Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import UserManagement from "../pages/Admin/UserManagement/UserManagement";
import ResidentManagement from "../pages/Admin/ResidentManagement/ResidentManagement";
import ApartmentManagement from "../pages/Admin/ApartmentManagement/ApartmentManagement";
import ApartmentTypeManagement from "../pages/Admin/ApartmentTypeManagement/ApartmentTypeManagement";
import ServiceManagement from "../pages/Admin/ServiceManagement/ServiceManagement";
import ServiceRegistrationManagement from "../pages/Admin/ServiceRegistrationManagement/ServiceRegistrationManagement";
import BillManagement from "../pages/Admin/BillManagement/BillManagement";
import MaintenanceManagement from "../pages/Admin/MaintenanceManagement/MaintenanceManagement";
import FeedbackManagement from "../pages/Admin/FeedbackManagement/FeedbackManagement";
import EventNotificationManagement from "../pages/Admin/EventNotificationManagement/EventNotificationManagement";
import ReportManagement from "../pages/Admin/Reports/ReportManagement";

// Resident Pages
import {
  ResidentDashboard,
  ResidentProfile,
  ResidentBills,
  ResidentMaintenance,
  ResidentFeedback,
  ResidentNotifications,
  ResidentServices,
} from "../pages/Resident";

// Manager Pages
import { ManagerDashboard, ManagerReports } from "../pages/Manager";

// Layout and Components
import AdminLayout from "../layouts/AdminLayout";
import { ProtectedRoute, DashboardRedirect } from "../components";

// Placeholder Pages
const PlaceholderPage = ({ title, description }) => (
  <div style={{ padding: 48, textAlign: "center" }}>
    <h1 style={{ fontSize: 36 }}>{title}</h1>
    <p style={{ fontSize: 16 }}>{description}</p>
    <div style={{ marginTop: 24 }}>
      <span style={{ color: "#888" }}>🚧 Trang đang được phát triển</span>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Dashboard redirect - auto redirect based on role */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <Routes>
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="residents" element={<ResidentManagement />} />
                <Route path="apartments" element={<ApartmentManagement />} />
                <Route
                  path="apartment-types"
                  element={<ApartmentTypeManagement />}
                />
                <Route path="services" element={<ServiceManagement />} />
                <Route
                  path="service-registrations"
                  element={<ServiceRegistrationManagement />}
                />
                <Route path="invoices" element={<BillManagement />} />
                <Route path="maintenance" element={<MaintenanceManagement />} />
                <Route path="feedback" element={<FeedbackManagement />} />
                <Route
                  path="notifications"
                  element={<EventNotificationManagement />}
                />
                <Route path="reports" element={<ReportManagement />} />
                {/* Placeholder routes */}
                <Route
                  path="users/add"
                  element={
                    <PlaceholderPage
                      title="Thêm Tài Khoản"
                      description="Trang thêm tài khoản mới cho hệ thống"
                    />
                  }
                />
                <Route
                  path="users/:id/edit"
                  element={
                    <PlaceholderPage
                      title="Chỉnh Sửa Tài Khoản"
                      description="Trang chỉnh sửa thông tin tài khoản"
                    />
                  }
                />
                <Route
                  path="residents/add"
                  element={
                    <PlaceholderPage
                      title="Thêm Cư Dân"
                      description="Trang đăng ký cư dân mới"
                    />
                  }
                />
                <Route
                  path="apartments/:id/details"
                  element={
                    <PlaceholderPage
                      title="Chi Tiết Căn Hộ"
                      description="Thông tin chi tiết và lịch sử căn hộ"
                    />
                  }
                />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Manager Routes */}
      <Route
        path="/manager/*"
        element={
          <ProtectedRoute requiredRole="manager">
            <AdminLayout>
              <Routes>
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ManagerDashboard />} />
                <Route path="residents" element={<ResidentManagement />} />
                <Route path="maintenance" element={<MaintenanceManagement />} />
                <Route path="feedback" element={<FeedbackManagement />} />
                <Route path="reports" element={<ManagerReports />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Resident Routes */}
      <Route
        path="/resident/*"
        element={
          <ProtectedRoute requiredRole="resident">
            <AdminLayout>
              <Routes>
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ResidentDashboard />} />
                <Route path="profile" element={<ResidentProfile />} />
                <Route path="bills" element={<ResidentBills />} />
                <Route path="maintenance" element={<ResidentMaintenance />} />
                <Route path="feedback" element={<ResidentFeedback />} />
                <Route path="services" element={<ResidentServices />} />
                <Route
                  path="notifications"
                  element={<ResidentNotifications />}
                />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Error Routes */}
      <Route
        path="/unauthorized"
        element={
          <div style={{ padding: 48, textAlign: "center" }}>
            <h1 style={{ fontSize: 72, color: "#f5222d" }}>403</h1>
            <h2>Không có quyền truy cập</h2>
            <button
              onClick={() => window.history.back()}
              style={{
                padding: 12,
                background: "#1890ff",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Quay lại
            </button>
          </div>
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
