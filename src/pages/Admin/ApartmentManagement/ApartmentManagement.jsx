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
  Progress,
  Descriptions,
  Badge,
  Tooltip,
  DatePicker,
  Divider,
} from 'antd';
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
  SettingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const ApartmentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [viewingApartment, setViewingApartment] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Dữ liệu mẫu căn hộ
  const [apartments, setApartments] = useState([
    {
      id: '1',
      number: 'A101',
      floor: 1,
      block: 'A',
      area: 65,
      bedrooms: 2,
      bathrooms: 2,
      rent: 8500000,
      status: 'occupied',
      tenant: 'Nguyễn Văn An',
      tenantPhone: '0912345678',
      moveInDate: '2023-01-15',
      contractEndDate: '2024-01-15',
      lastMaintenanceDate: '2023-12-10',
    },
    {
      id: '2',
      number: 'B205',
      floor: 2,
      block: 'B',
      area: 75,
      bedrooms: 3,
      bathrooms: 2,
      rent: 10500000,
      status: 'available',
      tenant: null,
      tenantPhone: null,
      moveInDate: null,
      contractEndDate: null,
      lastMaintenanceDate: '2023-11-20',
    },
    {
      id: '3',
      number: 'C304',
      floor: 3,
      block: 'C',
      area: 85,
      bedrooms: 3,
      bathrooms: 3,
      rent: 12000000,
      status: 'maintenance',
      tenant: null,
      tenantPhone: null,
      moveInDate: null,
      contractEndDate: null,
      lastMaintenanceDate: '2023-12-15',
    },
    {
      id: '4',
      number: 'A203',
      floor: 2,
      block: 'A',
      area: 65,
      bedrooms: 2,
      bathrooms: 2,
      rent: 8500000,
      status: 'occupied',
      tenant: 'Trần Thị Bình',
      tenantPhone: '0923456789',
      moveInDate: '2023-03-20',
      contractEndDate: '2024-03-20',
      lastMaintenanceDate: '2023-10-05',
    },
  ]);

  // Tính toán thống kê
  const totalApartments = apartments.length;
  const occupiedApartments = apartments.filter(apt => apt.status === 'occupied').length;
  const availableApartments = apartments.filter(apt => apt.status === 'available').length;
  const maintenanceApartments = apartments.filter(apt => apt.status === 'maintenance').length;
  const occupancyRate = Math.round((occupiedApartments / totalApartments) * 100);

  // Lọc danh sách căn hộ theo từ khóa tìm kiếm
  const filteredApartments = apartments.filter(apartment =>
    apartment.number.toLowerCase().includes(searchText.toLowerCase()) ||
    apartment.block.toLowerCase().includes(searchText.toLowerCase()) ||
    (apartment.tenant && apartment.tenant.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Xử lý thêm căn hộ
  const handleAddApartment = () => {
    setEditingApartment(null);
    form.resetFields();
    setModalVisible(true);
  };
  // Xử lý sửa căn hộ
  const handleEditApartment = (apartment) => {
    setEditingApartment(apartment);
    form.setFieldsValue({
      ...apartment,
      moveInDate: apartment.moveInDate ? dayjs(apartment.moveInDate) : null,
      contractEndDate: apartment.contractEndDate ? dayjs(apartment.contractEndDate) : null,
    });
    setModalVisible(true);
  };

  // Xử lý xem chi tiết căn hộ
  const handleViewApartment = (apartment) => {
    setViewingApartment(apartment);
    setViewModalVisible(true);
  };

  // Xử lý xóa căn hộ
  const handleDeleteApartment = (id) => {
    setApartments(apartments.filter(apt => apt.id !== id));
    message.success('Đã xóa căn hộ thành công!');
  };

  // Xử lý lưu căn hộ
  const handleSaveApartment = async (values) => {
    try {
      setLoading(true);
      
      if (editingApartment) {
        // Cập nhật căn hộ
        setApartments(apartments.map(apt => 
          apt.id === editingApartment.id 
            ? { 
                ...apt, 
                ...values,
                moveInDate: values.moveInDate ? values.moveInDate.format('YYYY-MM-DD') : null,
                contractEndDate: values.contractEndDate ? values.contractEndDate.format('YYYY-MM-DD') : null,
              }
            : apt
        ));
        message.success('Đã cập nhật thông tin căn hộ thành công!');
      } else {
        // Thêm căn hộ mới
        const newApartment = {
          id: Date.now().toString(),
          ...values,
          moveInDate: values.moveInDate ? values.moveInDate.format('YYYY-MM-DD') : null,
          contractEndDate: values.contractEndDate ? values.contractEndDate.format('YYYY-MM-DD') : null,
        };
        setApartments([...apartments, newApartment]);
        message.success('Đã thêm căn hộ mới thành công!');
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Căn hộ',
      dataIndex: 'number',
      key: 'number',
      sorter: (a, b) => a.number.localeCompare(b.number),
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '16px' }}>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Tầng {record.floor} - Block {record.block}
          </Text>
        </div>
      ),
    },
    {
      title: 'Diện tích',
      dataIndex: 'area',
      key: 'area',
      sorter: (a, b) => a.area - b.area,
      render: (area, record) => (
        <div>
          <Text strong>{area}m²</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.bedrooms}PN - {record.bathrooms}WC
          </Text>
        </div>
      ),
    },
    {
      title: 'Giá thuê',
      dataIndex: 'rent',
      key: 'rent',
      sorter: (a, b) => a.rent - b.rent,
      render: (rent) => (
        <Text strong style={{ color: '#52c41a' }}>
          {rent.toLocaleString('vi-VN')} đ/tháng
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đã thuê', value: 'occupied' },
        { text: 'Còn trống', value: 'available' },
        { text: 'Bảo trì', value: 'maintenance' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const statusConfig = {
          occupied: { color: 'green', text: 'Đã thuê', icon: <CheckCircleOutlined /> },
          available: { color: 'blue', text: 'Còn trống', icon: <HomeOutlined /> },
          maintenance: { color: 'orange', text: 'Bảo trì', icon: <ToolOutlined /> },
        };
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Người thuê',
      key: 'tenant',
      render: (_, record) => {
        if (!record.tenant) {
          return <Text type="secondary">Chưa có</Text>;
        }
        return (
          <div>
            <Text strong>{record.tenant}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.tenantPhone}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewApartment(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditApartment(record)}
              style={{ color: '#faad14' }}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa căn hộ này?"
            onConfirm={() => handleDeleteApartment(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                style={{ color: '#ff4d4f' }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
            <HomeOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, background: 'linear-gradient(135deg, #1890ff, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Quản Lý Căn Hộ
            </Title>
            <Text type="secondary">Quản lý thông tin và trạng thái các căn hộ trong chung cư</Text>
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Tổng Căn Hộ</span>}
              value={totalApartments}
              prefix={<HomeOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>căn</span>}
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Đã Thuê</span>}
              value={occupiedApartments}
              prefix={<CheckCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>căn</span>}
            />
            <Progress 
              percent={occupancyRate} 
              size="small" 
              strokeColor="white"
              trailColor="rgba(255,255,255,0.3)"
              style={{ marginTop: '8px' }}
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Còn Trống</span>}
              value={availableApartments}
              prefix={<HomeOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>căn</span>}
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
              title={<span style={{ color: 'rgba(100,100,100,0.8)' }}>Đang Bảo Trì</span>}
              value={maintenanceApartments}
              prefix={<ToolOutlined style={{ color: '#666' }} />}
              valueStyle={{ color: '#666', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(100,100,100,0.8)', fontSize: '16px' }}>căn</span>}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng quản lý căn hộ */}
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
              <HomeOutlined style={{ color: 'white', fontSize: '16px' }} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
              Danh Sách Căn Hộ
            </span>
          </div>
        }
        extra={
          <Space>
            <Search
              placeholder="Tìm kiếm căn hộ..."
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
              onClick={handleAddApartment}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
              }}
            >
              Thêm Căn Hộ
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredApartments}
          rowKey="id"
          pagination={{
            total: filteredApartments.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} căn hộ`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal thêm/sửa căn hộ */}
      <Modal
        title={editingApartment ? '✏️ Sửa Thông Tin Căn Hộ' : '➕ Thêm Căn Hộ Mới'}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={800}
        confirmLoading={loading}
        okText={editingApartment ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveApartment}
          initialValues={{
            status: 'available',
            bedrooms: 2,
            bathrooms: 2,
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="number"
                label="Số căn hộ"
                rules={[{ required: true, message: 'Vui lòng nhập số căn hộ!' }]}
              >
                <Input prefix={<HomeOutlined />} placeholder="Ví dụ: A101" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="block"
                label="Block"
                rules={[{ required: true, message: 'Vui lòng chọn block!' }]}
              >
                <Select placeholder="Chọn block">
                  <Option value="A">Block A</Option>
                  <Option value="B">Block B</Option>
                  <Option value="C">Block C</Option>
                  <Option value="D">Block D</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="floor"
                label="Tầng"
                rules={[{ required: true, message: 'Vui lòng nhập tầng!' }]}
              >
                <Select placeholder="Chọn tầng">
                  {[1,2,3,4,5,6,7,8,9,10].map(floor => (
                    <Option key={floor} value={floor}>Tầng {floor}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="area"
                label="Diện tích (m²)"
                rules={[{ required: true, message: 'Vui lòng nhập diện tích!' }]}
              >
                <Input type="number" placeholder="Ví dụ: 65" suffix="m²" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="bedrooms"
                label="Phòng ngủ"
                rules={[{ required: true, message: 'Vui lòng chọn số phòng ngủ!' }]}
              >
                <Select>
                  {[1,2,3,4,5].map(num => (
                    <Option key={num} value={num}>{num} phòng</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="bathrooms"
                label="Phòng tắm"
                rules={[{ required: true, message: 'Vui lòng chọn số phòng tắm!' }]}
              >
                <Select>
                  {[1,2,3,4].map(num => (
                    <Option key={num} value={num}>{num} phòng</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rent"
                label="Giá thuê (VNĐ/tháng)"
                rules={[{ required: true, message: 'Vui lòng nhập giá thuê!' }]}
              >
                <Input
                  type="number"
                  prefix={<DollarOutlined />}
                  placeholder="Ví dụ: 8500000"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select>
                  <Option value="available">Còn trống</Option>
                  <Option value="occupied">Đã thuê</Option>
                  <Option value="maintenance">Đang bảo trì</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
          >
            {({ getFieldValue }) => {
              return getFieldValue('status') === 'occupied' ? (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="tenant"
                        label="Tên người thuê"
                        rules={[{ required: true, message: 'Vui lòng nhập tên người thuê!' }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Nhập tên người thuê" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="tenantPhone"
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
                    <Col span={12}>
                      <Form.Item
                        name="contractEndDate"
                        label="Ngày kết thúc hợp đồng"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                      >
                        <DatePicker 
                          style={{ width: '100%' }} 
                          format="DD/MM/YYYY"
                          placeholder="Chọn ngày kết thúc"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : null;
            }}
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết căn hộ */}
      <Modal
        title="🏠 Chi Tiết Căn Hộ"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {viewingApartment && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                fontSize: '48px',
                background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {viewingApartment.number}
              </div>
              <Tag 
                color={
                  viewingApartment.status === 'occupied' ? 'green' : 
                  viewingApartment.status === 'available' ? 'blue' : 'orange'
                }
                style={{ fontSize: '14px', padding: '4px 12px' }}
              >
                {viewingApartment.status === 'occupied' ? 'Đã thuê' : 
                 viewingApartment.status === 'available' ? 'Còn trống' : 'Bảo trì'}
              </Tag>
            </div>

            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="🏗️ Block" span={1}>
                Block {viewingApartment.block}
              </Descriptions.Item>
              <Descriptions.Item label="🏢 Tầng" span={1}>
                Tầng {viewingApartment.floor}
              </Descriptions.Item>
              <Descriptions.Item label="📐 Diện tích" span={1}>
                {viewingApartment.area}m²
              </Descriptions.Item>
              <Descriptions.Item label="🛏️ Phòng ngủ" span={1}>
                {viewingApartment.bedrooms} phòng
              </Descriptions.Item>
              <Descriptions.Item label="🚿 Phòng tắm" span={1}>
                {viewingApartment.bathrooms} phòng
              </Descriptions.Item>
              <Descriptions.Item label="💰 Giá thuê" span={1}>
                <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                  {viewingApartment.rent.toLocaleString('vi-VN')} đ/tháng
                </Text>
              </Descriptions.Item>
            </Descriptions>

            {viewingApartment.status === 'occupied' && (
              <>
                <Divider>Thông tin người thuê</Divider>
                <Descriptions bordered column={2} size="middle">
                  <Descriptions.Item label="👤 Tên người thuê" span={2}>
                    <Text strong>{viewingApartment.tenant}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="📱 Điện thoại" span={1}>
                    <Text copyable>{viewingApartment.tenantPhone}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="📅 Ngày chuyển vào" span={1}>
                    {dayjs(viewingApartment.moveInDate).format('DD/MM/YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="📅 Kết thúc hợp đồng" span={2}>
                    <Badge 
                      status={
                        dayjs(viewingApartment.contractEndDate).isBefore(dayjs().add(30, 'day')) 
                          ? 'warning' : 'success'
                      }
                      text={dayjs(viewingApartment.contractEndDate).format('DD/MM/YYYY')}
                    />
                    {dayjs(viewingApartment.contractEndDate).isBefore(dayjs().add(30, 'day')) && (
                      <Text type="warning" style={{ marginLeft: '8px' }}>
                        (Sắp hết hạn)
                      </Text>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}

            <Divider>Thông tin bảo trì</Divider>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="🔧 Bảo trì lần cuối">
                {dayjs(viewingApartment.lastMaintenanceDate).format('DD/MM/YYYY')}
                <Text type="secondary" style={{ marginLeft: '8px' }}>
                  ({dayjs().diff(dayjs(viewingApartment.lastMaintenanceDate), 'day')} ngày trước)
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApartmentManagement;