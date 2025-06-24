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
  InputNumber,
  Empty,
  Tooltip,
  Descriptions,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  EyeOutlined,
  ReloadOutlined,
  DollarOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import { serviceTypeService } from "../../../services";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const ServiceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [viewingService, setViewingService] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // State cho dữ liệu
  const [serviceTypes, setServiceTypes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    avgUnitPrice: 0,
    minUnitPrice: 0,
    maxUnitPrice: 0,
    unitDistribution: {},
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    serviceName: "",
    unit: "",
    minUnitPrice: "",
    maxUnitPrice: "",
    sortBy: "serviceName:asc",
  });

  // Load dữ liệu ban đầu
  useEffect(() => {
    const initData = async () => {
      await loadStats();
      await loadServiceTypes();
    };
    initData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load lại dữ liệu khi filter hoặc pagination thay đổi
  useEffect(() => {
    loadServiceTypes();
  }, [filters, pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load danh sách service types từ API
   */
  const loadServiceTypes = async () => {
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

      console.log("Loading service types with params:", params);
      const response = await serviceTypeService.getAllServiceTypes(params);

      setServiceTypes(response.serviceTypes || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.pagination?.totalPages || 1,
        totalResults: response.pagination?.totalResults || 0,
      }));
    } catch (error) {
      console.error("Error loading service types:", error);
      message.error(
        "Lỗi khi tải danh sách dịch vụ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load thống kê service types từ API
   */
  const loadStats = async () => {
    try {
      const response = await serviceTypeService.getServiceTypeStats();
      setStats(response);
    } catch (error) {
      console.error("Error loading service type stats:", error);
      message.error(
        "Lỗi khi tải thống kê dịch vụ: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  /**
   * Lọc danh sách service types theo từ khóa tìm kiếm
   */
  const filteredServiceTypes = serviceTypes.filter((service) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();
    return (
      service.serviceTypeId?.toString().includes(searchLower) ||
      service.serviceName?.toLowerCase().includes(searchLower) ||
      service.unit?.toLowerCase().includes(searchLower)
    );
  });

  /**
   * Xử lý thêm service type mới
   */
  const handleAddService = () => {
    setEditingService(null);
    form.resetFields();
    setModalVisible(true);
  };

  /**
   * Xử lý sửa service type
   */
  const handleEditService = (service) => {
    setEditingService(service);
    form.setFieldsValue({
      serviceName: service.serviceName,
      unit: service.unit,
      unitPrice: parseFloat(service.unitPrice),
    });
    setModalVisible(true);
  };

  /**
   * Xử lý xem chi tiết service type
   */
  const handleViewService = async (service) => {
    try {
      setLoading(true);
      const detailData = await serviceTypeService.getServiceTypeById(
        service.serviceTypeId
      );
      setViewingService(detailData);
      setViewModalVisible(true);
    } catch (error) {
      console.error("Error loading service type detail:", error);
      message.error(
        "Lỗi khi tải chi tiết dịch vụ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý xóa service type
   */
  const handleDeleteService = async (serviceTypeId) => {
    try {
      setLoading(true);
      await serviceTypeService.deleteServiceType(serviceTypeId);
      message.success("Xóa dịch vụ thành công!");
      loadServiceTypes();
      loadStats();
    } catch (error) {
      console.error("Error deleting service type:", error);
      message.error(
        "Lỗi khi xóa dịch vụ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý submit form service type
   */
  const handleSubmitService = async (values) => {
    try {
      setLoading(true);

      if (editingService) {
        // Cập nhật service type
        await serviceTypeService.updateServiceType(
          editingService.serviceTypeId,
          values
        );
        message.success("Cập nhật dịch vụ thành công!");
      } else {
        // Tạo service type mới
        await serviceTypeService.createServiceType(values);
        message.success("Thêm dịch vụ thành công!");
      }

      setModalVisible(false);
      form.resetFields();
      loadServiceTypes();
      loadStats();
    } catch (error) {
      console.error("Error submitting service type:", error);
      message.error(
        "Lỗi khi lưu dịch vụ: " +
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
      serviceName: "",
      unit: "",
      minUnitPrice: "",
      maxUnitPrice: "",
      sortBy: "serviceName:asc",
    });
    setSearchText("");
    setPagination((prev) => ({ ...prev, page: 1 }));
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

  // Cấu hình cột cho bảng service types
  const columns = [
    {
      title: "ID",
      dataIndex: "serviceTypeId",
      key: "serviceTypeId",
      width: 80,
      sorter: true,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      width: 200,
      sorter: true,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      width: 120,
      sorter: true,
      render: (unit) => <Tag color="blue">{unit}</Tag>,
    },
    {
      title: "Giá đơn vị",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 150,
      sorter: true,
      align: "right",
      render: (unitPrice) => (
        <Text strong style={{ color: "#52c41a" }}>
          {formatPrice(parseFloat(unitPrice))}
        </Text>
      ),
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
              onClick={() => handleViewService(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditService(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa dịch vụ này?"
              onConfirm={() => handleDeleteService(record.serviceTypeId)}
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
          <AppstoreOutlined style={{ marginRight: "8px" }} />
          Quản lý dịch vụ
        </Title>
      </div>

      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng dịch vụ"
              value={stats.total}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Giá TB"
              value={stats.avgUnitPrice?.toFixed(0) || 0}
              formatter={(value) => formatPrice(value)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Giá thấp nhất"
              value={stats.minUnitPrice || 0}
              formatter={(value) => formatPrice(value)}
              prefix={<AreaChartOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Giá cao nhất"
              value={stats.maxUnitPrice || 0}
              formatter={(value) => formatPrice(value)}
              prefix={<AreaChartOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc và tìm kiếm */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm dịch vụ..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Input
              placeholder="Tên dịch vụ"
              value={filters.serviceName}
              onChange={(e) =>
                handleFilterChange("serviceName", e.target.value)
              }
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Đơn vị"
              value={filters.unit}
              onChange={(value) => handleFilterChange("unit", value)}
              style={{ width: "100%" }}
              allowClear
            >
              <Option value="kWh">kWh</Option>
              <Option value="Mét khối">Mét khối</Option>
              <Option value="Tháng">Tháng</Option>
              <Option value="m²">m²</Option>
              <Option value="Lần">Lần</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={filters.sortBy}
              onChange={(value) => handleFilterChange("sortBy", value)}
              style={{ width: "100%" }}
            >
              <Option value="serviceName:asc">Tên A-Z</Option>
              <Option value="serviceName:desc">Tên Z-A</Option>
              <Option value="unitPrice:asc">Giá tăng dần</Option>
              <Option value="unitPrice:desc">Giá giảm dần</Option>
              <Option value="createdAt:desc">Mới nhất</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  loadServiceTypes();
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

      {/* Bảng danh sách dịch vụ */}
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
            Danh sách dịch vụ ({pagination.totalResults})
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddService}
          >
            Thêm dịch vụ
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredServiceTypes}
          rowKey="serviceTypeId"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalResults,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} dịch vụ`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Không có dữ liệu dịch vụ"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      {/* Modal thêm/sửa dịch vụ */}
      <Modal
        title={editingService ? "Sửa dịch vụ" : "Thêm dịch vụ mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitService}>
          <Form.Item
            name="serviceName"
            label="Tên dịch vụ"
            rules={[
              { required: true, message: "Vui lòng nhập tên dịch vụ!" },
              { min: 2, message: "Tên dịch vụ phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input placeholder="Ví dụ: Điện, Nước, Internet..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="Đơn vị"
                rules={[{ required: true, message: "Vui lòng nhập đơn vị!" }]}
              >
                <Select placeholder="Chọn đơn vị">
                  <Option value="kWh">kWh</Option>
                  <Option value="Mét khối">Mét khối</Option>
                  <Option value="Tháng">Tháng</Option>
                  <Option value="m²">m²</Option>
                  <Option value="Lần">Lần</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unitPrice"
                label="Giá đơn vị (VNĐ)"
                rules={[
                  { required: true, message: "Vui lòng nhập giá đơn vị!" },
                  {
                    type: "number",
                    min: 0,
                    message: "Giá phải lớn hơn hoặc bằng 0!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  step={100}
                  placeholder="Ví dụ: 3500"
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingService ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết dịch vụ */}
      <Modal
        title="Chi tiết dịch vụ"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {viewingService && (
          <div>
            <Descriptions title="Thông tin dịch vụ" bordered>
              <Descriptions.Item label="ID" span={1}>
                {viewingService.serviceTypeId}
              </Descriptions.Item>
              <Descriptions.Item label="Tên dịch vụ" span={2}>
                <Text strong style={{ fontSize: "16px" }}>
                  {viewingService.serviceName}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Đơn vị" span={1}>
                <Tag color="blue">{viewingService.unit}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Giá đơn vị" span={2}>
                <Text strong style={{ color: "#52c41a", fontSize: "18px" }}>
                  {formatPrice(parseFloat(viewingService.unitPrice))}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo" span={1}>
                {new Date(viewingService.createdAt).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối" span={2}>
                {new Date(viewingService.updatedAt).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServiceManagement;
