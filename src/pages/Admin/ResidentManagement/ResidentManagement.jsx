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
  DatePicker,
  Row,
  Col,
  Statistic,
  Avatar,
  Popconfirm,
  message,
  Typography,
  Divider,
  Upload,
  Badge,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  UploadOutlined,
  EyeOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { userService } from "../../../services";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const ResidentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [viewingResident, setViewingResident] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [residents, setResidents] = useState([]);
  const [totalResidents, setTotalResidents] = useState(0);

  // Load data khi component mount
  useEffect(() => {
    loadResidents();
  }, []);
  // Load danh sách cư dân (users với role = 'resident')
  const loadResidents = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsersByRole("resident");
      setResidents(response.data || []);
      setTotalResidents(response.totalCount || 0);
    } catch (error) {
      message.error("Không thể tải danh sách cư dân");
      console.error("Error loading residents:", error);
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 70,
      render: (avatar, record) => (
        <Avatar
          size={40}
          icon={<UserOutlined />}
          src={avatar}
          style={{ backgroundColor: "#1890ff" }}
        >
          {record.name ? record.name.charAt(0) : "U"}
        </Avatar>
      ),
    },
    {
      title: "Họ và Tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (text, record) => (
        <div>
          <Text strong>{text || "Chưa cập nhật"}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            ID: {record.userId}
          </Text>
        </div>
      ),
    },
    {
      title: "Căn hộ",
      dataIndex: "apartmentId",
      key: "apartmentId",
      render: (apartmentId) =>
        apartmentId ? (
          <Tag color="blue" icon={<HomeOutlined />}>
            Căn hộ {apartmentId}
          </Tag>
        ) : (
          <Tag color="default">Chưa có căn hộ</Tag>
        ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: "4px" }}>
            <PhoneOutlined style={{ marginRight: "4px", color: "#52c41a" }} />
            <Text copyable={{ text: record.phoneNumber }}>
              {record.phoneNumber || "Chưa cập nhật"}
            </Text>
          </div>
          <div>
            <MailOutlined style={{ marginRight: "4px", color: "#1890ff" }} />
            <Text
              copyable={{ text: record.email }}
              style={{ fontSize: "12px" }}
            >
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Thông tin cá nhân",
      key: "personal",
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: "4px" }}>
            <Text style={{ fontSize: "12px" }}>
              <strong>CCCD:</strong> {record.citizenId || "Chưa cập nhật"}
            </Text>
          </div>
          <div style={{ marginBottom: "4px" }}>
            <Text style={{ fontSize: "12px" }}>
              <strong>Ngày sinh:</strong>{" "}
              {record.dateOfBirth
                ? dayjs(record.dateOfBirth).format("DD/MM/YYYY")
                : "Chưa cập nhật"}
            </Text>
          </div>
          <div>
            <Text style={{ fontSize: "12px" }}>
              <strong>Biển số:</strong> {record.licensePlate || "Chưa có"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Hoạt động", value: "active" },
        { text: "Không hoạt động", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewResident(record)}
          >
            Xem
          </Button>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditResident(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa cư dân này?"
            onConfirm={() => handleDeleteResident(record.userId)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAddResident = () => {
    setEditingResident(null);
    form.resetFields();
    setModalVisible(true);
  };
  const handleEditResident = (resident) => {
    setEditingResident(resident);
    form.setFieldsValue({
      name: resident.name,
      email: resident.email,
      phoneNumber: resident.phoneNumber,
      citizenId: resident.citizenId,
      address: resident.address,
      licensePlate: resident.licensePlate,
      apartmentId: resident.apartmentId,
      status: resident.status,
      dateOfBirth: resident.dateOfBirth ? dayjs(resident.dateOfBirth) : null,
    });
    setModalVisible(true);
  };

  const handleViewResident = (resident) => {
    setViewingResident(resident);
    setViewModalVisible(true);
  };

  const handleDeleteResident = async (userId) => {
    try {
      setLoading(true);
      await userService.deleteUser(userId);
      message.success("Đã xóa cư dân thành công!");
      // Reload danh sách sau khi xóa
      loadResidents();
    } catch (error) {
      message.error("Không thể xóa cư dân");
      console.error("Error deleting resident:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Chuyển đổi format dữ liệu để gửi API
      const userData = {
        ...values,
        role: "resident", // Luôn luôn set role là resident
        dateOfBirth: values.dateOfBirth
          ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
          : null,
        apartmentId: values.apartmentId ? parseInt(values.apartmentId) : null,
      };

      // Không gửi password nếu đang edit và password trống
      if (editingResident && !values.password) {
        delete userData.password;
      }

      if (editingResident) {
        // Cập nhật resident
        await userService.updateUser(editingResident.userId, userData);
        message.success("Cập nhật thông tin cư dân thành công!");
      } else {
        // Tạo resident mới - cần password
        if (!values.password) {
          message.error("Vui lòng nhập mật khẩu cho cư dân mới!");
          setLoading(false);
          return;
        }
        await userService.createUser(userData);
        message.success("Thêm cư dân mới thành công!");
      }

      setModalVisible(false);
      setLoading(false);
      form.resetFields();

      // Reload danh sách sau khi thêm/sửa
      loadResidents();
    } catch (error) {
      setLoading(false);
      message.error(
        editingResident
          ? "Không thể cập nhật cư dân"
          : "Không thể tạo cư dân mới"
      );
      console.error("Error saving resident:", error);
    }
  };
  const filteredResidents = residents.filter(
    (resident) =>
      (resident.name &&
        resident.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (resident.phoneNumber && resident.phoneNumber.includes(searchText)) ||
      (resident.apartmentId &&
        resident.apartmentId.toString().includes(searchText)) ||
      resident.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const activeResidents = residents.filter((r) => r.status === "active").length;
  const totalFamilyMembers = residents.length; // Tạm thời dùng tổng số cư dân

  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Header với gradient */}
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
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1890ff, #36cfc9)",
              borderRadius: "12px",
              padding: "12px",
              marginRight: "16px",
            }}
          >
            <TeamOutlined style={{ fontSize: "24px", color: "white" }} />
          </div>
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
              Quản Lý Cư Dân
            </Title>
            <Text type="secondary">
              Quản lý thông tin và trạng thái cư dân chung cư
            </Text>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan với gradient cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            {" "}
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Tổng Cư Dân
                </span>
              }
              value={totalResidents}
              prefix={<UserOutlined style={{ color: "white" }} />}
              valueStyle={{
                color: "white",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              suffix={
                <span
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}
                >
                  người
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              border: "none",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Đang Sinh Sống
                </span>
              }
              value={activeResidents}
              prefix={<CheckCircleOutlined style={{ color: "white" }} />}
              valueStyle={{
                color: "white",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              suffix={
                <span
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}
                >
                  căn hộ
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
              border: "none",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Thành Viên Gia Đình
                </span>
              }
              value={totalFamilyMembers}
              prefix={<TeamOutlined style={{ color: "white" }} />}
              valueStyle={{
                color: "white",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              suffix={
                <span
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}
                >
                  người
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
              border: "none",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(100,100,100,0.8)" }}>
                  Tỷ Lệ Lấp Đầy
                </span>
              }
              value={Math.round((activeResidents / 100) * 100)}
              suffix={
                <span
                  style={{ color: "rgba(100,100,100,0.8)", fontSize: "16px" }}
                >
                  %
                </span>
              }
              prefix={<HomeOutlined style={{ color: "#666" }} />}
              valueStyle={{
                color: "#666",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng quản lý cư dân */}
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "none",
        }}
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #1890ff, #36cfc9)",
                borderRadius: "8px",
                padding: "8px",
                marginRight: "12px",
              }}
            >
              <UserOutlined style={{ color: "white", fontSize: "16px" }} />
            </div>
            <span
              style={{ fontSize: "18px", fontWeight: "bold", color: "#1890ff" }}
            >
              Danh Sách Cư Dân
            </span>
          </div>
        }
        extra={
          <Space>
            <Search
              placeholder="Tìm kiếm cư dân..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              style={{ minWidth: "300px" }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddResident}
              size="large"
              style={{
                background: "linear-gradient(135deg, #1890ff, #36cfc9)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
              }}
            >
              Thêm Cư Dân
            </Button>
          </Space>
        }
      >
        {" "}
        <Table
          columns={columns}
          dataSource={filteredResidents}
          rowKey="userId"
          loading={loading}
          pagination={{
            total: filteredResidents.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} cư dân`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal thêm/sửa cư dân */}
      <Modal
        title={
          editingResident ? "✏️ Sửa Thông Tin Cư Dân" : "➕ Thêm Cư Dân Mới"
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={800}
        confirmLoading={loading}
        okText={editingResident ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        {" "}
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: "active",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Nhập số điện thoại"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="apartmentId" label="ID Căn hộ">
                <Input placeholder="Nhập ID căn hộ" type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="citizenId"
                label="CCCD/CMND"
                rules={[
                  {
                    pattern: /^[0-9]{9,12}$/,
                    message: "Số CCCD/CMND không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Nhập số CCCD/CMND" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dateOfBirth" label="Ngày sinh">
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày sinh"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="licensePlate" label="Biển số xe">
                <Input placeholder="Nhập biển số xe" />
              </Form.Item>
            </Col>
            <Col span={12}>
              {!editingResident && (
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    {
                      required: !editingResident,
                      message: "Vui lòng nhập mật khẩu!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              )}
            </Col>
          </Row>

          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Nhập địa chỉ đầy đủ" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết cư dân */}
      <Modal
        title="👁️ Chi Tiết Cư Dân"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setViewModalVisible(false);
              handleEditResident(viewingResident);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={600}
      >
        {" "}
        {viewingResident && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              >
                {viewingResident.name ? viewingResident.name.charAt(0) : "U"}
              </Avatar>
              <Title
                level={4}
                style={{ marginTop: "12px", marginBottom: "4px" }}
              >
                {viewingResident.name || "Chưa cập nhật tên"}
              </Title>
              <Tag
                color={viewingResident.status === "active" ? "green" : "red"}
              >
                {viewingResident.status === "active"
                  ? "Hoạt động"
                  : "Không hoạt động"}
              </Tag>
            </div>

            <Divider />

            <Row gutter={[16, 12]}>
              <Col span={12}>
                <Text strong>📱 Điện thoại:</Text>
                <br />
                <Text copyable>
                  {viewingResident.phoneNumber || "Chưa cập nhật"}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>📧 Email:</Text>
                <br />
                <Text copyable>{viewingResident.email}</Text>
              </Col>
              <Col span={12}>
                <Text strong>🏠 Căn hộ:</Text>
                <br />
                {viewingResident.apartmentId ? (
                  <Tag color="blue">Căn hộ {viewingResident.apartmentId}</Tag>
                ) : (
                  <Text type="secondary">Chưa có căn hộ</Text>
                )}
              </Col>
              <Col span={12}>
                <Text strong>🆔 CCCD/CMND:</Text>
                <br />
                <Text>{viewingResident.citizenId || "Chưa cập nhật"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>📅 Ngày sinh:</Text>
                <br />
                <Text>
                  {viewingResident.dateOfBirth
                    ? dayjs(viewingResident.dateOfBirth).format("DD/MM/YYYY")
                    : "Chưa cập nhật"}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>� Biển số xe:</Text>
                <br />
                <Text>{viewingResident.licensePlate || "Chưa có"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>🏡 Địa chỉ:</Text>
                <br />
                <Text>{viewingResident.address || "Chưa cập nhật"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>� Ngày tạo:</Text>
                <br />
                <Text>
                  {dayjs(viewingResident.createdAt).format("DD/MM/YYYY HH:mm")}
                </Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResidentManagement;
