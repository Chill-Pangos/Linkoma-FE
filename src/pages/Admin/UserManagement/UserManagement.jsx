import React, { useState } from "react";
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
  Badge
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
  PhoneOutlined
} from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Dữ liệu mẫu người dùng
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Admin Nguyễn Văn A',
      email: 'admin@linkoma.com',
      phone: '0912345678',
      role: 'admin',
      status: 'active',
      avatar: null,
      lastLogin: '2024-12-20 10:30',
      createdAt: '2024-01-15',
      department: 'IT'
    },
    {
      id: '2',
      name: 'Quản lý Trần Thị B',
      email: 'manager.tran@linkoma.com',
      phone: '0923456789',
      role: 'manager',
      status: 'active',
      avatar: null,
      lastLogin: '2024-12-20 09:15',
      createdAt: '2024-02-20',
      department: 'Quản lý'
    },
    {
      id: '3',
      name: 'Nhân viên Lê Văn C',
      email: 'staff.le@linkoma.com',
      phone: '0934567890',
      role: 'staff',
      status: 'inactive',
      avatar: null,
      lastLogin: '2024-12-18 14:20',
      createdAt: '2024-03-10',
      department: 'Kỹ thuật'
    },
    {
      id: '4',
      name: 'Cư dân Phạm Thị D',
      email: 'resident.pham@gmail.com',
      phone: '0945678901',
      role: 'resident',
      status: 'active',
      avatar: null,
      lastLogin: '2024-12-20 08:45',
      createdAt: '2024-04-05',
      department: 'Cư dân'
    },
    {
      id: '5',
      name: 'Bảo vệ Hoàng Văn E',
      email: 'security.hoang@linkoma.com',
      phone: '0956789012',
      role: 'security',
      status: 'active',
      avatar: null,
      lastLogin: '2024-12-20 07:00',
      createdAt: '2024-05-12',
      department: 'Bảo vệ'
    }
  ]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ff4d4f';
      case 'manager': return '#722ed1';
      case 'staff': return '#1890ff';
      case 'resident': return '#52c41a';
      case 'security': return '#faad14';
      default: return '#666';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'manager': return 'Quản lý';
      case 'staff': return 'Nhân viên';
      case 'resident': return 'Cư dân';
      case 'security': return 'Bảo vệ';
      default: return 'Không xác định';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <CrownOutlined />;
      case 'manager': return <SettingOutlined />;
      case 'staff': return <UserOutlined />;
      case 'resident': return <TeamOutlined />;
      case 'security': return <CheckCircleOutlined />;
      default: return <UserOutlined />;
    }
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: getRoleColor(record.role),
              marginRight: '12px'
            }}
          />
          <div>
            <Text strong style={{ fontSize: '14px' }}>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {record.id}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <MailOutlined style={{ marginRight: '6px', color: '#1890ff' }} />
            <Text style={{ fontSize: '13px' }}>{record.email}</Text>
          </div>
          <div>
            <PhoneOutlined style={{ marginRight: '6px', color: '#52c41a' }} />
            <Text style={{ fontSize: '13px' }}>{record.phone}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Quản trị viên', value: 'admin' },
        { text: 'Quản lý', value: 'manager' },
        { text: 'Nhân viên', value: 'staff' },
        { text: 'Cư dân', value: 'resident' },
        { text: 'Bảo vệ', value: 'security' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => (
        <Tag color={getRoleColor(role)} icon={getRoleIcon(role)}>
          {getRoleText(role)}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        />
      ),
    },
    {
      title: 'Lần đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin) => (
        <div>
          <ClockCircleOutlined style={{ marginRight: '6px', color: '#666' }} />
          <Text style={{ fontSize: '12px' }}>{lastLogin}</Text>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
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
              onConfirm={() => handleDeleteUser(record.id)}
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
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleViewUser = (user) => {
    Modal.info({
      title: 'Thông tin chi tiết người dùng',
      width: 500,
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: getRoleColor(user.role) }} />
            <Title level={4} style={{ margin: '8px 0' }}>{user.name}</Title>
            <Tag color={getRoleColor(user.role)} icon={getRoleIcon(user.role)}>
              {getRoleText(user.role)}
            </Tag>
          </div>
          <div>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Điện thoại:</strong> {user.phone}</p>
            <p><strong>Phòng ban:</strong> {user.department}</p>
            <p><strong>Trạng thái:</strong> {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</p>
            <p><strong>Lần đăng nhập cuối:</strong> {user.lastLogin}</p>
            <p><strong>Ngày tạo:</strong> {user.createdAt}</p>
          </div>
        </div>
      ),
    });
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    message.success('Đã xóa người dùng thành công!');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      setTimeout(() => {
        if (editingUser) {
          setUsers(users.map(user => 
            user.id === editingUser.id 
              ? { ...user, ...values }
              : user
          ));
          message.success('Cập nhật người dùng thành công!');
        } else {
          const newUser = {
            id: Date.now().toString(),
            ...values,
            lastLogin: 'Chưa đăng nhập',
            createdAt: new Date().toLocaleDateString(),
            avatar: null
          };
          setUsers([...users, newUser]);
          message.success('Thêm người dùng mới thành công!');
        }
        
        setModalVisible(false);
        setLoading(false);
        form.resetFields();
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.phone.includes(searchText)
  );

  // Thống kê
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const residentUsers = users.filter(u => u.role === 'resident').length;

  return (
    <div style={{ 
      padding: '24px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
            borderRadius: '12px',
            padding: '12px',
            marginRight: '16px'
          }}>
            <TeamOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, background: 'linear-gradient(135deg, #1890ff, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Quản Lý Tài Khoản
            </Title>
            <Text type="secondary">Quản lý tài khoản người dùng trong hệ thống</Text>
          </div>
        </div>
      </div>

      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Tổng Tài Khoản</span>}
              value={totalUsers}
              prefix={<UserOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>tài khoản</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Đang Hoạt Động</span>}
              value={activeUsers}
              prefix={<CheckCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>tài khoản</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Quản Trị Viên</span>}
              value={adminUsers}
              prefix={<CrownOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>người</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(100,100,100,0.8)' }}>Cư Dân</span>}
              value={residentUsers}
              prefix={<TeamOutlined style={{ color: '#666' }} />}
              valueStyle={{ color: '#666', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(100,100,100,0.8)', fontSize: '16px' }}>người</span>}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng quản lý */}
      <Card
        style={{
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
              borderRadius: '8px',
              padding: '8px',
              marginRight: '12px'
            }}>
              <UserOutlined style={{ color: 'white', fontSize: '16px' }} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
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
              style={{ minWidth: '300px' }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
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
          rowKey="id"
          pagination={{
            total: filteredUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} tài khoản`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal thêm/sửa */}
      <Modal
        title={editingUser ? '✏️ Sửa Tài Khoản' : '➕ Thêm Tài Khoản Mới'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={600}
        confirmLoading={loading}
        okText={editingUser ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            role: 'resident',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input placeholder="example@email.com" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input placeholder="0912345678" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Phòng ban"
              >
                <Input placeholder="Nhập phòng ban" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="admin">Quản trị viên</Option>
                  <Option value="manager">Quản lý</Option>
                  <Option value="staff">Nhân viên</Option>
                  <Option value="resident">Cư dân</Option>
                  <Option value="security">Bảo vệ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
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
    </div>
  );
};

export default UserManagement;
