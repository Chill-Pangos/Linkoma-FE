import React from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  HomeOutlined,
  ToolOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  BellOutlined,
  BarChartOutlined,
  MessageOutlined,
  TeamOutlined,
  DollarOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const SidebarMenu = ({ collapsed, userRole = "admin" }) => {
  const location = useLocation();

  const getMenuItems = () => {
    const adminMenuItems = [
      {
        key: "/admin/dashboard",
        icon: <DashboardOutlined />,
        label: <Link to="/admin/dashboard">Dashboard</Link>,
      },
      {
        type: "divider",
      },
      {
        key: "user-management",
        label: "Quản lý người dùng",
        icon: <UserOutlined />,
        children: [
          {
            key: "/admin/users",
            label: <Link to="/admin/users">Tài khoản hệ thống</Link>,
          },
          {
            key: "/admin/residents",
            label: <Link to="/admin/residents">Cư dân</Link>,
          },
        ],
      },
      {
        key: "property-management",
        label: "Quản lý tài sản",
        icon: <HomeOutlined />,
        children: [
          {
            key: "/admin/apartments",
            label: <Link to="/admin/apartments">Căn hộ</Link>,
          },
          {
            key: "/admin/apartment-types",
            label: <Link to="/admin/apartment-types">Loại căn hộ</Link>,
          },
          {
            key: "/admin/services",
            label: <Link to="/admin/services">Dịch vụ</Link>,
          },
          {
            key: "/admin/service-registrations",
            label: (
              <Link to="/admin/service-registrations">Đăng ký dịch vụ</Link>
            ),
          },
        ],
      },
      {
        key: "financial-management",
        label: "Quản lý tài chính",
        icon: <DollarOutlined />,
        children: [
          {
            key: "/admin/invoices",
            label: <Link to="/admin/invoices">Hóa đơn</Link>,
          },
        ],
      },
      {
        key: "operations",
        label: "Vận hành",
        icon: <ToolOutlined />,
        children: [
          {
            key: "/admin/maintenance",
            label: <Link to="/admin/maintenance">Bảo trì</Link>,
          },
          {
            key: "/admin/feedback",
            label: <Link to="/admin/feedback">Phản hồi</Link>,
          },
        ],
      },
      {
        key: "communications",
        label: "Truyền thông",
        icon: <BellOutlined />,
        children: [
          {
            key: "/admin/notifications",
            label: <Link to="/admin/notifications">Thông báo & Sự kiện</Link>,
          },
        ],
      },
      {
        key: "/admin/reports",
        icon: <BarChartOutlined />,
        label: <Link to="/admin/reports">Báo cáo & Thống kê</Link>,
      },
    ];
    const managerMenuItems = [
      {
        key: "/manager/dashboard",
        icon: <DashboardOutlined />,
        label: <Link to="/manager/dashboard">Dashboard</Link>,
      },
      {
        key: "/manager/residents",
        icon: <TeamOutlined />,
        label: <Link to="/manager/residents">Quản lý cư dân</Link>,
      },
      {
        key: "/manager/maintenance",
        icon: <ToolOutlined />,
        label: <Link to="/manager/maintenance">Bảo trì</Link>,
      },
      {
        key: "/manager/feedback",
        icon: <MessageOutlined />,
        label: <Link to="/manager/feedback">Phản hồi</Link>,
      },
      {
        key: "/manager/reports",
        icon: <BarChartOutlined />,
        label: <Link to="/manager/reports">Báo cáo</Link>,
      },
    ];
    const residentMenuItems = [
      {
        key: "/resident/dashboard",
        icon: <DashboardOutlined />,
        label: <Link to="/resident/dashboard">Trang chủ</Link>,
      },
      {
        key: "/resident/profile",
        icon: <UserOutlined />,
        label: <Link to="/resident/profile">Hồ sơ cá nhân</Link>,
      },
      {
        key: "/resident/bills",
        icon: <DollarOutlined />,
        label: <Link to="/resident/bills">Hóa đơn của tôi</Link>,
      },
      {
        key: "/resident/maintenance",
        icon: <ToolOutlined />,
        label: <Link to="/resident/maintenance">Yêu cầu bảo trì</Link>,
      },
      {
        key: "/resident/services",
        icon: <ShopOutlined />,
        label: <Link to="/resident/services">Dịch vụ cư dân</Link>,
      },
      {
        key: "/resident/feedback",
        icon: <MessageOutlined />,
        label: <Link to="/resident/feedback">Gửi phản hồi</Link>,
      },
      {
        key: "/resident/notifications",
        icon: <BellOutlined />,
        label: <Link to="/resident/notifications">Thông báo</Link>,
      },
    ];

    switch (userRole) {
      case "manager":
        return managerMenuItems;
      case "resident":
        return residentMenuItems;
      default:
        return adminMenuItems;
    }
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      defaultOpenKeys={[
        "user-management",
        "property-management",
        "financial-management",
        "operations",
        "communications",
      ]}
      inlineCollapsed={collapsed}
      style={{
        height: "100%",
        borderRight: 0,
        background: "transparent",
        paddingTop: "8px",
      }}
      theme="dark"
      items={getMenuItems()}
    />
  );
};

export default SidebarMenu;
