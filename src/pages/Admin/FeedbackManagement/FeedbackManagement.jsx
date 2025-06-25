import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  Row,
  Col,
  Statistic,
  Typography,
  Badge,
  Tooltip,
  Popconfirm,
  message,
  Avatar,
  Divider,
  Empty,
} from "antd";
import {
  MessageOutlined,
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CommentOutlined,
  CalendarOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { feedbackService } from "../../../services";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { Search, TextArea } = Input;
const { Option } = Select;

const FeedbackManagement = () => {
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [replyingFeedback, setReplyingFeedback] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [form] = Form.useForm();
  const [replyForm] = Form.useForm();
  const [createForm] = Form.useForm();

  // State cho dữ liệu API
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    cancelled: 0,
    service: 0,
    complaint: 0,
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
      await Promise.all([loadFeedbacks(), loadStats()]);
    };
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load lại dữ liệu khi filter thay đổi
  useEffect(() => {
    loadFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, pagination.page]);

  /**
   * Load danh sách feedbacks từ API
   */
  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Thêm filter nếu có
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      console.log("Loading feedbacks with params:", params);
      const response = await feedbackService.getAllFeedbacks(params);

      setFeedbacks(response.feedbacks || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalResults: response.totalResults || 0,
      }));
    } catch (error) {
      console.error("Error loading feedbacks:", error);
      message.error(
        "Lỗi khi tải danh sách phản hồi: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load thống kê feedbacks từ API
   */
  const loadStats = async () => {
    try {
      const response = await feedbackService.getFeedbackStats();
      setStats(response);
    } catch (error) {
      console.error("Error loading feedback stats:", error);
      message.error(
        "Lỗi khi tải thống kê phản hồi: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Service":
        return "blue";
      case "Complaint":
        return "red";
      default:
        return "default";
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case "Service":
        return "Dịch vụ";
      case "Complaint":
        return "Khiếu nại";
      default:
        return category;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "In Progress":
        return "blue";
      case "Resolved":
        return "green";
      case "Rejected":
        return "red";
      case "Cancelled":
        return "gray";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Pending":
        return "Chờ xử lý";
      case "In Progress":
        return "Đang xử lý";
      case "Resolved":
        return "Đã giải quyết";
      case "Rejected":
        return "Từ chối";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <ClockCircleOutlined />;
      case "In Progress":
        return <ExclamationCircleOutlined />;
      case "Resolved":
        return <CheckCircleOutlined />;
      case "Rejected":
        return <DeleteOutlined />;
      case "Cancelled":
        return <DeleteOutlined />;
      default:
        return <MessageOutlined />;
    }
  };

  // Xem chi tiết feedback
  const handleViewFeedback = async (feedback) => {
    try {
      const detailResponse = await feedbackService.getFeedbackById(
        feedback.feedbackId
      );
      setViewingFeedback(detailResponse);
      setViewModalVisible(true);
    } catch (error) {
      console.error("Error loading feedback detail:", error);
      message.error("Lỗi khi tải chi tiết phản hồi");
    }
  };

  // Trả lời feedback
  const handleReplyFeedback = (feedback) => {
    setReplyingFeedback(feedback);
    setReplyModalVisible(true);
  };

  // Submit phản hồi
  const handleReplySubmit = async () => {
    try {
      const values = await replyForm.validateFields();
      setLoading(true);

      await feedbackService.updateFeedbackResponse(
        replyingFeedback.feedbackId,
        {
          status: values.status,
          response: values.response,
        }
      );

      message.success("Phản hồi thành công!");
      setReplyModalVisible(false);
      replyForm.resetFields();
      setReplyingFeedback(null);

      // Reload dữ liệu
      await Promise.all([loadFeedbacks(), loadStats()]);
    } catch (error) {
      console.error("Error replying feedback:", error);
      message.error(
        "Lỗi khi phản hồi: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Sửa feedback
  const handleEditFeedback = (feedback) => {
    setEditingFeedback(feedback);
    form.setFieldsValue({
      category: feedback.category,
      description: feedback.description,
    });
    setEditModalVisible(true);
  };

  // Submit sửa feedback
  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await feedbackService.updateFeedback(editingFeedback.feedbackId, values);

      message.success("Cập nhật feedback thành công!");
      setEditModalVisible(false);
      form.resetFields();
      setEditingFeedback(null);

      // Reload dữ liệu
      await loadFeedbacks();
    } catch (error) {
      console.error("Error updating feedback:", error);
      message.error(
        "Lỗi khi cập nhật: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Xóa feedback
  const handleDeleteFeedback = async (feedbackId) => {
    try {
      setLoading(true);
      await feedbackService.deleteFeedback(feedbackId);
      message.success("Xóa feedback thành công!");

      // Reload dữ liệu
      await Promise.all([loadFeedbacks(), loadStats()]);
    } catch (error) {
      console.error("Error deleting feedback:", error);
      message.error(
        "Lỗi khi xóa: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Tạo feedback mới
  const handleCreateFeedback = () => {
    setCreateModalVisible(true);
  };

  // Submit tạo feedback
  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      setLoading(true);

      await feedbackService.createFeedback(values);

      message.success("Tạo feedback thành công!");
      setCreateModalVisible(false);
      createForm.resetFields();

      // Reload dữ liệu
      await Promise.all([loadFeedbacks(), loadStats()]);
    } catch (error) {
      console.error("Error creating feedback:", error);
      message.error(
        "Lỗi khi tạo feedback: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "feedbackId",
      key: "feedbackId",
      width: 80,
      render: (text) => <Text strong>#{text}</Text>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: "14px" }}>
            {text}
          </Text>
          <br />
          <Space size="small" style={{ marginTop: "4px" }}>
            <Tag color={getCategoryColor(record.category)}>
              {getCategoryText(record.category)}
            </Tag>
          </Space>
        </div>
      ),
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 100,
      render: (userId) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            size={32}
            icon={<UserOutlined />}
            style={{ marginRight: "8px" }}
          />
          <div>
            <Text strong>ID: {userId}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Chờ xử lý", value: "Pending" },
        { text: "Đang xử lý", value: "In Progress" },
        { text: "Đã giải quyết", value: "Resolved" },
        { text: "Từ chối", value: "Rejected" },
        { text: "Đã hủy", value: "Cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Phản hồi",
      dataIndex: "response",
      key: "response",
      render: (response) =>
        response ? (
          <Text type="success">Đã phản hồi</Text>
        ) : (
          <Text type="secondary">Chưa phản hồi</Text>
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
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewFeedback(record)}
            />
          </Tooltip>
          <Tooltip title="Trả lời">
            <Button
              type="link"
              icon={<CommentOutlined />}
              onClick={() => handleReplyFeedback(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditFeedback(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa feedback này?"
            onConfirm={() => handleDeleteFeedback(record.feedbackId)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Lọc dữ liệu theo search text
  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.description.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback.feedbackId.toString().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6} lg={4}>
                <Statistic
                  title="Tổng số"
                  value={stats.total}
                  prefix={<MessageOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={4}>
                <Statistic
                  title="Chờ xử lý"
                  value={stats.pending}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={4}>
                <Statistic
                  title="Đang xử lý"
                  value={stats.inProgress}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={4}>
                <Statistic
                  title="Đã giải quyết"
                  value={stats.resolved}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={4}>
                <Statistic
                  title="Dịch vụ"
                  value={stats.service}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={4}>
                <Statistic
                  title="Khiếu nại"
                  value={stats.complaint}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              <MessageOutlined style={{ marginRight: "8px" }} />
              Quản lý Phản hồi
            </Title>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateFeedback}
              >
                Tạo Feedback
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => Promise.all([loadFeedbacks(), loadStats()])}
              >
                Làm mới
              </Button>
            </Space>
          </div>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Tìm kiếm feedback..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="Pending">Chờ xử lý</Option>
              <Option value="In Progress">Đang xử lý</Option>
              <Option value="Resolved">Đã giải quyết</Option>
              <Option value="Rejected">Từ chối</Option>
              <Option value="Cancelled">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Lọc theo loại"
              value={categoryFilter}
              onChange={setCategoryFilter}
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="Service">Dịch vụ</Option>
              <Option value="Complaint">Khiếu nại</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredFeedbacks}
          rowKey="feedbackId"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalResults,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} feedback`,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({ ...prev, page, limit: pageSize }));
            },
          }}
          locale={{
            emptyText: <Empty description="Không có dữ liệu" />,
          }}
        />
      </Card>

      {/* Modal xem chi tiết */}
      <Modal
        title="📄 Chi tiết Feedback"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingFeedback && (
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
                <Title level={4}>#{viewingFeedback.feedbackId}</Title>
                <Space>
                  <Tag color={getStatusColor(viewingFeedback.status)}>
                    {getStatusText(viewingFeedback.status)}
                  </Tag>
                  <Tag color={getCategoryColor(viewingFeedback.category)}>
                    {getCategoryText(viewingFeedback.category)}
                  </Tag>
                </Space>
              </div>

              <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      ID Phản hồi: #{viewingFeedback.feedbackId}
                    </Text>
                    <Text strong>User ID: {viewingFeedback.userId}</Text>
                    <Text>
                      Loại:
                      <Tag color={getCategoryColor(viewingFeedback.category)}>
                        {getCategoryText(viewingFeedback.category)}
                      </Tag>
                    </Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Text>
                      <CalendarOutlined /> Ngày tạo:
                      {dayjs(viewingFeedback.createdAt).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </Text>
                    <Text>
                      <CalendarOutlined /> Cập nhật:
                      {dayjs(viewingFeedback.updatedAt).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </Text>
                    {viewingFeedback.responseDate && (
                      <Text>
                        <CalendarOutlined /> Ngày phản hồi:
                        {dayjs(viewingFeedback.responseDate).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </Text>
                    )}
                  </Space>
                </Col>
              </Row>

              <Divider />

              <div style={{ marginBottom: "16px" }}>
                <Text strong>Nội dung:</Text>
                <Paragraph
                  style={{
                    marginTop: "8px",
                    padding: "12px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                  }}
                >
                  {viewingFeedback.description}
                </Paragraph>
              </div>

              {viewingFeedback.response && (
                <div style={{ marginBottom: "16px" }}>
                  <Text strong>Phản hồi từ Admin:</Text>
                  <Paragraph
                    style={{
                      marginTop: "8px",
                      padding: "12px",
                      backgroundColor: "#f0f8ff",
                      borderRadius: "8px",
                      borderLeft: "4px solid #1890ff",
                    }}
                  >
                    {viewingFeedback.response}
                  </Paragraph>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal trả lời */}
      <Modal
        title="💬 Trả lời Feedback"
        open={replyModalVisible}
        onOk={handleReplySubmit}
        onCancel={() => {
          setReplyModalVisible(false);
          replyForm.resetFields();
        }}
        width={600}
        confirmLoading={loading}
      >
        {replyingFeedback && (
          <Form form={replyForm} layout="vertical">
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <Text strong>Feedback #{replyingFeedback.feedbackId}</Text>
              <br />
              <Text>{replyingFeedback.description}</Text>
            </div>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="Pending">Chờ xử lý</Option>
                <Option value="In Progress">Đang xử lý</Option>
                <Option value="Resolved">Đã giải quyết</Option>
                <Option value="Rejected">Từ chối</Option>
                <Option value="Cancelled">Đã hủy</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="response"
              label="Phản hồi"
              rules={[{ required: true, message: "Vui lòng nhập phản hồi!" }]}
            >
              <TextArea rows={4} placeholder="Nhập phản hồi của bạn..." />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Modal sửa feedback */}
      <Modal
        title="✏️ Sửa Feedback"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        width={600}
        confirmLoading={loading}
      >
        {editingFeedback && (
          <Form form={form} layout="vertical">
            <Form.Item
              name="category"
              label="Loại"
              rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
            >
              <Select placeholder="Chọn loại">
                <Option value="Service">Dịch vụ</Option>
                <Option value="Complaint">Khiếu nại</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <TextArea rows={4} placeholder="Nhập mô tả..." />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Modal tạo feedback */}
      <Modal
        title="➕ Tạo Feedback Mới"
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
          <Form.Item
            name="userId"
            label="User ID"
            rules={[{ required: true, message: "Vui lòng nhập User ID!" }]}
          >
            <Input type="number" placeholder="Nhập User ID" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Loại"
            rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
          >
            <Select placeholder="Chọn loại">
              <Option value="Service">Dịch vụ</Option>
              <Option value="Complaint">Khiếu nại</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedbackManagement;
