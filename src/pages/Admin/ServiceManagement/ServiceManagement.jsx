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
  Row,
  Col,
  Statistic,
  Popconfirm,
  message,
  Typography,
  Switch,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  WifiOutlined,
  CarOutlined,
  ToolOutlined,
  AppstoreOutlined,
  SecurityScanOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const ServiceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Dữ liệu mẫu dịch vụ
  const [services, setServices] = useState([
    {
      id: '1',
      name: 'Điện',
      type: 'utility',
      price: 3500,
      unit: 'kWh',
      status: 'active',
      description: 'Tiền điện sinh hoạt',
      provider: 'EVN',
      icon: 'ThunderboltOutlined',
      color: '#faad14',
      mandatory: true,
    },
    {
      id: '2',
      name: 'Nước',
      type: 'utility',
      price: 25000,
      unit: 'm³',
      status: 'active',
      description: 'Tiền nước sinh hoạt',
      provider: 'Công ty nước sạch',
      icon: 'WaterOutlined',
      color: '#1890ff',
      mandatory: true,
    },
    {
      id: '3',
      name: 'Internet',
      type: 'service',
      price: 200000,
      unit: 'tháng',
      status: 'active',
      description: 'Dịch vụ internet cáp quang',
      provider: 'FPT Telecom',
      icon: 'WifiOutlined',
      color: '#52c41a',
      mandatory: false,
    },
    {
      id: '4',
      name: 'Quản lý',
      type: 'management',
      price: 15000,
      unit: 'm²',
      status: 'active',
      description: 'Phí quản lý chung cư',
      provider: 'Ban quản lý',
      icon: 'ToolOutlined',
      color: '#722ed1',
      mandatory: true,
    },
    {
      id: '5',
      name: 'Gửi xe máy',
      type: 'parking',
      price: 100000,
      unit: 'tháng',
      status: 'active',
      description: 'Phí gửi xe máy',
      provider: 'Ban quản lý',
      icon: 'CarOutlined',
      color: '#fa8c16',
      mandatory: false,
    },
    {
      id: '6',
      name: 'Vệ sinh',
      type: 'service',
      price: 50000,
      unit: 'lần',
      status: 'inactive',
      description: 'Dịch vụ vệ sinh căn hộ',
      provider: 'Công ty vệ sinh',
      icon: 'AppstoreOutlined',
      color: '#13c2c2',
      mandatory: false,
    },
    {
      id: '7',
      name: 'Bảo vệ',
      type: 'security',
      price: 80000,
      unit: 'tháng',
      status: 'active',
      description: 'Dịch vụ bảo vệ 24/7',
      provider: 'Công ty bảo vệ',
      icon: 'SecurityScanOutlined',
      color: '#f5222d',
      mandatory: true,
    },
  ]);  const getServiceIcon = (iconName) => {
    const icons = {
      ThunderboltOutlined: <ThunderboltOutlined />,
      WifiOutlined: <WifiOutlined />,
      CarOutlined: <CarOutlined />,
      ToolOutlined: <ToolOutlined />,
      AppstoreOutlined: <AppstoreOutlined />,
      SecurityScanOutlined: <SecurityScanOutlined />,
    };
    return icons[iconName] || <ToolOutlined />;
  };

  const getTypeText = (type) => {
    const types = {
      utility: 'Tiện ích',
      service: 'Dịch vụ',
      management: 'Quản lý',
      parking: 'Gửi xe',
      security: 'Bảo vệ',
    };
    return types[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      utility: 'blue',
      service: 'green',
      management: 'purple',
      parking: 'orange',
      security: 'red',
    };
    return colors[type] || 'default';
  };

  const columns = [
    {
      title: 'Dịch vụ',
      key: 'service',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            marginRight: '12px', 
            fontSize: '24px', 
            color: record.color 
          }}>
            {getServiceIcon(record.icon)}
          </div>
          <div>
            <Text strong style={{ fontSize: '16px' }}>{record.name}</Text>
            <br />
            <Text type="secondary">{record.provider}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Tiện ích', value: 'utility' },
        { text: 'Dịch vụ', value: 'service' },
        { text: 'Quản lý', value: 'management' },
        { text: 'Gửi xe', value: 'parking' },
        { text: 'Bảo vệ', value: 'security' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => (
        <Tag color={getTypeColor(type)}>
          {getTypeText(type)}
        </Tag>
      ),
    },
    {
      title: 'Giá',
      key: 'pricing',
      align: 'right',
      sorter: (a, b) => a.price - b.price,
      render: (_, record) => (
        <div>
          <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
            {record.price.toLocaleString()}
          </Text>
          <br />
          <Text type="secondary">VNĐ/{record.unit}</Text>
        </div>
      ),
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'mandatory',
      key: 'mandatory',
      align: 'center',
      filters: [
        { text: 'Bắt buộc', value: true },
        { text: 'Tùy chọn', value: false },
      ],
      onFilter: (value, record) => record.mandatory === value,
      render: (mandatory) => (
        <Tag color={mandatory ? 'red' : 'blue'}>
          {mandatory ? 'Bắt buộc' : 'Tùy chọn'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Tạm dừng', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewService(record)}
          >
            Xem
          </Button>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditService(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa dịch vụ này?"
            onConfirm={() => handleDeleteService(record.id)}
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

  const handleAddService = () => {
    setEditingService(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    form.setFieldsValue(service);
    setModalVisible(true);
  };

  const handleViewService = (service) => {
    Modal.info({
      title: `Chi tiết dịch vụ: ${service.name}`,
      width: 600,
      content: (
        <div style={{ marginTop: '16px' }}>
          <p><strong>Nhà cung cấp:</strong> {service.provider}</p>
          <p><strong>Loại:</strong> {getTypeText(service.type)}</p>
          <p><strong>Giá:</strong> {service.price.toLocaleString()} VNĐ/{service.unit}</p>
          <p><strong>Trạng thái:</strong> {service.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}</p>
          <p><strong>Bắt buộc:</strong> {service.mandatory ? 'Có' : 'Không'}</p>
          <p><strong>Mô tả:</strong> {service.description}</p>
        </div>
      ),
    });
  };

  const handleDeleteService = (id) => {
    setServices(services.filter(s => s.id !== id));
    message.success('Đã xóa dịch vụ thành công!');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      setTimeout(() => {
        if (editingService) {
          setServices(services.map(s => 
            s.id === editingService.id ? { ...s, ...values } : s
          ));
          message.success('Cập nhật dịch vụ thành công!');
        } else {
          const newService = {
            id: Date.now().toString(),
            ...values,
            icon: 'ToolOutlined',
            color: '#1890ff',
          };
          setServices([...services, newService]);
          message.success('Thêm dịch vụ mới thành công!');
        }
        
        setModalVisible(false);
        setLoading(false);
        form.resetFields();
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchText.toLowerCase()) ||
    service.provider.toLowerCase().includes(searchText.toLowerCase())
  );

  const activeServices = services.filter(s => s.status === 'active').length;
  const mandatoryServices = services.filter(s => s.mandatory).length;
  const totalRevenue = services
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.price, 0);
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
            <AppstoreOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, background: 'linear-gradient(135deg, #1890ff, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Quản Lý Dịch Vụ
            </Title>
            <Text type="secondary">Quản lý các dịch vụ tiện ích trong chung cư</Text>
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Tổng Dịch Vụ</span>}
              value={services.length}
              prefix={<AppstoreOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>dịch vụ</span>}
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
              value={activeServices}
              prefix={<ToolOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>dịch vụ</span>}
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Dịch Vụ Bắt Buộc</span>}
              value={mandatoryServices}
              prefix={<SecurityScanOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>dịch vụ</span>}
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
              title={<span style={{ color: 'rgba(100,100,100,0.8)' }}>Doanh Thu Ước Tính</span>}
              value={totalRevenue}
              prefix={<span style={{ color: '#666' }}>₫</span>}              valueStyle={{ color: '#666', fontSize: '28px', fontWeight: 'bold' }}
              formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              suffix={<span style={{ color: 'rgba(100,100,100,0.8)', fontSize: '16px' }}>VNĐ/tháng</span>}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng quản lý dịch vụ */}
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
              <AppstoreOutlined style={{ color: 'white', fontSize: '16px' }} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
              Danh Sách Dịch Vụ
            </span>
          </div>
        }
        extra={          <Space>
            <Search
              placeholder="Tìm kiếm dịch vụ..."
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
              onClick={handleAddService}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
              }}
            >
              Thêm Dịch Vụ
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredServices}
          rowKey="id"
          pagination={{
            total: filteredServices.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} dịch vụ`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal thêm/sửa dịch vụ */}
      <Modal
        title={editingService ? '✏️ Sửa Dịch Vụ' : '➕ Thêm Dịch Vụ Mới'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={700}
        confirmLoading={loading}
        okText={editingService ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            mandatory: false,
            type: 'service',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên dịch vụ"
                rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
              >
                <Input placeholder="VD: Internet, Điện, Nước..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="provider"
                label="Nhà cung cấp"
                rules={[{ required: true, message: 'Vui lòng nhập nhà cung cấp!' }]}
              >
                <Input placeholder="VD: FPT, EVN, Công ty..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Loại dịch vụ"
                rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
              >
                <Select placeholder="Chọn loại dịch vụ">
                  <Option value="utility">Tiện ích</Option>
                  <Option value="service">Dịch vụ</Option>
                  <Option value="management">Quản lý</Option>
                  <Option value="parking">Gửi xe</Option>
                  <Option value="security">Bảo vệ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="100000"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unit"
                label="Đơn vị"
                rules={[{ required: true, message: 'Vui lòng nhập đơn vị!' }]}
              >
                <Select placeholder="Chọn đơn vị">
                  <Option value="tháng">tháng</Option>
                  <Option value="kWh">kWh</Option>
                  <Option value="m³">m³</Option>
                  <Option value="m²">m²</Option>
                  <Option value="lần">lần</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Tạm dừng</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mandatory"
                label="Dịch vụ bắt buộc"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Mô tả chi tiết về dịch vụ..." 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
