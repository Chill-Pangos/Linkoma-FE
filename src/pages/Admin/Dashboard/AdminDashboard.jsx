import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Avatar,
  Badge,
  Spin,
  message,
} from "antd";
import {
  UserOutlined,
  HomeOutlined,
  DollarOutlined,
  FileTextOutlined,
  BellOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { adminService } from "../../../services";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardVN();
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      message.error("Không thể tải dữ liệu dashboard!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          minHeight: "100vh",
        }}
      >
        <Typography.Text>Không thể tải dữ liệu dashboard</Typography.Text>
      </div>
    );
  }

  const { mainStats, quickOverview, recentActivities } = dashboardData;
  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Title
              level={2}
              style={{
                margin: 0,
                background: "linear-gradient(135deg, #1890ff, #722ed1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Linkoma Admin Dashboard 🏢
            </Title>
            <Text style={{ color: "#666" }}>Chào mừng bạn trở lại!</Text>
          </div>
          {/* <Space>
            <Badge count={5}>
              <Avatar
                icon={<BellOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              />
            </Badge>
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: "#52c41a" }}
            />
          </Space> */}
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={24} lg={8}>
          <Card
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              height: "100%",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Doanh Thu Tháng
                </span>
              }
              value={mainStats.monthlyRevenue.amount}
              suffix="VNĐ"
              prefix={<DollarOutlined style={{ color: "white" }} />}
              valueStyle={{
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              {mainStats.monthlyRevenue.change >= 0 ? (
                <ArrowUpOutlined
                  style={{ color: "#52c41a", marginRight: "4px" }}
                />
              ) : (
                <ArrowDownOutlined
                  style={{ color: "#f5222d", marginRight: "4px" }}
                />
              )}
              <Text
                style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}
              >
                {mainStats.monthlyRevenue.changeText}
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
               height: "100%",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>Cư Dân</span>
              }
              value={mainStats.residents.total}
              suffix="người"
              prefix={<UserOutlined style={{ color: "white" }} />}
              valueStyle={{
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
               height: "100%",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Căn Hộ Có Cư Dân
                </span>
              }
              value={mainStats.apartments.occupied}
              suffix="căn"
              prefix={<HomeOutlined style={{ color: "white" }} />}
              valueStyle={{
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            />
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
              {mainStats.apartments.availableText}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Quick Summary */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="📊 Tổng Quan Nhanh"
            style={{
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              border: "none",
               height: "100%",
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>{quickOverview.occupancyRate.text}:</Text>
                <Text strong style={{ color: "#52c41a" }}>
                  {quickOverview.occupancyRate.percentage}%
                </Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>{quickOverview.paymentRate.text}:</Text>
                <Text strong style={{ color: "#1890ff" }}>
                  {quickOverview.paymentRate.percentage}%
                </Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>{quickOverview.pendingFeedback.text}:</Text>
                <Text strong style={{ color: "#faad14" }}>
                  {quickOverview.pendingFeedback.count} vấn đề
                </Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>{quickOverview.maintenanceRequests.text}:</Text>
                <Text strong style={{ color: "#722ed1" }}>
                  {quickOverview.maintenanceRequests.count} yêu cầu
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="🔔 Hoạt Động Gần Đây"
            style={{
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              border: "none",
               height: "100%",
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {recentActivities.slice(0, 3).map((activity, index) => {
                // Determine avatar style based on activity type
                let avatarColor = "#1890ff";
                if (activity.type === "payment") avatarColor = "#52c41a";
                else if (activity.type === "maintenance")
                  avatarColor = "#faad14";
                else if (activity.type === "new_resident")
                  avatarColor = "#722ed1";

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 0",
                    }}
                  >
                    <Avatar
                      size="small"
                      style={{
                        backgroundColor: avatarColor,
                        marginRight: "12px",
                      }}
                    >
                      {activity.type === "payment"
                        ? "💰"
                        : activity.type === "maintenance"
                        ? "🔧"
                        : "👤"}
                    </Avatar>
                    <div>
                      <Text strong>{activity.message}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {activity.detail}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </Space>
          </Card>
        </Col>{" "}
      </Row>
    </div>
  );
};

export default AdminDashboard;
