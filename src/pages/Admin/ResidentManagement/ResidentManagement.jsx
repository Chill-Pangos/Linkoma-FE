import React, { useState } from 'react';
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
} from 'antd';
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
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const ResidentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [viewingResident, setViewingResident] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Dữ liệu mẫu cư dân
  const [residents, setResidents] = useState([
    {
      id: '1',
      name: 'Nguyễn Văn An',
      phone: '0912345678',
      email: 'nguyenvanan@email.com',
      apartment: 'A101',
      idCard: '123456789012',
      moveInDate: '2023-01-15',
      status: 'active',
      avatar: null,
      emergencyContact: 'Nguyễn Thị Bình - 0987654321',
      occupation: 'Kỹ sư phần mềm',
      familyMembers: 3,
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      phone: '0923456789',
      email: 'tranthib@email.com',
      apartment: 'B205',
      idCard: '123456789013',
      moveInDate: '2023-03-20',
      status: 'active',
      avatar: null,
      emergencyContact: 'Trần Văn Cường - 0976543210',
      occupation: 'Giáo viên',
      familyMembers: 4,
    },
    {
      id: '3',
      name: 'Lê Văn Cường',
      phone: '0934567890',
      email: 'levanc@email.com',
      apartment: 'C304',
      idCard: '123456789014',
      moveInDate: '2023-02-10',
      status: 'inactive',
      avatar: null,
      emergencyContact: 'Lê Thị Dung - 0965432109',
      occupation: 'Bác sĩ',
      familyMembers: 2,
    },
    {
      id: '4',
      name: 'Phạm Thị Dung',
      phone: '0945678901',
      email: 'phamthid@email.com',
      apartment: 'A203',
      idCard: '123456789015',
      moveInDate: '2023-04-05',
      status: 'active',
      avatar: null,
      emergencyContact: 'Phạm Văn Em - 0954321098',
      occupation: 'Kinh doanh',
      familyMembers: 5,
    },
    {
      id: '5',
      name: 'Hoàng Văn Em',
      phone: '0956789012',
      email: 'hoangvane@email.com',
      apartment: 'B102',
      idCard: '123456789016',
      moveInDate: '2023-05-12',
      status: 'active',
      avatar: null,
      emergencyContact: 'Hoàng Thị Phương - 0943210987',
      occupation: 'Kế toán',
      familyMembers: 1,
    },
  ]);

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 70,
      render: (avatar, record) => (
        <Avatar 
          size={40} 
          icon={<UserOutlined />}
          src={avatar}
          style={{ backgroundColor: '#1890ff' }}
        >
          {record.name.charAt(0)}
        </Avatar>
      ),
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.id}
          </Text>
        </div>
      ),
    },
    {
      title: 'Căn hộ',
      dataIndex: 'apartment',
      key: 'apartment',
      render: (text) => (
        <Tag color="blue" icon={<HomeOutlined />}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <PhoneOutlined style={{ marginRight: '4px', color: '#52c41a' }} />
            <Text copyable={{ text: record.phone }}>{record.phone}</Text>
          </div>
          <div>
            <MailOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
            <Text copyable={{ text: record.email }} style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày chuyển vào',
      dataIndex: 'moveInDate',
      key: 'moveInDate',
      sorter: (a, b) => new Date(a.moveInDate) - new Date(b.moveInDate),
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thành viên',
      dataIndex: 'familyMembers',
      key: 'familyMembers',
      align: 'center',
      render: (count) => (
        <Tag color="purple">
          <UserOutlined /> {count} người
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đang ở', value: 'active' },
        { text: 'Đã chuyển đi', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang ở' : 'Đã chuyển đi'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
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
            onConfirm={() => handleDeleteResident(record.id)}
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
      ...resident,
      moveInDate: dayjs(resident.moveInDate),
    });
    setModalVisible(true);
  };

  const handleViewResident = (resident) => {
    setViewingResident(resident);
    setViewModalVisible(true);
  };

  const handleDeleteResident = (id) => {
    setResidents(residents.filter(r => r.id !== id));
    message.success('Đã xóa cư dân thành công!');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        if (editingResident) {
          // Update existing resident
          setResidents(residents.map(r => 
            r.id === editingResident.id 
              ? { 
                  ...r, 
                  ...values, 
                  moveInDate: values.moveInDate.format('YYYY-MM-DD') 
                }
              : r
          ));
          message.success('Cập nhật thông tin cư dân thành công!');
        } else {
          // Add new resident
          const newResident = {
            id: Date.now().toString(),
            ...values,
            moveInDate: values.moveInDate.format('YYYY-MM-DD'),
            avatar: null,
          };
          setResidents([...residents, newResident]);
          message.success('Thêm cư dân mới thành công!');
        }
        
        setModalVisible(false);
        setLoading(false);
        form.resetFields();
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchText.toLowerCase()) ||
    resident.phone.includes(searchText) ||
    resident.apartment.toLowerCase().includes(searchText.toLowerCase())
  );

  const activeResidents = residents.filter(r => r.status === 'active').length;
  const totalFamilyMembers = residents.reduce((sum, r) => sum + r.familyMembers, 0);

  return (
    <div style={{ 
      padding: '24px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header với gradient */}
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
              Quản Lý Cư Dân
            </Title>
            <Text type="secondary">Quản lý thông tin và trạng thái cư dân chung cư</Text>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan với gradient cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Tổng Cư Dân</span>}
              value={residents.length}
              prefix={<UserOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>người</span>}
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Đang Sinh Sống</span>}
              value={activeResidents}
              prefix={<CheckCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>căn hộ</span>}
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Thành Viên Gia Đình</span>}
              value={totalFamilyMembers}
              prefix={<TeamOutlined style={{ color: 'white' }} />}
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
              title={<span style={{ color: 'rgba(100,100,100,0.8)' }}>Tỷ Lệ Lấp Đầy</span>}
              value={Math.round((activeResidents / 100) * 100)}
              suffix={<span style={{ color: 'rgba(100,100,100,0.8)', fontSize: '16px' }}>%</span>}
              prefix={<HomeOutlined style={{ color: '#666' }} />}
              valueStyle={{ color: '#666', fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng quản lý cư dân */}
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
              style={{ minWidth: '300px' }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddResident}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
              }}
            >
              Thêm Cư Dân
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredResidents}
          rowKey="id"
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
        title={editingResident ? '✏️ Sửa Thông Tin Cư Dân' : '➕ Thêm Cư Dân Mới'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={800}
        confirmLoading={loading}
        okText={editingResident ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            familyMembers: 1,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="apartment"
                label="Căn hộ"
                rules={[{ required: true, message: 'Vui lòng chọn căn hộ!' }]}
              >
                <Select placeholder="Chọn căn hộ">
                  <Option value="A101">A101</Option>
                  <Option value="A102">A102</Option>
                  <Option value="A103">A103</Option>
                  <Option value="B201">B201</Option>
                  <Option value="B202">B202</Option>
                  <Option value="B203">B203</Option>
                  <Option value="C301">C301</Option>
                  <Option value="C302">C302</Option>
                  <Option value="C303">C303</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="idCard"
                label="CCCD/CMND"
                rules={[
                  { required: true, message: 'Vui lòng nhập số CCCD/CMND!' },
                  { pattern: /^[0-9]{9,12}$/, message: 'Số CCCD/CMND không hợp lệ!' }
                ]}
              >
                <Input placeholder="Nhập số CCCD/CMND" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="moveInDate"
                label="Ngày chuyển vào"
                rules={[{ required: true, message: 'Vui lòng chọn ngày chuyển vào!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày chuyển vào"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="occupation"
                label="Nghề nghiệp"
                rules={[{ required: true, message: 'Vui lòng nhập nghề nghiệp!' }]}
              >
                <Input placeholder="Nhập nghề nghiệp" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="familyMembers"
                label="Số thành viên gia đình"
                rules={[{ required: true, message: 'Vui lòng nhập số thành viên!' }]}
              >
                <Select placeholder="Chọn số thành viên">
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <Option key={num} value={num}>{num} người</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="emergencyContact"
            label="Liên hệ khẩn cấp"
            rules={[{ required: true, message: 'Vui lòng nhập thông tin liên hệ khẩn cấp!' }]}
          >
            <Input placeholder="Họ tên - Số điện thoại" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value="active">Đang sinh sống</Option>
              <Option value="inactive">Đã chuyển đi</Option>
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
        {viewingResident && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
                {viewingResident.name.charAt(0)}
              </Avatar>
              <Title level={4} style={{ marginTop: '12px', marginBottom: '4px' }}>
                {viewingResident.name}
              </Title>
              <Tag color={viewingResident.status === 'active' ? 'green' : 'red'}>
                {viewingResident.status === 'active' ? 'Đang sinh sống' : 'Đã chuyển đi'}
              </Tag>
            </div>

            <Divider />

            <Row gutter={[16, 12]}>
              <Col span={12}>
                <Text strong>📱 Điện thoại:</Text>
                <br />
                <Text copyable>{viewingResident.phone}</Text>
              </Col>
              <Col span={12}>
                <Text strong>📧 Email:</Text>
                <br />
                <Text copyable>{viewingResident.email}</Text>
              </Col>
              <Col span={12}>
                <Text strong>🏠 Căn hộ:</Text>
                <br />
                <Tag color="blue">{viewingResident.apartment}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>🆔 CCCD/CMND:</Text>
                <br />
                <Text>{viewingResident.idCard}</Text>
              </Col>
              <Col span={12}>
                <Text strong>📅 Ngày chuyển vào:</Text>
                <br />
                <Text>{dayjs(viewingResident.moveInDate).format('DD/MM/YYYY')}</Text>
              </Col>
              <Col span={12}>
                <Text strong>💼 Nghề nghiệp:</Text>
                <br />
                <Text>{viewingResident.occupation}</Text>
              </Col>
              <Col span={12}>
                <Text strong>👨‍👩‍👧‍👦 Thành viên gia đình:</Text>
                <br />
                <Text>{viewingResident.familyMembers} người</Text>
              </Col>
              <Col span={12}>
                <Text strong>🚨 Liên hệ khẩn cấp:</Text>
                <br />
                <Text>{viewingResident.emergencyContact}</Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResidentManagement;
