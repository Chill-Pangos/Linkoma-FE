import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh",minWidth:"100vw" }}>
      <Sider breakpoint="lg" collapsible>
        <div className="logo" style={{ padding: 16 }}>
          <img src="/logo.png" alt="logo" style={{ width: "100%" }} />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Tổng quan
          </Menu.Item>
          <Menu.Item key="account" icon={<UserOutlined />}>
            Quản lý Tài khoản
          </Menu.Item>
          <Menu.Item key="apartment" icon={<ApartmentOutlined />}>
            Quản lý Căn hộ
          </Menu.Item>
          <Menu.Item key="invoice" icon={<FileTextOutlined />}>
            Dịch vụ & Hóa đơn
          </Menu.Item>
          <Menu.Item key="feedback" icon={<MessageOutlined />}>
            Phản hồi cư dân
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            backgroundColor: "#fff",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div></div>
          <div>Serati Mã 🔔 💬</div>
        </Header>
        <Content style={{ margin: "24px 16px", overflow: "initial" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
