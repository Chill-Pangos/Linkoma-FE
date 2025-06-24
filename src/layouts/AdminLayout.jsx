import React, { useState } from "react";
import {
  Layout,
  Typography,
  Avatar,
  Dropdown,
  Space,
  Button,
  Breadcrumb,
  Tag,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SidebarMenu from "./SidebarMenu";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Use real user data from auth, fallback to mock for demo
  const currentUser = user || {
    name: "Demo User",
    role: "manager",
    avatar: null,
    email: "demo@linkoma.com",
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: navigate to login anyway
      navigate("/login");
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ cá nhân",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];
  const getPageTitleFromPath = (pathname) => {
    const pathMap = {
      // Admin routes
      "/admin/dashboard": "Dashboard",
      "/admin/users": "Quản lý tài khoản",
      "/admin/residents": "Quản lý cư dân",
      "/admin/apartments": "Quản lý căn hộ",
      "/admin/services": "Quản lý dịch vụ",
      "/admin/invoices": "Quản lý hóa đơn",
      "/admin/maintenance": "Bảo trì",
      "/admin/feedback": "Phản hồi cư dân",
      "/admin/notifications": "Thông báo & Sự kiện",
      "/admin/reports": "Báo cáo & Thống kê",
      // Manager routes
      "/manager/dashboard": "Dashboard",
      "/manager/residents": "Quản lý cư dân",
      "/manager/maintenance": "Bảo trì",
      "/manager/feedback": "Phản hồi cư dân",
      "/manager/reports": "Báo cáo quản lý",

      // Resident routes
      "/resident/dashboard": "Dashboard",
      "/resident/profile": "Hồ sơ cá nhân",
      "/resident/bills": "Hóa đơn của tôi",
      "/resident/maintenance": "Yêu cầu bảo trì",
      "/resident/feedback": "Gửi phản hồi",
      "/resident/services": "Đặt dịch vụ",
      "/resident/notifications": "Thông báo",
    };

    // Get the current page title based on pathname
    const title = pathMap[pathname];
    if (title) {
      return title;
    }

    // If no exact match, try to get title from the last segment
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length >= 2) {
      const lastSegment = segments[segments.length - 1];
      return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    }

    return "Dashboard";
  };
  const getBreadcrumbItems = (pathname) => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const items = [
      {
        href: "/",
        title: <HomeOutlined />,
      },
    ];

    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0];
      let segmentTitle = "";

      switch (firstSegment) {
        case "admin":
          segmentTitle = "Admin";
          break;
        case "manager":
          segmentTitle = "Manager";
          break;
        case "resident":
          segmentTitle = "Resident";
          break;
        default:
          segmentTitle =
            firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
      }

      items.push({
        title: segmentTitle,
      });
    }

    if (pathSegments.length > 1) {
      items.push({
        title: getPageTitleFromPath(pathname),
      });
    }

    return items;
  };

  const getRoleInfo = (role) => {
    switch (role) {
      case "admin":
        return {
          icon: <CrownOutlined />,
          color: "#722ed1",
          label: "Quản trị viên",
        };
      case "manager":
        return {
          icon: <SafetyCertificateOutlined />,
          color: "#1890ff",
          label: "Quản lý",
        };
      case "resident":
        return {
          icon: <TeamOutlined />,
          color: "#52c41a",
          label: "Cư dân",
        };
      default:
        return {
          icon: <UserOutlined />,
          color: "#999",
          label: "Người dùng",
        };
    }
  };

  const roleInfo = getRoleInfo(currentUser.role);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        style={{
          background: "linear-gradient(180deg, #1890ff 0%, #722ed1 100%)",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
        }}
        width={250}
        collapsedWidth={80}
      >
        {/* Logo Section */}
        <div
          style={{
            height: "64px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: collapsed ? "8px" : "16px",
            background: "rgba(255, 255, 255, 0.1)",
            margin: "8px",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#1890ff",
                fontSize: "16px",
              }}
            >
              L
            </div>
          ) : (
            <Title
              level={3}
              style={{
                color: "white",
                margin: 0,
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                letterSpacing: "1px",
              }}
            >
              LINKOMA
            </Title>
          )}
        </div>

        {/* Navigation Menu */}
        <SidebarMenu collapsed={collapsed} userRole={currentUser.role} />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 999,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 40,
                height: 40,
                color: "white",
                marginRight: "16px",
              }}
            />
            <div>
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: "white",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  fontWeight: "600",
                }}
              >
                {getPageTitleFromPath(location.pathname)}
              </Title>{" "}
              <Breadcrumb
                items={getBreadcrumbItems(location.pathname)}
                style={{
                  marginTop: "4px",
                  fontSize: "12px",
                }}
                itemRender={(route) => {
                  return (
                    <Text
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "12px",
                      }}
                    >
                      {route.title}
                    </Text>
                  );
                }}
              />
            </div>
          </div>
          <Space size="middle" style={{ alignItems: "center" }}>
            <Tag
              icon={roleInfo.icon}
              color={roleInfo.color}
              style={{
                marginRight: "4px",
                fontSize: "12px",
                padding: "4px 8px",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              {roleInfo.label}
            </Tag>
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => {
                  if (key === "logout") {
                    handleLogout();
                  }
                },
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                style={{
                  color: "white",
                  height: "48px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Avatar
                  size={32}
                  src={currentUser.avatar}
                  icon={!currentUser.avatar && <UserOutlined />}
                  style={{
                    background: currentUser.avatar
                      ? "transparent"
                      : "linear-gradient(135deg, #ff7a7a 0%, #ff9a9a 100%)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                  }}
                />
                <div
                  style={{
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minWidth: "120px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: "16px",
                      marginBottom: "2px",
                    }}
                  >
                    {currentUser.name}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      opacity: 0.8,
                      lineHeight: "14px",
                    }}
                  >
                    {currentUser.email}
                  </div>
                </div>
              </Button>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 0,
            minHeight: "calc(100vh - 64px)",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            overflow: "auto",
            position: "relative",
          }}
        >
          {" "}
          <div
            style={{
              padding: "0px",
              minHeight: "100%",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
