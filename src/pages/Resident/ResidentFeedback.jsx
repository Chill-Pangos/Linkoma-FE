import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Table,
  Tag,
  Space,
  Row,
  Col,
  Typography,
  Modal,
  message,
  Rate,
  Avatar,
  Upload,
  Tooltip,
} from "antd";
import {
  MessageOutlined,
  PlusOutlined,
  EyeOutlined,
  StarOutlined,
  UserOutlined,
  UploadOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
  SendOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuthStore } from "../../store/authStore";
import { feedbackService } from "../../services";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ResidentFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [form] = Form.useForm();

  const { user } = useAuthStore();
  useEffect(() => {
    if (user?.userId) {
      fetchFeedbacks();
    }
  }, [user?.userId, fetchFeedbacks]);
  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await feedbackService.getFeedbacksByUserId(user.userId, {
        limit: 20,
        page: 1,
        sortBy: "createdAt:desc",
      });

      // Transform API data to match UI format
      const transformedFeedbacks = response.feedbacks.map((feedback) => ({
        id: feedback.feedbackId,
        title: feedback.description.substring(0, 50) + "...",
        category: getVietnameseCategoryName(feedback.category),
        type: getVietnameseTypeName(feedback.category),
        priority: getVietnamesePriorityName(feedback.status),
        status: getVietnameseStatusName(feedback.status),
        content: feedback.description,
        rating: 3, // API doesn't have rating, default to 3
        apartment: user.apartmentNumber || "A101",
        resident: {
          name: user.fullName || "Cư dân",
          avatar: null,
        },
        createdDate: dayjs(feedback.createdAt).format("YYYY-MM-DD"),
        responseDate: feedback.responseDate
          ? dayjs(feedback.responseDate).format("YYYY-MM-DD")
          : null,
        response: feedback.response
          ? {
              content: feedback.response,
              respondedBy: "Ban Quản Lý",
              respondedAt: feedback.responseDate,
            }
          : null,
        attachments: [],
      }));

      setFeedbacks(transformedFeedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      message.error("Có lỗi xảy ra khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Helper functions to convert API data to Vietnamese
  const getVietnameseCategoryName = (category) => {
    switch (category) {
      case "Service":
        return "Dịch vụ";
      case "Complaint":
        return "Khiếu nại";
      default:
        return "Khác";
    }
  };

  const getVietnameseTypeName = (category) => {
    switch (category) {
      case "Service":
        return "Góp ý";
      case "Complaint":
        return "Khiếu nại";
      default:
        return "Khác";
    }
  };

  const getVietnamesePriorityName = (status) => {
    switch (status) {
      case "Pending":
        return "Thấp";
      case "In Progress":
        return "Trung bình";
      case "Resolved":
        return "Cao";
      default:
        return "Thấp";
    }
  };

  const getVietnameseStatusName = (status) => {
    switch (status) {
      case "Pending":
        return "Chờ xử lý";
      case "In Progress":
        return "Đang xử lý";
      case "Resolved":
        return "Đã phản hồi";
      case "Rejected":
        return "Đã từ chối";
      case "Cancelled":
        return "Đã hủy";
      default:
        return "Chờ xử lý";
    }
  };

  const handleCreateFeedback = async (values) => {
    try {
      // Map UI values to API format
      const apiCategory =
        values.category === "Dịch vụ" ? "Service" : "Complaint";

      const feedbackData = {
        userId: user.userId,
        category: apiCategory,
        description: `${values.title}\n\n${values.content}`,
        status: "Pending",
      };

      await feedbackService.createFeedback(feedbackData);

      message.success("Tạo phản hồi thành công!");
      setModalVisible(false);
      form.resetFields();
      fetchFeedbacks(); // Reload data
    } catch (error) {
      console.error("Error creating feedback:", error);
      message.error("Có lỗi xảy ra khi tạo phản hồi!");
    }
  };
  const handleViewDetail = (feedback) => {
    setSelectedFeedback(feedback);
    setDetailModalVisible(true);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Chờ xử lý":
        return { color: "default", text: "Chờ xử lý" };
      case "Đang xử lý":
        return { color: "processing", text: "Đang xử lý" };
      case "Đã phản hồi":
        return { color: "success", text: "Đã phản hồi" };
      case "Đã đóng":
        return { color: "error", text: "Đã đóng" };
      default:
        return { color: "default", text: status };
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Khiếu nại":
        return "#ff4d4f";
      case "Góp ý":
        return "#faad14";
      case "Đề xuất":
        return "#52c41a";
      case "Khen ngợi":
        return "#1890ff";
      default:
        return "#d9d9d9";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Cao":
        return "#ff4d4f";
      case "Trung bình":
        return "#faad14";
      case "Thấp":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const getRatingIcon = (rating) => {
    if (rating >= 4) return <SmileOutlined style={{ color: "#52c41a" }} />;
    if (rating >= 3) return <MehOutlined style={{ color: "#faad14" }} />;
    return <FrownOutlined style={{ color: "#ff4d4f" }} />;
  };

  const columns = [
    {
      title: "Mã phản hồi",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => <Tag color={getTypeColor(type)}>{type}</Tag>,
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      render: (rating) => (
        <Space>
          {getRatingIcon(rating)}
          <Rate disabled value={rating} style={{ fontSize: 14 }} />
        </Space>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 100,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="resident-feedback">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
          <MessageOutlined style={{ marginRight: 8 }} />
          Phản hồi & Góp ý
        </Title>
        <Text type="secondary">
          Gửi phản hồi, góp ý để cải thiện chất lượng dịch vụ
        </Text>
      </div>

      {/* Thống kê nhanh */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#1890ff" }}
              >
                {feedbacks.length}
              </div>
              <div style={{ color: "#666" }}>Tổng phản hồi</div>
            </div>
          </Card>
        </Col>
        <Col xs={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#faad14" }}
              >
                {
                  feedbacks.filter(
                    (f) => f.status === "Chờ xử lý" || f.status === "Đang xử lý"
                  ).length
                }
              </div>
              <div style={{ color: "#666" }}>Đang xử lý</div>
            </div>
          </Card>
        </Col>
        <Col xs={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#52c41a" }}
              >
                {feedbacks.filter((f) => f.status === "Đã phản hồi").length}
              </div>
              <div style={{ color: "#666" }}>Đã phản hồi</div>
            </div>
          </Card>
        </Col>
        <Col xs={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#1890ff" }}
              >
                {feedbacks.length > 0
                  ? (
                      feedbacks.reduce((sum, f) => sum + f.rating, 0) /
                      feedbacks.length
                    ).toFixed(1)
                  : "0"}
              </div>
              <div style={{ color: "#666" }}>Đánh giá TB</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Nút tạo phản hồi mới */}
      <Card style={{ marginBottom: 24 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setModalVisible(true)}
        >
          Gửi phản hồi mới
        </Button>
      </Card>

      {/* Bảng phản hồi */}
      <Card>
        <Table
          columns={columns}
          dataSource={feedbacks}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} phản hồi`,
          }}
        />
      </Card>

      {/* Modal tạo phản hồi */}
      <Modal
        title={
          <Space>
            <SendOutlined />
            Gửi phản hồi mới
          </Space>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateFeedback}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="Ví dụ: Góp ý về dịch vụ vệ sinh" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Danh mục"
                name="category"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              >
                <Select placeholder="Chọn danh mục">
                  <Option value="Dịch vụ">Dịch vụ</Option>
                  <Option value="Môi trường sống">Môi trường sống</Option>
                  <Option value="Tiện ích">Tiện ích</Option>
                  <Option value="An ninh">An ninh</Option>
                  <Option value="Hạ tầng">Hạ tầng</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Loại phản hồi"
                name="type"
                rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
              >
                <Select placeholder="Chọn loại">
                  <Option value="Khiếu nại">Khiếu nại</Option>
                  <Option value="Góp ý">Góp ý</Option>
                  <Option value="Đề xuất">Đề xuất</Option>
                  <Option value="Khen ngợi">Khen ngợi</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Độ ưu tiên"
                name="priority"
                rules={[
                  { required: true, message: "Vui lòng chọn độ ưu tiên!" },
                ]}
              >
                <Select placeholder="Chọn độ ưu tiên">
                  <Option value="Cao">Cao</Option>
                  <Option value="Trung bình">Trung bình</Option>
                  <Option value="Thấp">Thấp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Nội dung phản hồi"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <TextArea
              rows={5}
              placeholder="Mô tả chi tiết nội dung phản hồi, góp ý hoặc khiếu nại..."
            />
          </Form.Item>

          <Form.Item
            label="Đánh giá tổng thể"
            name="rating"
            rules={[{ required: true, message: "Vui lòng chọn đánh giá!" }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item label="Hình ảnh đính kèm" name="attachments">
            <Upload
              listType="picture-card"
              maxCount={5}
              accept="image/*"
              beforeUpload={() => false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                Gửi phản hồi
              </Button>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết */}
      <Modal
        title={`Chi tiết phản hồi ${selectedFeedback?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedFeedback && (
          <div>
            {/* Thông tin cơ bản */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Tiêu đề: </Text>
                    <Text>{selectedFeedback.title}</Text>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Danh mục: </Text>
                    <Tag color="blue">{selectedFeedback.category}</Tag>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Loại: </Text>
                    <Tag color={getTypeColor(selectedFeedback.type)}>
                      {selectedFeedback.type}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Độ ưu tiên: </Text>
                    <Tag color={getPriorityColor(selectedFeedback.priority)}>
                      {selectedFeedback.priority}
                    </Tag>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Trạng thái: </Text>
                    {(() => {
                      const config = getStatusConfig(selectedFeedback.status);
                      return <Tag color={config.color}>{config.text}</Tag>;
                    })()}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Đánh giá: </Text>
                    <Space>
                      {getRatingIcon(selectedFeedback.rating)}
                      <Rate
                        disabled
                        value={selectedFeedback.rating}
                        style={{ fontSize: 14 }}
                      />
                    </Space>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Nội dung phản hồi */}
            <Card
              title="Nội dung phản hồi"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <div
                style={{
                  background: "#f6f6f6",
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Avatar icon={<UserOutlined />} size="small" />
                  <Text strong style={{ marginLeft: 8 }}>
                    {selectedFeedback.resident.name}
                  </Text>
                  <Text type="secondary" style={{ marginLeft: "auto" }}>
                    {dayjs(selectedFeedback.createdDate).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </Text>
                </div>
                <Text>{selectedFeedback.content}</Text>
              </div>

              {/* Hình ảnh đính kèm */}
              {selectedFeedback.attachments &&
                selectedFeedback.attachments.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <Text strong>Hình ảnh đính kèm:</Text>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginTop: 8,
                      }}
                    >
                      {selectedFeedback.attachments.map((image, index) => (
                        <div
                          key={index}
                          style={{
                            width: 80,
                            height: 80,
                            background: "#f0f0f0",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {image}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </Card>

            {/* Phản hồi từ BQL */}
            {selectedFeedback.response && (
              <Card title="Phản hồi từ Ban Quản Lý" size="small">
                <div
                  style={{
                    background: "#e6f7ff",
                    padding: 16,
                    borderRadius: 8,
                    border: "1px solid #91d5ff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Avatar style={{ backgroundColor: "#1890ff" }} size="small">
                      BQL
                    </Avatar>
                    <Text strong style={{ marginLeft: 8 }}>
                      {selectedFeedback.response.respondedBy}
                    </Text>
                    <Text type="secondary" style={{ marginLeft: "auto" }}>
                      {dayjs(selectedFeedback.response.respondedAt).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </Text>
                  </div>
                  <Text>{selectedFeedback.response.content}</Text>
                </div>
              </Card>
            )}

            {!selectedFeedback.response &&
              selectedFeedback.status !== "Đã đóng" && (
                <Card
                  size="small"
                  style={{ background: "#fffbe6", border: "1px solid #ffe58f" }}
                >
                  <Text type="secondary">
                    Phản hồi của bạn đang được xử lý. Chúng tôi sẽ phản hồi sớm
                    nhất có thể.
                  </Text>
                </Card>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResidentFeedback;
