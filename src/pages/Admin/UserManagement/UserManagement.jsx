import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Avatar,
  Modal,
  Form,
  Select,
  Row,
  Col,
  Statistic,
  Typography,
  Popconfirm,
  message,
  Tooltip,
  Badge,
  DatePicker,
  Divider,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TeamOutlined,
  CrownOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { userService, roleService } from "../../../services";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userStats, setUserStats] = useState({});
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  // Load data khi component mount
  useEffect(() => {
    loadUsers();
    loadUserStats();
    loadRoles();
  }, []);
  // Load danh sách users
  const loadUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers(page, limit);
      console.log("Users API response:", response); // Debug log
      setUsers(response.data || []);
      setPagination({
        current: page,
        pageSize: limit,
        total: response.totalCount || 0,
      });
      setTotalUsers(response.totalCount || 0);
    } catch (error) {
      message.error("Không thể tải danh sách người dùng");
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };
  // Load thống kê users
  const loadUserStats = async () => {
    try {
      const stats = await userService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  };

  // Load danh sách roles
  const loadRoles = async () => {
    try {
      const response = await roleService.getAllRoles();
      setRoles(response.roles || []);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };
  const getRoleColor = (role) => {
    return roleService.getRoleColor(role);
  };

  const getRoleText = (role) => {
    return roleService.getRoleDisplayName(role);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <CrownOutlined />;
      case "manager":
        return <SettingOutlined />;
      case "staff":
        return <UserOutlined />;
      case "resident":
        return <TeamOutlined />;
      case "security":
        return <CheckCircleOutlined />;
      default:
        return <UserOutlined />;
    }
  };
  const columns = [
    {
      title: "Người dùng",
      key: "user",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{
              backgroundColor: getRoleColor(record.role),
              marginRight: "12px",
            }}
          />
          <div>
            <Text strong style={{ fontSize: "14px" }}>
              {record.name || "Chưa cập nhật"}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              ID: {record.userId}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: "4px" }}>
            <MailOutlined style={{ marginRight: "6px", color: "#1890ff" }} />
            <Text style={{ fontSize: "13px" }}>
              {record.email || "Chưa cập nhật"}
            </Text>
          </div>
          <div>
            <PhoneOutlined style={{ marginRight: "6px", color: "#52c41a" }} />
            <Text style={{ fontSize: "13px" }}>
              {record.phoneNumber || "Chưa cập nhật"}
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
              <strong>Ngày sinh:</strong>
              {record.dateOfBirth
                ? dayjs(record.dateOfBirth).format("DD/MM/YYYY")
                : "Chưa cập nhật"}
            </Text>
          </div>
          <div>
            <Text style={{ fontSize: "12px" }}>
              <strong>Căn hộ:</strong> {record.apartmentId || "Chưa có"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      filters: roles.map((role) => ({
        text: roleService.getRoleDisplayName(role),
        value: role,
      })),
      onFilter: (value, record) => record.role === value,
      render: (role) => (
        <Tag color={getRoleColor(role)} icon={getRoleIcon(role)}>
          {getRoleText(role)}
        </Tag>
      ),
    }, // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   filters: [
    //     { text: "Hoạt động", value: "active" },
    //     { text: "Không hoạt động", value: "inactive" },
    //   ],
    //   onFilter: (value, record) => record.status === value,
    //   render: (status) => (
    //     <Badge
    //       status={status === "active" ? "success" : "default"}
    //       text={status === "active" ? "Hoạt động" : "Không hoạt động"}
    //     />
    //   ),
    // },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <div>
          <ClockCircleOutlined style={{ marginRight: "6px", color: "#666" }} />
          <Text style={{ fontSize: "12px" }}>
            {createdAt
              ? dayjs(createdAt).format("DD/MM/YYYY HH:mm")
              : "Không có thông tin"}
          </Text>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa người dùng này?"
              onConfirm={() => handleDeleteUser(record.userId)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };
  const handleEditUser = (user) => {
    setEditingUser(user);
    // Map dữ liệu từ API sang form
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      citizenId: user.citizenId,
      address: user.address,
      licensePlate: user.licensePlate,
      apartmentId: user.apartmentId,
      role: user.role,
      status: user.status,
      dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
    });
    setModalVisible(true);
  };
  const handleViewUser = (user) => {
    console.log("User data for view:", user); // Debug log
    setViewingUser(user);
    setViewModalVisible(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await userService.deleteUser(userId);
      message.success("Đã xóa người dùng thành công!");
      // Reload danh sách sau khi xóa
      loadUsers(pagination.current, pagination.pageSize);
      loadUserStats();
    } catch (error) {
      message.error("Không thể xóa người dùng");
      console.error("Error deleting user:", error);
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
        dateOfBirth: values.dateOfBirth
          ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
          : null,
        apartmentId: values.apartmentId ? parseInt(values.apartmentId) : null,
      };

      // Không gửi password nếu đang edit và password trống
      if (editingUser && !values.password) {
        delete userData.password;
      }

      if (editingUser) {
        // Cập nhật user
        await userService.updateUser(editingUser.userId, userData);

        // Nếu role thay đổi, gọi API assign role
        if (editingUser.role !== values.role) {
          try {
            await roleService.assignRoleToUser(editingUser.userId, values.role);
            console.log("Role updated successfully");
          } catch (roleError) {
            console.error("Error updating role:", roleError);
            message.warning(
              "Cập nhật thông tin thành công nhưng không thể thay đổi role"
            );
          }
        }

        message.success("Cập nhật người dùng thành công!");
      } else {
        // Tạo user mới
        const newUser = await userService.createUser(userData);

        // Assign role cho user mới nếu có role được chỉ định
        if (values.role && newUser.userId) {
          try {
            await roleService.assignRoleToUser(newUser.userId, values.role);
            console.log("Role assigned successfully");
          } catch (roleError) {
            console.error("Error assigning role:", roleError);
            message.warning("Tạo user thành công nhưng không thể gán role");
          }
        }

        message.success("Thêm người dùng mới thành công!");
      }

      setModalVisible(false);
      setLoading(false);
      form.resetFields();

      // Reload danh sách sau khi thêm/sửa
      loadUsers(pagination.current, pagination.pageSize);
      loadUserStats();
    } catch (error) {
      setLoading(false);
      message.error(
        editingUser
          ? "Không thể cập nhật người dùng"
          : "Không thể tạo người dùng mới"
      );
      console.error("Error saving user:", error);
    }
  };
  const filteredUsers = users.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.phoneNumber && user.phoneNumber.includes(searchText)) ||
      (user.userId && user.userId.toString().includes(searchText))
  ); // Thống kê - sử dụng từ userStats
  // const activeUsers = users.filter((u) => u.status === "active").length; // Tạm ẩn vì backend chưa trả về status
  const managerUsers = userStats.manager || 0; // Thêm manager users
  const adminUsers = userStats.admin || 0;
  const residentUsers = userStats.resident || 0;

  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
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
              Quản Lý Tài Khoản
            </Title>
            <Text type="secondary">
              Quản lý tài khoản người dùng trong hệ thống
            </Text>
          </div>
        </div>
      </div>

      {/* Thống kê */}
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
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Tổng Tài Khoản
                </span>
              }
              value={userStats.total || totalUsers}
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
                  tài khoản
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
                <span style={{ color: "rgba(255,255,255,0.8)" }}>Quản Lý</span>
              }
              value={managerUsers}
              prefix={<SettingOutlined style={{ color: "white" }} />}
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
              background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
              border: "none",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Quản Trị Viên
                </span>
              }
              value={adminUsers}
              prefix={<CrownOutlined style={{ color: "white" }} />}
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
                <span style={{ color: "rgba(100,100,100,0.8)" }}>Cư Dân</span>
              }
              value={residentUsers}
              prefix={<TeamOutlined style={{ color: "#666" }} />}
              valueStyle={{
                color: "#666",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              suffix={
                <span
                  style={{ color: "rgba(100,100,100,0.8)", fontSize: "16px" }}
                >
                  người
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng quản lý */}
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
              Danh Sách Tài Khoản
            </span>
          </div>
        }
        extra={
          <Space>
            <Search
              placeholder="Tìm kiếm tài khoản..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ minWidth: "300px" }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
              size="large"
              style={{
                background: "linear-gradient(135deg, #1890ff, #36cfc9)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
              }}
            >
              Thêm Tài Khoản
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="userId"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} tài khoản`,
            onChange: (page, pageSize) => {
              loadUsers(page, pageSize);
            },
            onShowSizeChange: (current, pageSize) => {
              loadUsers(1, pageSize);
            },
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal thêm/sửa */}
      <Modal
        title={editingUser ? "✏️ Sửa Tài Khoản" : "➕ Thêm Tài Khoản Mới"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={600}
        confirmLoading={loading}
        okText={editingUser ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: "active",
            role: "resident",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="example@email.com" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input placeholder="0912345678" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="citizenId" label="Số CCCD">
                <Input placeholder="Nhập số CCCD" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dateOfBirth" label="Ngày sinh">
                <DatePicker
                  placeholder="Chọn ngày sinh"
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="apartmentId" label="ID Căn hộ">
                <Input placeholder="Nhập ID căn hộ" type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="address" label="Địa chỉ">
                <Input placeholder="Nhập địa chỉ đầy đủ" />
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
              {!editingUser && (
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    {
                      required: !editingUser,
                      message: "Vui lòng nhập mật khẩu!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              )}
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              >
                <Select placeholder="Chọn vai trò">
                  {roles.map((role) => (
                    <Option key={role} value={role}>
                      <Tag
                        color={roleService.getRoleColor(role)}
                        style={{ margin: 0 }}
                      >
                        {roleService.getRoleDisplayName(role)}
                      </Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal xem chi tiết người dùng */}
      <Modal
        title="👁️ Chi Tiết Người Dùng"
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
              handleEditUser(viewingUser);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={600}
      >
        {viewingUser && (
          <div style={{ padding: "16px 0" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: getRoleColor(viewingUser.role || "resident"),
                }}
              />
              <Title level={4} style={{ margin: "8px 0" }}>
                {viewingUser.name || "Chưa cập nhật"}
              </Title>
              <Tag
                color={getRoleColor(viewingUser.role || "resident")}
                icon={getRoleIcon(viewingUser.role || "resident")}
              >
                {getRoleText(viewingUser.role || "resident")}
              </Tag>
            </div>

            <Row gutter={[16, 12]}>
              <Col span={12}>
                <Text strong>🆔 ID:</Text>
                <br />
                <Text>{viewingUser.userId || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>📧 Email:</Text>
                <br />
                <Text copyable>{viewingUser.email || "Chưa cập nhật"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>📱 Điện thoại:</Text>
                <br />
                <Text copyable>
                  {viewingUser.phoneNumber || "Chưa cập nhật"}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>🆔 CCCD:</Text>
                <br />
                <Text>{viewingUser.citizenId || "Chưa cập nhật"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>📅 Ngày sinh:</Text>
                <br />
                <Text>
                  {viewingUser.dateOfBirth
                    ? dayjs(viewingUser.dateOfBirth).format("DD/MM/YYYY")
                    : "Chưa cập nhật"}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>🏠 Căn hộ:</Text>
                <br />
                {viewingUser.apartmentId ? (
                  <Tag color="blue">Căn hộ {viewingUser.apartmentId}</Tag>
                ) : (
                  <Text type="secondary">Chưa có</Text>
                )}
              </Col>
              <Col span={12}>
                <Text strong>🏡 Địa chỉ:</Text>
                <br />
                <Text>{viewingUser.address || "Chưa cập nhật"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>🚗 Biển số xe:</Text>
                <br />
                <Text>{viewingUser.licensePlate || "Chưa có"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>⏰ Ngày tạo:</Text>
                <br />
                <Text>
                  {viewingUser.createdAt
                    ? dayjs(viewingUser.createdAt).format("DD/MM/YYYY HH:mm")
                    : "Không có thông tin"}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>🔄 Ngày cập nhật:</Text>
                <br />
                <Text>
                  {viewingUser.updatedAt
                    ? dayjs(viewingUser.updatedAt).format("DD/MM/YYYY HH:mm")
                    : "Không có thông tin"}
                </Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
