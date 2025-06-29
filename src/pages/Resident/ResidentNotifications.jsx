import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  List,
  Tag,
  Space,
  Button,
  Badge,
  Avatar,
  Tabs,
  Empty,
  Modal,
  message,
  Input,
  Tooltip,
} from "antd";
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  GiftOutlined,
  ToolOutlined,
  DollarOutlined,
  HomeOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { announcementService } from "../../services";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const ResidentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  // Load notifications from API
  const fetchNotifications = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const params = {
        limit: 20,
        page: 1,
        sortBy: "createdAt:desc",
        ...filters,
      };

      const response = await announcementService.getAllAnnouncements(params);

      // Transform API data to match UI format
      const transformedNotifications = response.announcements.map(
        (announcement) => ({
          id: announcement.announcementId,
          title: announcement.title,
          content: announcement.content,
          type: mapAnnouncementTypeToNotificationType(announcement.type),
          priority: announcement.priority?.toLowerCase() || "medium",
          status: "unread", // API doesn't have read status, assume unread
          sender: "Ban Quản Lý",
          createdDate: announcement.createdAt,
          readDate: null,
          targetAudience: "all",
          apartment: null,
          attachments: [],
        })
      );

      setNotifications(transformedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Không thể tải thông báo. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, []);

  // Map announcement type to notification type for UI
  const mapAnnouncementTypeToNotificationType = (announcementType) => {
    switch (announcementType) {
      case "Maintenance":
        return "maintenance";
      case "Event":
        return "event";
      case "Urgent":
        return "urgent";
      case "General":
      default:
        return "general";
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Filter notifications based on tab
    const filters = {};
    if (tab !== "all" && tab !== "unread" && tab !== "read") {
      // Map UI tab to API type
      switch (tab) {
        case "maintenance":
          filters.type = "Maintenance";
          break;
        case "event":
          filters.type = "Event";
          break;
        case "urgent":
          filters.type = "Urgent";
          break;
        case "general":
          filters.type = "General";
          break;
        default:
          break;
      }
      fetchNotifications(filters);
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId
            ? { ...notif, status: "read", readDate: new Date().toISOString() }
            : notif
        )
      );
      message.success("Đã đánh dấu là đã đọc");
    } catch (error) {
      console.error("Error marking as read:", error);
      message.error("Có lỗi xảy ra!");
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (notificationId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thông báo này?",
      onOk: async () => {
        try {
          setNotifications((prev) =>
            prev.filter((notif) => notif.id !== notificationId)
          );
          message.success("Đã xóa thông báo");
        } catch (error) {
          console.error("Error deleting notification:", error);
          message.error("Có lỗi xảy ra!");
        }
      },
    });
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          status: "read",
          readDate:
            notif.status === "unread"
              ? new Date().toISOString()
              : notif.readDate,
        }))
      );
      message.success("Đã đánh dấu tất cả là đã đọc");
    } catch (error) {
      console.error("Error marking all as read:", error);
      message.error("Có lỗi xảy ra!");
    }
  };

  const handleViewDetail = (notification) => {
    setSelectedNotification(notification);
    setDetailModalVisible(true);
    if (notification.status === "unread") {
      handleMarkAsRead(notification.id);
    }
  };
  const getTypeConfig = (type) => {
    switch (type) {
      case "maintenance":
        return {
          color: "#faad14",
          icon: <ToolOutlined />,
          text: "Bảo trì",
          bgColor: "#fff7e6",
        };
      case "billing":
        return {
          color: "#1890ff",
          icon: <DollarOutlined />,
          text: "Hóa đơn",
          bgColor: "#e6f7ff",
        };
      case "event":
        return {
          color: "#52c41a",
          icon: <GiftOutlined />,
          text: "Sự kiện",
          bgColor: "#f6ffed",
        };
      case "urgent":
        return {
          color: "#ff4d4f",
          icon: <ExclamationCircleOutlined />,
          text: "Khẩn cấp",
          bgColor: "#fff1f0",
        };
      case "general":
        return {
          color: "#722ed1",
          icon: <InfoCircleOutlined />,
          text: "Chung",
          bgColor: "#f9f0ff",
        };
      case "announcement":
        return {
          color: "#722ed1",
          icon: <InfoCircleOutlined />,
          text: "Thông báo",
          bgColor: "#f9f0ff",
        };
      default:
        return {
          color: "#d9d9d9",
          icon: <BellOutlined />,
          text: "Khác",
          bgColor: "#f5f5f5",
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "high":
        return {
          color: "#ff4d4f",
          text: "Cao",
          icon: <ExclamationCircleOutlined />,
        };
      case "medium":
        return {
          color: "#faad14",
          text: "Trung bình",
          icon: <InfoCircleOutlined />,
        };
      case "low":
        return { color: "#52c41a", text: "Thấp", icon: <CheckOutlined /> };
      default:
        return { color: "#d9d9d9", text: "Bình thường", icon: null };
    }
  };

  const filterNotifications = (notifications, tab, keyword) => {
    let filtered = notifications;

    // Filter by tab
    if (tab === "unread") {
      filtered = filtered.filter((notif) => notif.status === "unread");
    } else if (tab === "read") {
      filtered = filtered.filter((notif) => notif.status === "read");
    } else if (tab !== "all") {
      filtered = filtered.filter((notif) => notif.type === tab);
    }

    // Filter by keyword
    if (keyword) {
      filtered = filtered.filter(
        (notif) =>
          notif.title.toLowerCase().includes(keyword.toLowerCase()) ||
          notif.content.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredNotifications = filterNotifications(
    notifications,
    activeTab,
    searchKeyword
  );
  const unreadCount = notifications.filter(
    (notif) => notif.status === "unread"
  ).length;

  return (
    <div className="resident-notifications">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
          <Badge count={unreadCount} offset={[10, 0]}>
            <BellOutlined style={{ marginRight: 8 }} />
          </Badge>
          Thông báo
        </Title>
        <Text type="secondary">Các thông báo và cập nhật mới nhất</Text>
      </div>

      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#1890ff" }}
              >
                {notifications.length}
              </div>
              <div style={{ color: "#666" }}>Tổng thông báo</div>
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#ff4d4f" }}
              >
                {unreadCount}
              </div>
              <div style={{ color: "#666" }}>Chưa đọc</div>
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#52c41a" }}
              >
                {notifications.filter((n) => n.status === "read").length}
              </div>
              <div style={{ color: "#666" }}>Đã đọc</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12}>
            <Search
              placeholder="Tìm kiếm thông báo..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: "right" }}>
            <Space>
              <Button
                type="primary"
                ghost
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Đánh dấu tất cả đã đọc
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane
            tab={
              <span>
                <BellOutlined />
                Tất cả ({notifications.length})
              </span>
            }
            key="all"
          />
          <TabPane
            tab={
              <span>
                <Badge dot={unreadCount > 0}>
                  <EyeOutlined />
                </Badge>
                Chưa đọc ({unreadCount})
              </span>
            }
            key="unread"
          />
          <TabPane
            tab={
              <span>
                <CheckOutlined />
                Đã đọc (
                {notifications.filter((n) => n.status === "read").length})
              </span>
            }
            key="read"
          />
          <TabPane
            tab={
              <span>
                <ToolOutlined />
                Bảo trì (
                {notifications.filter((n) => n.type === "maintenance").length})
              </span>
            }
            key="maintenance"
          />
          <TabPane
            tab={
              <span>
                <DollarOutlined />
                Hóa đơn (
                {notifications.filter((n) => n.type === "billing").length})
              </span>
            }
            key="billing"
          />
          <TabPane
            tab={
              <span>
                <GiftOutlined />
                Sự kiện (
                {notifications.filter((n) => n.type === "event").length})
              </span>
            }
            key="event"
          />
          <TabPane
            tab={
              <span>
                <ExclamationCircleOutlined />
                Khẩn cấp (
                {notifications.filter((n) => n.type === "urgent").length})
              </span>
            }
            key="urgent"
          />
          <TabPane
            tab={
              <span>
                <InfoCircleOutlined />
                Chung (
                {notifications.filter((n) => n.type === "general").length})
              </span>
            }
            key="general"
          />
        </Tabs>

        {/* Danh sách thông báo */}
        {filteredNotifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có thông báo nào"
          />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={filteredNotifications}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} thông báo`,
            }}
            renderItem={(item) => {
              const typeConfig = getTypeConfig(item.type);
              const priorityConfig = getPriorityConfig(item.priority);

              return (
                <List.Item
                  key={item.id}
                  style={{
                    background: item.status === "unread" ? "#f6f6f6" : "white",
                    border: "1px solid #d9d9d9",
                    borderRadius: 8,
                    marginBottom: 8,
                    padding: 16,
                  }}
                  actions={[
                    <Tooltip title="Xem chi tiết">
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(item)}
                      >
                        Xem
                      </Button>
                    </Tooltip>,
                    item.status === "unread" && (
                      <Tooltip title="Đánh dấu đã đọc">
                        <Button
                          type="link"
                          icon={<CheckOutlined />}
                          onClick={() => handleMarkAsRead(item.id)}
                        >
                          Đánh dấu đã đọc
                        </Button>
                      </Tooltip>
                    ),
                    <Tooltip title="Xóa thông báo">
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteNotification(item.id)}
                      >
                        Xóa
                      </Button>
                    </Tooltip>,
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{ position: "relative" }}>
                        <Avatar
                          style={{ backgroundColor: typeConfig.color }}
                          icon={typeConfig.icon}
                        />
                        {item.status === "unread" && (
                          <Badge
                            dot
                            style={{
                              position: "absolute",
                              top: -2,
                              right: -2,
                            }}
                          />
                        )}
                      </div>
                    }
                    title={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text strong={item.status === "unread"}>
                          {item.title}
                        </Text>
                        <Tag color={typeConfig.color} icon={typeConfig.icon}>
                          {typeConfig.text}
                        </Tag>
                        <Tag
                          color={priorityConfig.color}
                          icon={priorityConfig.icon}
                        >
                          {priorityConfig.text}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Paragraph
                          ellipsis={{ rows: 2, expandable: false }}
                          style={{ margin: "8px 0", color: "#666" }}
                        >
                          {item.content}
                        </Paragraph>
                        <Space size="large">
                          <Text type="secondary">
                            <UserOutlined /> {item.sender}
                          </Text>
                          <Text type="secondary">
                            <CalendarOutlined />
                            {dayjs(item.createdDate).format("DD/MM/YYYY HH:mm")}
                          </Text>
                          {item.apartment && (
                            <Text type="secondary">
                              <HomeOutlined /> {item.apartment}
                            </Text>
                          )}
                          {item.attachments && item.attachments.length > 0 && (
                            <Text type="secondary">
                              📎 {item.attachments.length} file đính kèm
                            </Text>
                          )}
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>

      {/* Modal chi tiết */}
      <Modal
        title={
          <Space>
            <BellOutlined />
            Chi tiết thông báo
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedNotification && (
          <div>
            {/* Header */}
            <div
              style={{
                background: getTypeConfig(selectedNotification.type).bgColor,
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Avatar
                  style={{
                    backgroundColor: getTypeConfig(selectedNotification.type)
                      .color,
                  }}
                  icon={getTypeConfig(selectedNotification.type).icon}
                />
                <Title level={4} style={{ margin: 0 }}>
                  {selectedNotification.title}
                </Title>
              </div>
              <Space>
                <Tag color={getTypeConfig(selectedNotification.type).color}>
                  {getTypeConfig(selectedNotification.type).text}
                </Tag>
                <Tag
                  color={getPriorityConfig(selectedNotification.priority).color}
                >
                  {getPriorityConfig(selectedNotification.priority).text}
                </Tag>
                {selectedNotification.status === "unread" && (
                  <Tag color="red">Chưa đọc</Tag>
                )}
              </Space>
            </div>

            {/* Thông tin cơ bản */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">Người gửi:</Text>
                    <br />
                    <Text strong>{selectedNotification.sender}</Text>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">Thời gian gửi:</Text>
                    <br />
                    <Text>
                      {dayjs(selectedNotification.createdDate).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  {selectedNotification.apartment && (
                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">Căn hộ:</Text>
                      <br />
                      <Text strong>{selectedNotification.apartment}</Text>
                    </div>
                  )}
                  {selectedNotification.readDate && (
                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">Thời gian đọc:</Text>
                      <br />
                      <Text>
                        {dayjs(selectedNotification.readDate).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </Text>
                    </div>
                  )}
                </Col>
              </Row>
            </Card>

            {/* Nội dung */}
            <Card
              title="Nội dung thông báo"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
                {selectedNotification.content}
              </Paragraph>
            </Card>

            {/* File đính kèm */}
            {selectedNotification.attachments &&
              selectedNotification.attachments.length > 0 && (
                <Card title="File đính kèm" size="small">
                  <List
                    size="small"
                    dataSource={selectedNotification.attachments}
                    renderItem={(file, index) => (
                      <List.Item
                        key={index}
                        actions={[
                          <Button type="link" size="small">
                            Tải xuống
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar icon={<UserOutlined />} size="small" />
                          }
                          title={file}
                          description="File đính kèm"
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResidentNotifications;
