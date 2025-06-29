import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
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
  Popconfirm,
  message,
  Typography,
  Progress,
  Descriptions,
  Tooltip,
  InputNumber,
  Empty,
  Spin,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  UserOutlined,
  DollarOutlined,
  ToolOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { apartmentService, apartmentTypeService } from "../../../services";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const ApartmentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [viewingApartment, setViewingApartment] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // State cho dữ liệu
  const [apartments, setApartments] = useState([]);
  const [apartmentTypes, setApartmentTypes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    rented: 0,
    maintenance: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    floor: "",
    apartmentTypeId: "",
    sortBy: "floor:asc",
  });
  // Load dữ liệu ban đầu
  useEffect(() => {
    const initData = async () => {
      await loadApartmentTypes();
      await loadStats();
      await loadApartments();
    };
    initData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load lại dữ liệu khi filter hoặc pagination thay đổi
  useEffect(() => {
    loadApartments();
  }, [filters, pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load danh sách căn hộ từ API
   */
  const loadApartments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      // Loại bỏ các filter trống
      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });

      console.log("Loading apartments with params:", params);
      const response = await apartmentService.getAllApartments(params);

      setApartments(response.apartments || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.pagination?.totalPages || 1,
        totalResults: response.pagination?.totalResults || 0,
      }));
    } catch (error) {
      console.error("Error loading apartments:", error);
      message.error(
        "Lỗi khi tải danh sách căn hộ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load danh sách loại căn hộ từ API
   */
  const loadApartmentTypes = async () => {
    try {
      const response = await apartmentTypeService.getAllApartmentTypes({
        limit: 100,
      });
      setApartmentTypes(response.apartmentTypes || []);
    } catch (error) {
      console.error("Error loading apartment types:", error);
      message.error(
        "Lỗi khi tải danh sách loại căn hộ: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  /**
   * Load thống kê căn hộ từ API
   */
  const loadStats = async () => {
    try {
      const response = await apartmentService.getApartmentStats();
      setStats(response);
    } catch (error) {
      console.error("Error loading apartment stats:", error);
      message.error(
        "Lỗi khi tải thống kê căn hộ: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  /**
   * Lọc danh sách căn hộ theo từ khóa tìm kiếm
   */
  const filteredApartments = apartments.filter((apartment) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();
    return (
      apartment.apartmentId?.toString().includes(searchLower) ||
      apartment.floor?.toString().includes(searchLower) ||
      apartment.status?.toLowerCase().includes(searchLower) ||
      apartment.apartmentType?.typeName?.toLowerCase().includes(searchLower)
    );
  });

  /**
   * Xử lý thêm căn hộ mới
   */
  const handleAddApartment = () => {
    setEditingApartment(null);
    form.resetFields();
    setModalVisible(true);
  };

  /**
   * Xử lý sửa căn hộ
   */
  const handleEditApartment = (apartment) => {
    setEditingApartment(apartment);
    form.setFieldsValue({
      apartmentTypeId: apartment.apartmentTypeId,
      floor: apartment.floor,
      status: apartment.status,
    });
    setModalVisible(true);
  };

  /**
   * Xử lý xem chi tiết căn hộ
   */
  const handleViewApartment = async (apartment) => {
    try {
      setLoading(true);
      const detailData = await apartmentService.getApartmentById(
        apartment.apartmentId
      );
      setViewingApartment(detailData);
      setViewModalVisible(true);
    } catch (error) {
      console.error("Error loading apartment detail:", error);
      message.error(
        "Lỗi khi tải chi tiết căn hộ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý xóa căn hộ
   */
  const handleDeleteApartment = async (apartmentId) => {
    try {
      setLoading(true);
      await apartmentService.deleteApartment(apartmentId);
      message.success("Xóa căn hộ thành công!");
      loadApartments();
      loadStats();
    } catch (error) {
      console.error("Error deleting apartment:", error);
      message.error(
        "Lỗi khi xóa căn hộ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý submit form căn hộ
   */
  const handleSubmitApartment = async (values) => {
    try {
      setLoading(true);

      if (editingApartment) {
        // Cập nhật căn hộ
        await apartmentService.updateApartment(
          editingApartment.apartmentId,
          values
        );
        message.success("Cập nhật căn hộ thành công!");
      } else {
        // Tạo căn hộ mới
        await apartmentService.createApartment(values);
        message.success("Thêm căn hộ thành công!");
      }

      setModalVisible(false);
      form.resetFields();
      loadApartments();
      loadStats();
    } catch (error) {
      console.error("Error submitting apartment:", error);
      message.error(
        "Lỗi khi lưu căn hộ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý thay đổi filter
   */
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset về trang 1 khi filter
  };

  /**
   * Xử lý thay đổi trang
   */
  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      page: page,
      limit: pageSize,
    }));
  };

  /**
   * Reset filter
   */
  const handleResetFilters = () => {
    setFilters({
      status: "",
      floor: "",
      apartmentTypeId: "",
      sortBy: "floor:asc",
    });
    setSearchText("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  /**
   * Render tag trạng thái căn hộ
   */
  const renderStatusTag = (status) => {
    const statusConfig = {
      available: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Có sẵn",
      },
      rented: { color: "blue", icon: <UserOutlined />, text: "Đã thuê" },
      maintenance: { color: "orange", icon: <ToolOutlined />, text: "Bảo trì" },
    };

    const config = statusConfig[status] || statusConfig.available;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  /**
   * Format giá tiền
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Cấu hình cột cho bảng căn hộ
  const columns = [
    {
      title: "ID",
      dataIndex: "apartmentId",
      key: "apartmentId",
      width: 80,
      sorter: true,
    },
    {
      title: "Tầng",
      dataIndex: "floor",
      key: "floor",
      width: 80,
      sorter: true,
    },
    {
      title: "Loại căn hộ",
      key: "apartmentType",
      width: 150,
      render: (_, record) => (
        <div>
          <Text strong>{record.apartmentType?.typeName}</Text>
          <br />
          <Text type="secondary">{record.apartmentType?.area}m²</Text>
        </div>
      ),
    },
    {
      title: "Phòng ngủ/WC",
      key: "rooms",
      width: 120,
      render: (_, record) => (
        <div>
          <Text>{record.apartmentType?.numBedrooms} PN</Text>
          <br />
          <Text type="secondary">{record.apartmentType?.numBathrooms} WC</Text>
        </div>
      ),
    },
    {
      title: "Giá thuê",
      key: "rentFee",
      width: 120,
      render: (_, record) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatPrice(record.apartmentType?.rentFee)}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: renderStatusTag,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewApartment(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditApartment(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa căn hộ này?"
              onConfirm={() => handleDeleteApartment(record.apartmentId)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>
          <HomeOutlined style={{ marginRight: "8px" }} />
          Quản lý căn hộ
        </Title>
      </div>

      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng căn hộ"
              value={stats.total}
              prefix={<HomeOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Có sẵn"
              value={stats.available}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã thuê"
              value={stats.rented}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Bảo trì"
              value={stats.maintenance}
              prefix={<ToolOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Progress
                percent={
                  stats.total > 0
                    ? Math.round((stats.rented / stats.total) * 100)
                    : 0
                }
                size="small"
                format={(percent) => `${percent}% đã thuê`}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc và tìm kiếm */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm căn hộ..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Trạng thái"
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              style={{ width: "100%" }}
            >
              <Option value="available">Có sẵn</Option>
              <Option value="rented">Đã thuê</Option>
              <Option value="maintenance">Bảo trì</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <InputNumber
              placeholder="Tầng"
              min={1}
              value={filters.floor}
              onChange={(value) => handleFilterChange("floor", value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Loại căn hộ"
              allowClear
              value={filters.apartmentTypeId}
              onChange={(value) => handleFilterChange("apartmentTypeId", value)}
              style={{ width: "100%" }}
            >
              {apartmentTypes.map((type) => (
                <Option key={type.apartmentTypeId} value={type.apartmentTypeId}>
                  {type.typeName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Select
              value={filters.sortBy}
              onChange={(value) => handleFilterChange("sortBy", value)}
              style={{ width: "100%" }}
            >
              <Option value="floor:asc">Tầng tăng dần</Option>
              <Option value="floor:desc">Tầng giảm dần</Option>
              <Option value="createdAt:desc">Mới nhất</Option>
              <Option value="createdAt:asc">Cũ nhất</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  loadApartments();
                  loadStats();
                }}
              >
                Làm mới
              </Button>
              <Button onClick={handleResetFilters}>Reset</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Bảng danh sách căn hộ */}
      <Card>
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Danh sách căn hộ ({pagination.totalResults})
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddApartment}
          >
            Thêm căn hộ
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredApartments}
          rowKey="apartmentId"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalResults,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} căn hộ`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Không có dữ liệu căn hộ"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      {/* Modal thêm/sửa căn hộ */}
      <Modal
        title={editingApartment ? "Sửa căn hộ" : "Thêm căn hộ mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitApartment}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="apartmentTypeId"
                label="Loại căn hộ"
                rules={[
                  { required: true, message: "Vui lòng chọn loại căn hộ!" },
                ]}
              >
                <Select placeholder="Chọn loại căn hộ">
                  {apartmentTypes.map((type) => (
                    <Option
                      key={type.apartmentTypeId}
                      value={type.apartmentTypeId}
                    >
                      <div>
                        <div>{type.typeName}</div>
                        <div style={{ fontSize: "12px", color: "#999" }}>
                          {type.area}m² - {type.numBedrooms}PN -
                          {formatPrice(type.rentFee)}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="floor"
                label="Tầng"
                rules={[{ required: true, message: "Vui lòng nhập số tầng!" }]}
              >
                <InputNumber
                  min={1}
                  max={50}
                  placeholder="Nhập số tầng"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="available">
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  Có sẵn
                </Tag>
              </Option>
              <Option value="rented">
                <Tag color="blue" icon={<UserOutlined />}>
                  Đã thuê
                </Tag>
              </Option>
              <Option value="maintenance">
                <Tag color="orange" icon={<ToolOutlined />}>
                  Bảo trì
                </Tag>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingApartment ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết căn hộ */}
      <Modal
        title="Chi tiết căn hộ"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {viewingApartment && (
          <div>
            <Descriptions title="Thông tin căn hộ" bordered>
              <Descriptions.Item label="ID" span={1}>
                {viewingApartment.apartmentId}
              </Descriptions.Item>
              <Descriptions.Item label="Tầng" span={1}>
                {viewingApartment.floor}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={1}>
                {renderStatusTag(viewingApartment.status)}
              </Descriptions.Item>

              <Descriptions.Item label="Loại căn hộ" span={3}>
                {viewingApartment.apartmentType?.typeName}
              </Descriptions.Item>

              <Descriptions.Item label="Diện tích" span={1}>
                {viewingApartment.apartmentType?.area} m²
              </Descriptions.Item>
              <Descriptions.Item label="Phòng ngủ" span={1}>
                {viewingApartment.apartmentType?.numBedrooms}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng tắm" span={1}>
                {viewingApartment.apartmentType?.numBathrooms}
              </Descriptions.Item>

              <Descriptions.Item label="Giá thuê" span={2}>
                <Text strong style={{ color: "#1890ff", fontSize: "16px" }}>
                  {formatPrice(viewingApartment.apartmentType?.rentFee)}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Mô tả" span={3}>
                {viewingApartment.apartmentType?.description ||
                  "Không có mô tả"}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo" span={1}>
                {new Date(viewingApartment.createdAt).toLocaleDateString(
                  "vi-VN"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối" span={2}>
                {new Date(viewingApartment.updatedAt).toLocaleDateString(
                  "vi-VN"
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApartmentManagement;
