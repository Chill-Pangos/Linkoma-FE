// routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
/* import { useAuth } from './../hooks/useAuth'; */

import Login from "../pages/Auth/Login";
// import Register from './pages/public/Register';
// import Home from './pages/public/Home';
import NotFoundPage from "../pages/NotFoundPage";

import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";


/* import ManagerDashboard from './pages/manager/ManagerDashboard';
import ResidentDashboard from './pages/resident/ResidentDashboard'; */

// Middleware kiểm tra quyền
const RequireAuth = ({ role, children }) => {
  /* const { user } = useAuth(); // custom hook lấy thông tin user (token, role,...)
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/unauthorized" />; */
  if (role != "") return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path="*" element={<NotFoundPage />} />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <RequireAuth role="admin">
            <AdminLayout>
              <AdminDashboard></AdminDashboard>
            </AdminLayout>
          </RequireAuth>
        }
      />

      {/* Manager routes */}
      <Route
        path="/manager/dashboard"
        element={
          <RequireAuth role="manager">
            {/* <ManagerDashboard /> */}
            <></>
          </RequireAuth>
        }
      />

      {/* Resident routes */}
      <Route
        path="/resident/dashboard"
        element={
          <RequireAuth role="resident">
            {/* <ResidentDashboard /> */}
            <></>
          </RequireAuth>
        }
      />
    </Routes>
  );
}
