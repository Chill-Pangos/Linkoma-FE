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
  Descriptions,
  Tooltip,
  InputNumber,
  Empty,
  Slider,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  DollarOutlined,
  EyeOutlined,
  ReloadOutlined,
  AreaChartOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { apartmentTypeService } from "../../../services";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const ApartmentTypeManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [viewingType, setViewingType] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // State cho dữ liệu
  const [apartmentTypes, setApartmentTypes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    avgArea: 0,
    avgRentFee: 0,
    minRentFee: 0,
    maxRentFee: 0,
    bedroomDistribution: {},
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    typeName: "",
    numBedrooms: "",
    numBathrooms: "",
    minArea: "",
    maxArea: "",
    minRentFee: "",
    maxRentFee: "",
    sortBy: "typeName:asc",
  });

  // Load dữ liệu ban đầu
  useEffect(() => {
    const initData = async () => {
      await loadStats();
      await loadApartmentTypes();
    };
    initData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load lại dữ liệu khi filter hoặc pagination thay đổi
  useEffect(() => {
    loadApartmentTypes();
  }, [filters, pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load danh sách loại căn hộ từ API
   */
  const loadApartmentTypes = async () => {
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

      console.log("Loading apartment types with params:", params);
      const response = await apartmentTypeService.getAllApartmentTypes(params);

      setApartmentTypes(response.apartmentTypes || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.pagination?.totalPages || 1,
        totalResults: response.pagination?.totalResults || 0,
      }));
    } catch (error) {
      console.error("Error loading apartment types:", error);
      message.error(
        "Lỗi khi tải danh sách loại căn hộ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load thống kê loại căn hộ từ API
   */
  const loadStats = async () => {
    try {
      const response = await apartmentTypeService.getApartmentTypeStats();
      setStats(response);
    } catch (error) {
      console.error("Error loading apartment type stats:", error);
      message.error(
        "Lỗi khi tải thống kê loại căn hộ: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  /**
   * Lọc danh sách loại căn hộ theo từ khóa tìm kiếm
   */
  const filteredApartmentTypes = apartmentTypes.filter((type) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();
    return (
      type.apartmentTypeId?.toString().includes(searchLower) ||
      type.typeName?.toLowerCase().includes(searchLower) ||
      type.description?.toLowerCase().includes(searchLower)
    );
  });

  /**
   * Xử lý thêm loại căn hộ mới
   */
  const handleAddType = () => {
    setEditingType(null);
    form.resetFields();
    setModalVisible(true);
  };

  /**
   * Xử lý sửa loại căn hộ
   */
  const handleEditType = (type) => {
    setEditingType(type);
    form.setFieldsValue({
      typeName: type.typeName,
      area: type.area,
      numBedrooms: type.numBedrooms,
      numBathrooms: type.numBathrooms,
      rentFee: parseFloat(type.rentFee),
      description: type.description,
    });
    setModalVisible(true);
  };

  /**
   * Xử lý xem chi tiết loại căn hộ
   */
  const handleViewType = async (type) => {
    try {
      setLoading(true);
      const detailData = await apartmentTypeService.getApartmentTypeById(
        type.apartmentTypeId
      );
      setViewingType(detailData);
      setViewModalVisible(true);
    } catch (error) {
      console.error("Error loading apartment type detail:", error);
      message.error(
        "Lỗi khi tải chi tiết loại căn hộ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý xóa loại căn hộ
   */
  const handleDeleteType = async (apartmentTypeId) => {
    try {
      setLoading(true);
      await apartmentTypeService.deleteApartmentType(apartmentTypeId);
      message.success("Xóa loại căn hộ thành công!");
      loadApartmentTypes();
      loadStats();
    } catch (error) {
      console.error("Error deleting apartment type:", error);
      message.error(
        "Lỗi khi xóa loại căn hộ: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý submit form loại căn hộ
   */
  const handleSubmitType = async (values) => {
    try {
      setLoading(true);

      if (editingType) {
        // Cập nhật loại căn hộ
        await apartmentTypeService.updateApartmentType(
          editingType.apartmentTypeId,
          values
        );
        message.success("Cập nhật loại căn hộ thành công!");
      } else {
        // Tạo loại căn hộ mới
        await apartmentTypeService.createApartmentType(values);
        message.success("Thêm loại căn hộ thành công!");
      }

      setModalVisible(false);
      form.resetFields();
      loadApartmentTypes();
      loadStats();
    } catch (error) {
      console.error("Error submitting apartment type:", error);
      message.error(
        "Lỗi khi lưu loại căn hộ: " +
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
      typeName: "",
      numBedrooms: "",
      numBathrooms: "",
      minArea: "",
      maxArea: "",
      minRentFee: "",
      maxRentFee: "",
      sortBy: "typeName:asc",
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

  // Cấu hình cột cho bảng loại căn hộ
  const columns = [
    {
      title: "ID",
      dataIndex: "apartmentTypeId",
      key: "apartmentTypeId",
      width: 80,
      sorter: true,
    },
    {
      title: "Tên loại",
      dataIndex: "typeName",
      key: "typeName",
      width: 150,
      sorter: true,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Diện tích",
      dataIndex: "area",
      key: "area",
      width: 100,
      sorter: true,
      render: (area) => <Text>{area}m²</Text>,
    },
    {
      title: "Phòng ngủ",
      dataIndex: "numBedrooms",
      key: "numBedrooms",
      width: 100,
      sorter: true,
      render: (num) => (
        <Tag color="blue" icon={<UserOutlined />}>
          {num} PN
        </Tag>
      ),
    },
    {
      title: "Phòng tắm",
      dataIndex: "numBathrooms",
      key: "numBathrooms",
      width: 100,
      sorter: true,
      render: (num) => (
        <Tag color="cyan" icon={<EnvironmentOutlined />}>
          {num} WC
        </Tag>
      ),
    },
    {
      title: "Giá thuê",
      dataIndex: "rentFee",
      key: "rentFee",
      width: 150,
      sorter: true,
      render: (rentFee) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatPrice(rentFee)}
        </Text>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Text type="secondary" ellipsis>
          {text || "Không có mô tả"}
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
              onClick={() => handleViewType(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditType(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa loại căn hộ này?"
              onConfirm={() => handleDeleteType(record.apartmentTypeId)}
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
          Quản lý loại căn hộ
        </Title>
      </div>

      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng loại căn hộ"
              value={stats.total}
              prefix={<HomeOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Diện tích TB"
              value={stats.avgArea?.toFixed(1) || 0}
              suffix="m²"
              prefix={<AreaChartOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Giá thuê TB"
              value={stats.avgRentFee || 0}
              formatter={(value) => formatPrice(value)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>Khoảng giá</Text>
            </div>
            <div>
              <Text type="secondary">Min: </Text>
              <Text strong style={{ color: "#52c41a" }}>
                {formatPrice(stats.minRentFee || 0)}
              </Text>
            </div>
            <div>
              <Text type="secondary">Max: </Text>
              <Text strong style={{ color: "#ff4d4f" }}>
                {formatPrice(stats.maxRentFee || 0)}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc và tìm kiếm */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm loại căn hộ..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <InputNumber
              placeholder="Số phòng ngủ"
              min={0}
              max={10}
              value={filters.numBedrooms}
              onChange={(value) => handleFilterChange("numBedrooms", value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <InputNumber
              placeholder="Số phòng tắm"
              min={0}
              max={10}
              value={filters.numBathrooms}
              onChange={(value) => handleFilterChange("numBathrooms", value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <InputNumber
              placeholder="Diện tích tối thiểu"
              min={0}
              value={filters.minArea}
              onChange={(value) => handleFilterChange("minArea", value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Select
              value={filters.sortBy}
              onChange={(value) => handleFilterChange("sortBy", value)}
              style={{ width: "100%" }}
            >
              <Option value="typeName:asc">Tên A-Z</Option>
              <Option value="typeName:desc">Tên Z-A</Option>
              <Option value="rentFee:asc">Giá tăng dần</Option>
              <Option value="rentFee:desc">Giá giảm dần</Option>
              <Option value="area:asc">Diện tích nhỏ-lớn</Option>
              <Option value="area:desc">Diện tích lớn-nhỏ</Option>
              <Option value="createdAt:desc">Mới nhất</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  loadApartmentTypes();
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

      {/* Bảng danh sách loại căn hộ */}
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
            Danh sách loại căn hộ ({pagination.totalResults})
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddType}
          >
            Thêm loại căn hộ
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredApartmentTypes}
          rowKey="apartmentTypeId"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalResults,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} loại căn hộ`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Không có dữ liệu loại căn hộ"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      {/* Modal thêm/sửa loại căn hộ */}
      <Modal
        title={editingType ? "Sửa loại căn hộ" : "Thêm loại căn hộ mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitType}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="typeName"
                label="Tên loại căn hộ"
                rules={[
                  { required: true, message: "Vui lòng nhập tên loại căn hộ!" },
                  {
                    min: 2,
                    message: "Tên loại căn hộ phải có ít nhất 2 ký tự!",
                  },
                ]}
              >
                <Input placeholder="Ví dụ: Studio, 1PN, 2PN..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="area"
                label="Diện tích (m²)"
                rules={[
                  { required: true, message: "Vui lòng nhập diện tích!" },
                  {
                    type: "number",
                    min: 10,
                    message: "Diện tích phải ít nhất 10m²!",
                  },
                ]}
              >
                <InputNumber
                  min={10}
                  max={500}
                  step={0.1}
                  placeholder="Ví dụ: 65.5"
                  style={{ width: "100%" }}
                  addonAfter="m²"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="numBedrooms"
                label="Số phòng ngủ"
                rules={[
                  { required: true, message: "Vui lòng nhập số phòng ngủ!" },
                ]}
              >
                <InputNumber
                  min={0}
                  max={10}
                  placeholder="Số phòng ngủ"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="numBathrooms"
                label="Số phòng tắm"
                rules={[
                  { required: true, message: "Vui lòng nhập số phòng tắm!" },
                ]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  placeholder="Số phòng tắm"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="rentFee"
            label="Giá thuê (VNĐ/tháng)"
            rules={[
              { required: true, message: "Vui lòng nhập giá thuê!" },
              {
                type: "number",
                min: 100000,
                message: "Giá thuê phải ít nhất 100,000 VNĐ!",
              },
            ]}
          >
            <InputNumber
              min={100000}
              max={100000000}
              step={100000}
              placeholder="Ví dụ: 8500000"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              addonAfter="VNĐ"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { max: 500, message: "Mô tả không được vượt quá 500 ký tự!" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Mô tả chi tiết về loại căn hộ này..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingType ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết loại căn hộ */}
      <Modal
        title="Chi tiết loại căn hộ"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {viewingType && (
          <div>
            <Descriptions title="Thông tin loại căn hộ" bordered>
              <Descriptions.Item label="ID" span={1}>
                {viewingType.apartmentTypeId}
              </Descriptions.Item>
              <Descriptions.Item label="Tên loại" span={2}>
                <Text strong style={{ fontSize: "16px" }}>
                  {viewingType.typeName}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Diện tích" span={1}>
                <Tag color="green" icon={<AreaChartOutlined />}>
                  {viewingType.area} m²
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phòng ngủ" span={1}>
                <Tag color="blue" icon={<UserOutlined />}>
                  {viewingType.numBedrooms} phòng
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phòng tắm" span={1}>
                <Tag color="cyan" icon={<EnvironmentOutlined />}>
                  {viewingType.numBathrooms} phòng
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Giá thuê" span={3}>
                <Text strong style={{ color: "#1890ff", fontSize: "18px" }}>
                  {formatPrice(viewingType.rentFee)}
                  <Text
                    type="secondary"
                    style={{ fontSize: "14px", marginLeft: "8px" }}
                  >
                    /tháng
                  </Text>
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={3}>
                <Text style={{ whiteSpace: "pre-wrap" }}>
                  {viewingType.description || "Không có mô tả"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={1}>
                {new Date(viewingType.createdAt).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối" span={2}>
                {new Date(viewingType.updatedAt).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApartmentTypeManagement;
