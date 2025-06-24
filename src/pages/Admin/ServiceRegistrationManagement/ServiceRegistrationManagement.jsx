import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  InputNumber,
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
  DatePicker,
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
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  serviceRegistrationService,
  serviceTypeService,
  apartmentService,
} from "../../../services";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const ServiceRegistrationManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [viewingRegistration, setViewingRegistration] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // State cho dữ liệu
  const [serviceRegistrations, setServiceRegistrations] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    cancelled: 0,
    statusDistribution: {},
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    apartmentId: "",
    serviceTypeId: "",
    status: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt:desc",
  });

  // Load dữ liệu ban đầu
  useEffect(() => {
    const initData = async () => {
      await Promise.all([
        loadStats(),
        loadServiceRegistrations(),
        loadServiceTypes(),
        loadApartments(),
      ]);
    };
    initData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load lại dữ liệu khi filter hoặc pagination thay đổi
  useEffect(() => {
    loadServiceRegistrations();
  }, [filters, pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load danh sách service registrations từ API
   */
  const loadServiceRegistrations = async () => {
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

      console.log("Loading service registrations with params:", params);
      const response =
        await serviceRegistrationService.getAllServiceRegistrations(params);

      setServiceRegistrations(response.serviceRegistrations || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.pagination?.totalPages || 1,
        totalResults: response.pagination?.totalResults || 0,
      }));
    } catch (error) {
      console.error("Error loading service registrations:", error);
      message.error(
        "Lỗi khi tải danh sách đăng ký dịch vụ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load thống kê service registrations từ API
   */
  const loadStats = async () => {
    try {
      const response =
        await serviceRegistrationService.getServiceRegistrationStats();
      setStats(response);
    } catch (error) {
      console.error("Error loading service registration stats:", error);
      message.error(
        "Lỗi khi tải thống kê đăng ký dịch vụ: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  /**
   * Load danh sách service types cho dropdown
   */
  const loadServiceTypes = async () => {
    try {
      const response = await serviceTypeService.getAllServiceTypes({
        limit: 100,
      });
      setServiceTypes(response.serviceTypes || []);
    } catch (error) {
      console.error("Error loading service types:", error);
    }
  };

  /**
   * Load danh sách apartments cho dropdown
   */
  const loadApartments = async () => {
    try {
      const response = await apartmentService.getAllApartments({ limit: 100 });
      setApartments(response.apartments || []);
    } catch (error) {
      console.error("Error loading apartments:", error);
    }
  };
  /**
   * Lọc danh sách service registrations theo từ khóa tìm kiếm
   */
  const filteredRegistrations = serviceRegistrations.filter((registration) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();
    return (
      registration.serviceRegistrationId?.toString().includes(searchLower) ||
      registration.note?.toLowerCase().includes(searchLower)
    );
  });

  /**
   * Xử lý thêm service registration mới
   */
  const handleAddRegistration = () => {
    setEditingRegistration(null);
    form.resetFields();
    setModalVisible(true);
  };
  /**
   * Xử lý sửa service registration
   */
  const handleEditRegistration = (registration) => {
    setEditingRegistration(registration);
    form.setFieldsValue({
      apartment_id: registration.apartmentId,
      service_type_id: registration.serviceTypeId,
      request_date: registration.startDate
        ? dayjs(registration.startDate)
        : null,
      end_date: registration.endDate ? dayjs(registration.endDate) : null,
      status: registration.status,
      notes: registration.note,
    });
    setModalVisible(true);
  };

  /**
   * Xử lý xem chi tiết service registration
   */
  const handleViewRegistration = async (registration) => {
    try {
      setLoading(true);
      const detailData =
        await serviceRegistrationService.getServiceRegistrationById(
          registration.serviceRegistrationId
        );
      setViewingRegistration(detailData);
      setViewModalVisible(true);
    } catch (error) {
      console.error("Error loading service registration detail:", error);
      message.error(
        "Lỗi khi tải chi tiết đăng ký dịch vụ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý xóa service registration
   */
  const handleDeleteRegistration = async (serviceRegistrationId) => {
    try {
      setLoading(true);
      await serviceRegistrationService.deleteServiceRegistration(
        serviceRegistrationId
      );
      message.success("Xóa đăng ký dịch vụ thành công!");
      loadServiceRegistrations();
      loadStats();
    } catch (error) {
      console.error("Error deleting service registration:", error);
      message.error(
        "Lỗi khi xóa đăng ký dịch vụ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };
  /**
   * Xử lý submit form service registration
   */
  const handleSubmitRegistration = async (values) => {
    try {
      setLoading(true);
      const submitData = {
        apartmentId: values.apartment_id,
        serviceTypeId: values.service_type_id,
        startDate: values.request_date
          ? values.request_date.format("YYYY-MM-DD")
          : null,
        status: values.status,
        note: values.notes || "",
      };

      // Only add endDate if it has a value
      if (values.end_date) {
        submitData.endDate = values.end_date.format("YYYY-MM-DD");
      }

      console.log("Submit data:", submitData);

      if (editingRegistration) {
        // Cập nhật service registration
        await serviceRegistrationService.updateServiceRegistration(
          editingRegistration.serviceRegistrationId,
          submitData
        );
        message.success("Cập nhật đăng ký dịch vụ thành công!");
      } else {
        // Tạo service registration mới
        await serviceRegistrationService.createServiceRegistration(submitData);
        message.success("Thêm đăng ký dịch vụ thành công!");
      }

      setModalVisible(false);
      form.resetFields();
      loadServiceRegistrations();
      loadStats();
    } catch (error) {
      console.error("Error submitting service registration:", error);
      message.error(
        "Lỗi khi lưu đăng ký dịch vụ: " +
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
      apartmentId: "",
      serviceTypeId: "",
      status: "",
      startDate: "",
      endDate: "",
      sortBy: "createdAt:desc",
    });
    setSearchText("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  /**
   * Get status color
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Inactive":
        return "orange";
      case "Cancelled":
        return "red";
      default:
        return "default";
    }
  };

  /**
   * Get status text
   */
  const getStatusText = (status) => {
    switch (status) {
      case "Active":
        return "Hoạt động";
      case "Inactive":
        return "Tạm dừng";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  /**
   * Get service type name by ID
   */
  const getServiceTypeName = (serviceTypeId) => {
    const serviceType = serviceTypes.find(
      (st) => st.serviceTypeId === serviceTypeId
    );
    return serviceType ? serviceType.serviceName : `ID: ${serviceTypeId}`;
  };

  /**
   * Get apartment number by ID
   */
  const getApartmentNumber = (apartmentId) => {
    const apartment = apartments.find((apt) => apt.apartmentId === apartmentId);
    return apartment ? apartment.apartmentNumber : `ID: ${apartmentId}`;
  };
  // Cấu hình cột cho bảng service registrations
  const columns = [
    {
      title: "ID",
      dataIndex: "serviceRegistrationId",
      key: "serviceRegistrationId",
      width: 80,
      sorter: true,
    },
    {
      title: "Căn hộ",
      dataIndex: "apartmentId",
      key: "apartmentId",
      width: 100,
      render: (apartmentId) => (
        <Text strong>{getApartmentNumber(apartmentId)}</Text>
      ),
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceTypeId",
      key: "serviceTypeId",
      width: 150,
      render: (serviceTypeId) => (
        <Text>{getServiceTypeName(serviceTypeId)}</Text>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "-",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "Không giới hạn",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Text type="secondary" ellipsis>
          {text || "Không có ghi chú"}
        </Text>
      ),
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
              onClick={() => handleViewRegistration(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditRegistration(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa đăng ký dịch vụ này?"
              onConfirm={() =>
                handleDeleteRegistration(record.serviceRegistrationId)
              }
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
          Quản lý đăng ký dịch vụ
        </Title>
      </div>
      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng đăng ký"
              value={stats.total}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={stats.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tạm dừng"
              value={stats.inactive}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={stats.cancelled}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>
      {/* Bộ lọc và tìm kiếm */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={5}>
            <Search
              placeholder="Tìm kiếm đăng ký..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Căn hộ"
              value={filters.apartmentId}
              onChange={(value) => handleFilterChange("apartmentId", value)}
              style={{ width: "100%" }}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {apartments.map((apt) => (
                <Option key={apt.apartmentId} value={apt.apartmentId}>
                  {apt.apartmentNumber}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Dịch vụ"
              value={filters.serviceTypeId}
              onChange={(value) => handleFilterChange("serviceTypeId", value)}
              style={{ width: "100%" }}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {serviceTypes.map((st) => (
                <Option key={st.serviceTypeId} value={st.serviceTypeId}>
                  {st.serviceName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Select
              placeholder="Trạng thái"
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              style={{ width: "100%" }}
              allowClear
            >
              <Option value="Active">Hoạt động</Option>
              <Option value="Inactive">Tạm dừng</Option>
              <Option value="Cancelled">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={filters.sortBy}
              onChange={(value) => handleFilterChange("sortBy", value)}
              style={{ width: "100%" }}
            >
              <Option value="createdAt:desc">Mới nhất</Option>
              <Option value="createdAt:asc">Cũ nhất</Option>
              <Option value="startDate:desc">Ngày bắt đầu mới</Option>
              <Option value="startDate:asc">Ngày bắt đầu cũ</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  loadServiceRegistrations();
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
      {/* Bảng danh sách đăng ký dịch vụ */}
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
            Danh sách đăng ký dịch vụ ({pagination.totalResults})
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRegistration}
          >
            Thêm đăng ký
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredRegistrations}
          rowKey="serviceRegistrationId"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalResults,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đăng ký`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Không có dữ liệu đăng ký dịch vụ"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>
      {/* Modal thêm/sửa đăng ký dịch vụ */}
      <Modal
        title={
          editingRegistration
            ? "Sửa đăng ký dịch vụ"
            : "Thêm đăng ký dịch vụ mới"
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitRegistration}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="apartment_id"
                label="Căn hộ"
                rules={[{ required: true, message: "Vui lòng chọn căn hộ!" }]}
              >
                <Select
                  placeholder="Chọn căn hộ"
                  showSearch
                  optionFilterProp="children"
                >
                  {apartments.map((apt) => (
                    <Option key={apt.apartmentId} value={apt.apartmentId}>
                      {apt.apartmentNumber}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="service_type_id"
                label="Loại dịch vụ"
                rules={[
                  { required: true, message: "Vui lòng chọn loại dịch vụ!" },
                ]}
              >
                <Select
                  placeholder="Chọn loại dịch vụ"
                  showSearch
                  optionFilterProp="children"
                >
                  {serviceTypes.map((st) => (
                    <Option key={st.serviceTypeId} value={st.serviceTypeId}>
                      {st.serviceName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="request_date"
                label="Ngày bắt đầu"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="end_date" label="Ngày kết thúc">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Để trống nếu không giới hạn"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
                initialValue="Active"
              >
                <Select>
                  <Option value="Active">Hoạt động</Option>
                  <Option value="Inactive">Tạm dừng</Option>
                  <Option value="Cancelled">Đã hủy</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
          <Form.Item name="notes" label="Ghi chú">
            <TextArea
              rows={3}
              placeholder="Ghi chú về đăng ký dịch vụ..."
              showCount
              maxLength={500}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRegistration ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal xem chi tiết đăng ký dịch vụ */}
      <Modal
        title="Chi tiết đăng ký dịch vụ"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {viewingRegistration && (
          <div>
            <Descriptions title="Thông tin đăng ký dịch vụ" bordered>
              <Descriptions.Item label="ID" span={1}>
                {viewingRegistration.serviceRegistrationId}
              </Descriptions.Item>
              <Descriptions.Item label="Căn hộ" span={1}>
                <Text strong>
                  {getApartmentNumber(viewingRegistration.apartmentId)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Dịch vụ" span={1}>
                <Text strong>
                  {getServiceTypeName(viewingRegistration.serviceTypeId)}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày bắt đầu" span={1}>
                {viewingRegistration.startDate
                  ? new Date(viewingRegistration.startDate).toLocaleDateString(
                      "vi-VN"
                    )
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc" span={1}>
                {viewingRegistration.endDate
                  ? new Date(viewingRegistration.endDate).toLocaleDateString(
                      "vi-VN"
                    )
                  : "Không giới hạn"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={1}>
                <Tag color={getStatusColor(viewingRegistration.status)}>
                  {getStatusText(viewingRegistration.status)}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Ghi chú" span={3}>
                <Text style={{ whiteSpace: "pre-wrap" }}>
                  {viewingRegistration.note || "Không có ghi chú"}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo" span={1}>
                {new Date(viewingRegistration.createdAt).toLocaleDateString(
                  "vi-VN"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối" span={2}>
                {new Date(viewingRegistration.updatedAt).toLocaleDateString(
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

export default ServiceRegistrationManagement;
