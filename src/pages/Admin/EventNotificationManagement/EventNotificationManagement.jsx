import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Button,
  Table,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  Typography,
  Badge,
  Avatar,
  Tooltip,
  Row,
  Col,
  Statistic,
  Divider,
  message,
  Empty,
  Popconfirm,
} from "antd";
import {
  CalendarOutlined,
  NotificationOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BellOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { announcementService } from "../../../services";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const EventNotificationManagement = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewingAnnouncement, setViewingAnnouncement] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  // State cho dữ liệu API
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    general: 0,
    urgent: 0,
    maintenance: 0,
    event: 0,
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });

  // Load dữ liệu ban đầu
  useEffect(() => {
    const initData = async () => {
      await Promise.all([loadAnnouncements(), loadStats()]);
    };
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load lại dữ liệu khi filter thay đổi
  useEffect(() => {
    loadAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, priorityFilter, pagination.page]);

  /**
   * Load danh sách announcements từ API
   */
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Thêm filter nếu có
      if (typeFilter) params.type = typeFilter;
      if (priorityFilter) params.priority = priorityFilter;

      console.log("Loading announcements with params:", params);
      const response = await announcementService.getAllAnnouncements(params);

      setAnnouncements(response.announcements || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalResults: response.totalResults || 0,
      }));
    } catch (error) {
      console.error("Error loading announcements:", error);
      message.error(
        "Lỗi khi tải danh sách thông báo: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load thống kê announcements từ API
   */
  const loadStats = async () => {
    try {
      const response = await announcementService.getAnnouncementStats();
      setStats(response);
    } catch (error) {
      console.error("Error loading announcement stats:", error);
      message.error(
        "Lỗi khi tải thống kê thông báo: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Xem chi tiết announcement
  const handleViewAnnouncement = async (announcement) => {
    try {
      const detailResponse = await announcementService.getAnnouncementById(
        announcement.announcementId
      );
      setViewingAnnouncement(detailResponse);
      setViewModalVisible(true);
    } catch (error) {
      console.error("Error loading announcement detail:", error);
      message.error("Lỗi khi tải chi tiết thông báo");
    }
  };

  // Sửa announcement
  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    form.setFieldsValue({
      type: announcement.type,
      priority: announcement.priority,
      title: announcement.title,
      content: announcement.content,
    });
    setEditModalVisible(true);
  };

  // Submit sửa announcement
  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await announcementService.updateAnnouncement(
        editingAnnouncement.announcementId,
        values
      );

      message.success("Cập nhật thông báo thành công!");
      setEditModalVisible(false);
      form.resetFields();
      setEditingAnnouncement(null);

      // Reload dữ liệu
      await Promise.all([loadAnnouncements(), loadStats()]);
    } catch (error) {
      console.error("Error updating announcement:", error);
      message.error(
        "Lỗi khi cập nhật: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  }; // Xóa announcement
  const handleDeleteAnnouncement = async (announcementId) => {
    if (!announcementId) {
      message.error("Không tìm thấy ID thông báo để xóa");
      return;
    }

    try {
      setLoading(true);
      await announcementService.deleteAnnouncement(announcementId);
      message.success("Xóa thông báo thành công!");

      // Reload dữ liệu
      await Promise.all([loadAnnouncements(), loadStats()]);
    } catch (error) {
      console.error("Error deleting announcement:", error);
      message.error(
        "Lỗi khi xóa: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Tạo announcement mới
  const handleCreateAnnouncement = () => {
    setCreateModalVisible(true);
  };

  // Submit tạo announcement
  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      setLoading(true);

      // Thêm author (có thể lấy từ context user hiện tại)
      const payload = {
        ...values,
        author: 1, // TODO: Lấy từ user context
      };

      await announcementService.createAnnouncement(payload);

      message.success("Tạo thông báo thành công!");
      setCreateModalVisible(false);
      createForm.resetFields();

      // Reload dữ liệu
      await Promise.all([loadAnnouncements(), loadStats()]);
    } catch (error) {
      console.error("Error creating announcement:", error);
      message.error(
        "Lỗi khi tạo thông báo: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const getTypeTag = (type) => {
    const typeConfig = {
      General: { color: "blue", text: "Chung", icon: <NotificationOutlined /> },
      Urgent: {
        color: "red",
        text: "Khẩn cấp",
        icon: <ExclamationCircleOutlined />,
      },
      Maintenance: {
        color: "orange",
        text: "Bảo trì",
        icon: <WarningOutlined />,
      },
      Event: { color: "purple", text: "Sự kiện", icon: <CalendarOutlined /> },
    };
    const config = typeConfig[type] || typeConfig.General;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const getPriorityTag = (priority) => {
    const priorityConfig = {
      Low: { color: "green", text: "Thấp" },
      Medium: { color: "orange", text: "Trung bình" },
      High: { color: "red", text: "Cao" },
      Critical: { color: "volcano", text: "Quan trọng" },
    };
    const config = priorityConfig[priority] || priorityConfig.Low;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "announcementId",
      key: "announcementId",
      width: 80,
      render: (text) => <Text strong>#{text}</Text>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 300,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.content && record.content.length > 100
              ? record.content.substring(0, 100) + "..."
              : record.content}
          </Text>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => getTypeTag(type),
      filters: [
        { text: "Chung", value: "General" },
        { text: "Khẩn cấp", value: "Urgent" },
        { text: "Bảo trì", value: "Maintenance" },
        { text: "Sự kiện", value: "Event" },
      ],
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      render: (priority) => getPriorityTag(priority),
      filters: [
        { text: "Thấp", value: "Low" },
        { text: "Trung bình", value: "Medium" },
        { text: "Cao", value: "High" },
        { text: "Quan trọng", value: "Critical" },
      ],
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      width: 100,
      render: (author) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>ID: {author}</Text>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => (
        <div>
          <CalendarOutlined style={{ marginRight: "4px", color: "#666" }} />
          <Text style={{ fontSize: "12px" }}>
            {dayjs(date).format("DD/MM/YYYY")}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "11px" }}>
            {dayjs(date).format("HH:mm")}
          </Text>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewAnnouncement(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditAnnouncement(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa"
              description={`Bạn có chắc chắn muốn xóa thông báo "${record.title}"?`}
              onConfirm={() => handleDeleteAnnouncement(record.announcementId)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
              placement="topRight"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Lọc dữ liệu theo search text
  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchText.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchText.toLowerCase()) ||
      announcement.announcementId.toString().includes(searchText.toLowerCase())
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Content style={{ margin: "16px" }}>
        <div style={{ padding: 24, minHeight: 360 }}>
          {/* Header */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={2} style={{ margin: 0, color: "#1a1a1a" }}>
                  <BellOutlined
                    style={{ marginRight: "12px", color: "#7c3aed" }}
                  />
                  Sự kiện & Thông báo
                </Title>
                <Text type="secondary">
                  Quản lý thông báo và sự kiện cho cư dân
                </Text>
              </Col>
              <Col>
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() =>
                      Promise.all([loadAnnouncements(), loadStats()])
                    }
                    style={{ borderRadius: "8px" }}
                  >
                    Làm mới
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={handleCreateAnnouncement}
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      borderRadius: "8px",
                      height: "40px",
                    }}
                  >
                    Thêm mới
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>

          {/* Statistics */}
          <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Card
                style={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Statistic
                  title="Tổng số"
                  value={stats.total}
                  prefix={<BellOutlined style={{ color: "#1890ff" }} />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Card
                style={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Statistic
                  title="Khẩn cấp"
                  value={stats.urgent}
                  prefix={
                    <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                  }
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Card
                style={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Statistic
                  title="Sự kiện"
                  value={stats.event}
                  prefix={<CalendarOutlined style={{ color: "#722ed1" }} />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Card
                style={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Statistic
                  title="Bảo trì"
                  value={stats.maintenance}
                  prefix={<WarningOutlined style={{ color: "#fa8c16" }} />}
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Card
                style={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Statistic
                  title="Ưu tiên cao"
                  value={stats.high}
                  prefix={
                    <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                  }
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Card
                style={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Statistic
                  title="Quan trọng"
                  value={stats.critical}
                  prefix={<WarningOutlined style={{ color: "#cf1322" }} />}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Card
            style={{
              borderRadius: "12px",
              marginBottom: "20px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8} md={6}>
                <Input
                  placeholder="Tìm kiếm tiêu đề, nội dung..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} sm={8} md={4}>
                <Select
                  placeholder="Loại"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  allowClear
                  style={{ width: "100%", borderRadius: "8px" }}
                >
                  <Option value="General">Chung</Option>
                  <Option value="Urgent">Khẩn cấp</Option>
                  <Option value="Maintenance">Bảo trì</Option>
                  <Option value="Event">Sự kiện</Option>
                </Select>
              </Col>
              <Col xs={24} sm={8} md={4}>
                <Select
                  placeholder="Độ ưu tiên"
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  allowClear
                  style={{ width: "100%", borderRadius: "8px" }}
                >
                  <Option value="Low">Thấp</Option>
                  <Option value="Medium">Trung bình</Option>
                  <Option value="High">Cao</Option>
                  <Option value="Critical">Quan trọng</Option>
                </Select>
              </Col>
              {selectedRowKeys.length > 0 && (
                <Col xs={24} sm={24} md={10}>
                  <Space>
                    <Text>Đã chọn {selectedRowKeys.length} mục</Text>
                    <Button size="small" onClick={() => setSelectedRowKeys([])}>
                      Bỏ chọn
                    </Button>
                    <Button size="small" danger>
                      Xóa đã chọn
                    </Button>
                  </Space>
                </Col>
              )}
            </Row>
          </Card>

          {/* Table */}
          <Card
            style={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Table
              columns={columns}
              dataSource={filteredAnnouncements}
              rowKey="announcementId"
              rowSelection={rowSelection}
              loading={loading}
              pagination={{
                current: pagination.page,
                pageSize: pagination.limit,
                total: pagination.totalResults,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} thông báo`,
                onChange: (page, pageSize) => {
                  setPagination((prev) => ({ ...prev, page, limit: pageSize }));
                },
              }}
              scroll={{ x: 1200 }}
              style={{ borderRadius: "8px" }}
              locale={{
                emptyText: <Empty description="Không có dữ liệu" />,
              }}
            />
          </Card>
        </div>
      </Content>

      {/* Modal xem chi tiết */}
      <Modal
        title="📄 Chi tiết Thông báo"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingAnnouncement && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <Title level={4}>#{viewingAnnouncement.announcementId}</Title>
                <Space>
                  {getTypeTag(viewingAnnouncement.type)}
                  {getPriorityTag(viewingAnnouncement.priority)}
                </Space>
              </div>

              <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Text strong>Tiêu đề: {viewingAnnouncement.title}</Text>
                    <Text strong>Tác giả ID: {viewingAnnouncement.author}</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Text>
                      <CalendarOutlined /> Ngày tạo:
                      {dayjs(viewingAnnouncement.createdAt).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </Text>
                    <Text>
                      <CalendarOutlined /> Cập nhật:
                      {dayjs(viewingAnnouncement.updatedAt).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </Text>
                  </Space>
                </Col>
              </Row>

              <Divider />

              <div style={{ marginBottom: "16px" }}>
                <Text strong>Nội dung:</Text>
                <div
                  style={{
                    marginTop: "8px",
                    padding: "12px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {viewingAnnouncement.content}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal sửa thông báo */}
      <Modal
        title="✏️ Sửa Thông báo"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        width={600}
        confirmLoading={loading}
      >
        {editingAnnouncement && (
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="type"
                  label="Loại"
                  rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
                >
                  <Select placeholder="Chọn loại">
                    <Option value="General">Chung</Option>
                    <Option value="Urgent">Khẩn cấp</Option>
                    <Option value="Maintenance">Bảo trì</Option>
                    <Option value="Event">Sự kiện</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="priority"
                  label="Độ ưu tiên"
                  rules={[
                    { required: true, message: "Vui lòng chọn độ ưu tiên!" },
                  ]}
                >
                  <Select placeholder="Chọn độ ưu tiên">
                    <Option value="Low">Thấp</Option>
                    <Option value="Medium">Trung bình</Option>
                    <Option value="High">Cao</Option>
                    <Option value="Critical">Quan trọng</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input placeholder="Nhập tiêu đề" />
            </Form.Item>

            <Form.Item
              name="content"
              label="Nội dung"
              rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
            >
              <TextArea rows={6} placeholder="Nhập nội dung chi tiết" />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Modal tạo thông báo mới */}
      <Modal
        title="➕ Tạo Thông báo Mới"
        open={createModalVisible}
        onOk={handleCreateSubmit}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        width={600}
        confirmLoading={loading}
      >
        <Form form={createForm} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="type"
                label="Loại"
                rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
              >
                <Select placeholder="Chọn loại">
                  <Option value="General">Chung</Option>
                  <Option value="Urgent">Khẩn cấp</Option>
                  <Option value="Maintenance">Bảo trì</Option>
                  <Option value="Event">Sự kiện</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="priority"
                label="Độ ưu tiên"
                rules={[
                  { required: true, message: "Vui lòng chọn độ ưu tiên!" },
                ]}
              >
                <Select placeholder="Chọn độ ưu tiên">
                  <Option value="Low">Thấp</Option>
                  <Option value="Medium">Trung bình</Option>
                  <Option value="High">Cao</Option>
                  <Option value="Critical">Quan trọng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <TextArea rows={6} placeholder="Nhập nội dung chi tiết" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default EventNotificationManagement;
