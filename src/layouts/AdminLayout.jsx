import React, { useState } from "react";
import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import getPageTitle from "../utils/getPageTitle";
const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const [selectedPage, setSelectedPage] = useState("");
  const navigate = useNavigate();
  const handleMenuClick = (e) => {
    switch (e.key) {
      case "dashboard":
        setSelectedPage(e.key);
        navigate("/admin/dashboard");
        break;
      case "users":
        setSelectedPage(e.key);
        navigate("/admin/users");
        break;
      case "apartment":
        setSelectedPage(e.key);
        navigate("/admin/apartments");
        break;
      case "invoice":
        setSelectedPage(e.key);
        navigate("/admin/invoices");
        break;
      case "feedback":
        setSelectedPage(e.key);
        navigate("/admin/feedbacks");
        break;
      default:
        break;
    }
  };
  return (
    <Layout style={{ minHeight: "100vh",minWidth:"100vw" }}>
      <Sider breakpoint="lg" collapsible>
        <div className="logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
          <img src="/src/assets/LINKOMA_WEB_LOGO_HORIZONTAL.png" alt="logo" style={{ width: "70%" }} />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]} onClick={handleMenuClick}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Tổng quan
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
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
          <Typography.Title level={3} style={{ margin: 0 }}>{selectedPage?getPageTitle(selectedPage):"Chào mừng trở lại!"}</Typography.Title>
          <Typography.Title level={5} style={{margin:0}}>Admin</Typography.Title> 
        </Header>
        <Content style={{ margin: "24px 16px", overflow: "initial" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
