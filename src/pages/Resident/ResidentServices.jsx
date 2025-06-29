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
  Modal,
  message,
  Input,
  Select,
  Descriptions,
  Rate,
  Tooltip,
  Empty,
  Badge,
} from "antd";
import {
  CustomerServiceOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  PhoneOutlined,
  SearchOutlined,
  EyeOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuthStore } from "../../store/authStore";
import { serviceService } from "../../services";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const ResidentServices = () => {
  const [services, setServices] = useState([]);
  const [bookedServices, setBookedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { user } = useAuthStore();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await serviceService.getServiceTypes();

      // Transform API data to match UI format
      const transformedServices = response.results.map((serviceType) => ({
        id: serviceType.serviceTypeId,
        name: serviceType.serviceName,
        category: getServiceCategory(serviceType.serviceName),
        description: `Dịch vụ ${serviceType.serviceName.toLowerCase()} với đơn giá ${
          serviceType.unitPrice
        } VNĐ/${serviceType.unit}`,
        price: parseFloat(serviceType.unitPrice),
        unit: serviceType.unit,
        duration: "1-2 giờ", // Default duration
        rating: 4.5, // Default rating
        totalBookings: 0, // Default bookings count
        provider: {
          name: "Nhà cung cấp dịch vụ",
          phone: "0123456789",
          rating: 4.8,
        },
        available: true,
        tags: ["Uy tín"],
        images: [],
      }));

      setServices(transformedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      message.error("Không thể tải danh sách dịch vụ!");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookedServices = useCallback(async () => {
    if (!user?.apartmentId) return;

    try {
      const response = await serviceService.getServiceRegistrations({
        apartmentId: user.apartmentId,
        limit: 20,
        page: 1,
        sortBy: "createdAt:desc",
      });

      // Transform API data to match UI format
      const transformedBookings = response.results.map((registration) => ({
        id: registration.serviceRegistrationId,
        serviceId: registration.serviceTypeId,
        serviceName: "Dịch vụ đã đăng ký",
        bookingDate: registration.createdAt,
        serviceDate: registration.startDate,
        serviceTime: "09:00", // Default time
        status: getVietnameseStatus(registration.status),
        price: 0, // Price not available in registration
        totalPrice: 0,
        apartment: user.apartmentNumber || "A101",
        note: registration.note || "",
        notes: registration.note || "",
        quantity: 1, // Default quantity
        provider: {
          name: "Nhà cung cấp dịch vụ",
          phone: "0123456789",
        },
        rating: null,
        feedback: null,
      }));

      setBookedServices(transformedBookings);
    } catch (error) {
      console.error("Error fetching booked services:", error);
      message.error("Không thể tải danh sách dịch vụ đã đăng ký!");
    }
  }, [user]);

  useEffect(() => {
    fetchServices();
    fetchBookedServices();
  }, [fetchServices, fetchBookedServices]);

  // Helper functions
  const getServiceCategory = (serviceName) => {
    if (serviceName.toLowerCase().includes("vệ sinh")) return "Vệ sinh";
    if (
      serviceName.toLowerCase().includes("điện") ||
      serviceName.toLowerCase().includes("nước")
    )
      return "Sửa chữa";
    if (
      serviceName.toLowerCase().includes("wifi") ||
      serviceName.toLowerCase().includes("internet")
    )
      return "Internet";
    return "Khác";
  };

  const getVietnameseStatus = (status) => {
    switch (status) {
      case "Active":
        return "Đang hoạt động";
      case "Inactive":
        return "Ngừng hoạt động";
      case "Cancelled":
        return "Đã hủy";
      default:
        return "Chờ xử lý";
    }
  };
  const handleBookService = (service) => {
    setSelectedService(service);
    setBookingModalVisible(true);
  };
  const handleConfirmBooking = async () => {
    if (!selectedService) return;

    try {
      const registrationData = {
        apartmentId: user.apartmentId,
        serviceTypeId: selectedService.id,
        startDate: new Date().toISOString(),
        endDate: null,
        status: "Active",
        note: "",
      };

      await serviceService.createServiceRegistration(registrationData);

      message.success("Đăng ký dịch vụ thành công!");
      setBookingModalVisible(false);
      fetchBookedServices(); // Reload booked services
    } catch (error) {
      console.error("Error booking service:", error);
      message.error("Có lỗi xảy ra khi đăng ký dịch vụ!");
    }
  };
  const handleViewBookingDetail = (booking) => {
    setSelectedBooking(booking);
    setDetailModalVisible(true);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Đã đặt":
      case "Chờ xử lý":
        return { color: "blue", icon: <ClockCircleOutlined /> };
      case "Đang thực hiện":
      case "Đang hoạt động":
        return { color: "processing", icon: <ClockCircleOutlined /> };
      case "Hoàn thành":
        return { color: "success", icon: <CheckCircleOutlined /> };
      case "Đã hủy":
      case "Ngừng hoạt động":
        return { color: "error", icon: <ClockCircleOutlined /> };
      default:
        return { color: "default", icon: null };
    }
  };

  // Calculate filtered services and categories
  const filteredServices = services.filter((service) => {
    const matchKeyword =
      !searchKeyword ||
      service.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      service.description.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchCategory =
      categoryFilter === "all" || service.category === categoryFilter;

    return matchKeyword && matchCategory;
  });

  const categories = [...new Set(services.map((service) => service.category))];

  return (
    <div className="resident-services">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
          <CustomerServiceOutlined style={{ marginRight: 8 }} />
          Dịch vụ cư dân
        </Title>
        <Text type="secondary">Đặt và quản lý các dịch vụ tiện ích</Text>
      </div>

      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#1890ff" }}
              >
                {services.length}
              </div>
              <div style={{ color: "#666" }}>Dịch vụ</div>
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#52c41a" }}
              >
                {bookedServices.filter((b) => b.status === "Hoàn thành").length}
              </div>
              <div style={{ color: "#666" }}>Đã sử dụng</div>
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#faad14" }}
              >
                {
                  bookedServices.filter(
                    (b) => b.status !== "Hoàn thành" && b.status !== "Đã hủy"
                  ).length
                }
              </div>
              <div style={{ color: "#666" }}>Đang xử lý</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm dịch vụ..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: "100%" }}
              placeholder="Chọn danh mục"
            >
              <Option value="all">Tất cả danh mục</Option>
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Danh sách dịch vụ */}
      <Card title="Danh sách dịch vụ" style={{ marginBottom: 24 }}>
        {filteredServices.length === 0 ? (
          <Empty description="Không tìm thấy dịch vụ nào" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredServices.map((service) => (
              <Col xs={24} sm={12} lg={8} key={service.id}>
                <Card
                  size="small"
                  hoverable
                  cover={
                    <div
                      style={{
                        height: 150,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 48,
                      }}
                    >
                      <CustomerServiceOutlined />
                    </div>
                  }
                  actions={[
                    <Button
                      type="primary"
                      size="small"
                      disabled={!service.available}
                      onClick={() => handleBookService(service)}
                    >
                      {service.available ? "Đặt dịch vụ" : "Không khả dụng"}
                    </Button>,
                  ]}
                >
                  <div style={{ marginBottom: 8 }}>
                    <Text strong ellipsis>
                      {service.name}
                    </Text>
                    <br />
                    <Tag color="blue">{service.category}</Tag>
                    {!service.available && <Tag color="red">Tạm ngưng</Tag>}
                  </div>

                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ fontSize: 12, marginBottom: 8 }}
                  >
                    {service.description}
                  </Paragraph>

                  <div style={{ marginBottom: 8 }}>
                    <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
                      {service.price.toLocaleString("vi-VN")}đ/{service.unit}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Thời gian: {service.duration}
                    </Text>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Space>
                      <Rate
                        disabled
                        value={service.rating}
                        style={{ fontSize: 12 }}
                      />
                      <Text style={{ fontSize: 12 }}>
                        ({service.totalBookings})
                      </Text>
                    </Space>
                  </div>

                  {service.tags && (
                    <div style={{ marginTop: 8 }}>
                      {service.tags.map((tag) => (
                        <Tag key={tag} size="small" color="green">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* Lịch sử đặt dịch vụ */}
      <Card title="Lịch sử đặt dịch vụ">
        {bookedServices.length === 0 ? (
          <Empty description="Chưa có dịch vụ nào được đặt" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={bookedServices}
            loading={loading}
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
            }}
            renderItem={(booking) => {
              const statusConfig = getStatusConfig(booking.status);
              return (
                <List.Item
                  actions={[
                    <Tooltip title="Xem chi tiết">
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewBookingDetail(booking)}
                      />
                    </Tooltip>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <CustomerServiceOutlined
                        style={{ fontSize: 24, color: "#1890ff" }}
                      />
                    }
                    title={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text strong>{booking.serviceName}</Text>
                        <Tag
                          color={statusConfig.color}
                          icon={statusConfig.icon}
                        >
                          {booking.status}
                        </Tag>
                      </div>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <Text type="secondary">
                          <CalendarOutlined /> Ngày đặt:
                          {dayjs(booking.bookingDate).format("DD/MM/YYYY")}
                        </Text>
                        <Text type="secondary">
                          <ClockCircleOutlined /> Ngày thực hiện:
                          {dayjs(booking.serviceDate).format("DD/MM/YYYY")}
                          {booking.serviceTime}
                        </Text>
                        <Text type="secondary">
                          <DollarOutlined /> Giá:
                          {booking.totalPrice.toLocaleString("vi-VN")}đ
                        </Text>
                        {booking.rating && (
                          <div>
                            <Rate
                              disabled
                              value={booking.rating}
                              style={{ fontSize: 12 }}
                            />
                          </div>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>

      {/* Modal đặt dịch vụ */}
      <Modal
        title="Xác nhận đặt dịch vụ"
        open={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        onOk={handleConfirmBooking}
        width={600}
      >
        {selectedService && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Tên dịch vụ" span={2}>
                <Text strong>{selectedService.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                <Tag color="blue">{selectedService.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Giá">
                <Text strong style={{ color: "#1890ff" }}>
                  {selectedService.price.toLocaleString("vi-VN")}đ/
                  {selectedService.unit}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian thực hiện">
                {selectedService.duration}
              </Descriptions.Item>
              <Descriptions.Item label="Nhà cung cấp">
                <Space>
                  <TeamOutlined />
                  {selectedService.provider.name}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <Space>
                  <PhoneOutlined />
                  {selectedService.provider.phone}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Đánh giá">
                <Rate
                  disabled
                  value={selectedService.provider.rating}
                  style={{ fontSize: 14 }}
                />
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <Text strong>Mô tả dịch vụ:</Text>
              <Paragraph
                style={{
                  marginTop: 8,
                  background: "#f6f6f6",
                  padding: 12,
                  borderRadius: 4,
                }}
              >
                {selectedService.description}
              </Paragraph>
            </div>

            <div
              style={{
                marginTop: 16,
                padding: 16,
                background: "#e6f7ff",
                borderRadius: 4,
                border: "1px solid #91d5ff",
              }}
            >
              <Text strong>Lưu ý:</Text>
              <ul style={{ marginTop: 8, marginBottom: 0 }}>
                <li>
                  Dịch vụ sẽ được thực hiện trong vòng 2-3 ngày kể từ khi đặt
                </li>
                <li>Vui lòng có mặt tại nhà trong giờ hẹn</li>
                <li>Có thể hủy dịch vụ trước 24h</li>
                <li>Thanh toán sau khi hoàn thành dịch vụ</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal chi tiết booking */}
      <Modal
        title={`Chi tiết đặt dịch vụ ${selectedBooking?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedBooking && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã đặt dịch vụ" span={2}>
                <Text strong>{selectedBooking.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tên dịch vụ" span={2}>
                {selectedBooking.serviceName}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {(() => {
                  const config = getStatusConfig(selectedBooking.status);
                  return (
                    <Tag color={config.color} icon={config.icon}>
                      {selectedBooking.status}
                    </Tag>
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Căn hộ">
                {selectedBooking.apartment}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {dayjs(selectedBooking.bookingDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày thực hiện">
                {dayjs(selectedBooking.serviceDate).format("DD/MM/YYYY")}
                {selectedBooking.serviceTime}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng">
                {selectedBooking.quantity}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Text strong style={{ color: "#1890ff" }}>
                  {selectedBooking.totalPrice.toLocaleString("vi-VN")}đ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Nhà cung cấp">
                {selectedBooking.provider.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedBooking.provider.phone}
              </Descriptions.Item>
              {selectedBooking.notes && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  {selectedBooking.notes}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedBooking.rating && (
              <div style={{ marginTop: 16 }}>
                <Text strong>Đánh giá của bạn:</Text>
                <div
                  style={{
                    marginTop: 8,
                    padding: 12,
                    background: "#f6f6f6",
                    borderRadius: 4,
                  }}
                >
                  <Rate disabled value={selectedBooking.rating} />
                  <br />
                  <Text style={{ marginTop: 8 }}>
                    {selectedBooking.feedback}
                  </Text>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResidentServices;
