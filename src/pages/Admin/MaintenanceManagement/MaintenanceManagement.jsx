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
  Typography,
  Avatar,
  Timeline,
  Progress,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const MaintenanceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Dữ liệu mẫu yêu cầu bảo trì
  const [maintenanceRequests, setMaintenanceRequests] = useState([
    {
      id: '1',
      title: 'Sửa chữa điều hòa',
      apartment: 'A101',
      resident: 'Nguyễn Văn An',
      phone: '0912345678',
      category: 'electrical',
      priority: 'high',
      status: 'pending',
      description: 'Điều hòa không lạnh, có tiếng kêu lạ',
      createdDate: '2024-12-15',
      scheduledDate: '2024-12-16',
      completedDate: null,
      technician: null,
      cost: null,
      images: []
    },
    {
      id: '2',
      title: 'Thông tắc bồn cầu',
      apartment: 'B205',
      resident: 'Trần Thị Bình',
      phone: '0923456789',
      category: 'plumbing',
      priority: 'urgent',
      status: 'in_progress',
      description: 'Bồn cầu bị tắc, nước tràn ra ngoài',
      createdDate: '2024-12-14',
      scheduledDate: '2024-12-15',
      completedDate: null,
      technician: 'Thợ Nguyễn',
      cost: 150000,
      images: []
    },
    {
      id: '3',
      title: 'Sửa khóa cửa',
      apartment: 'C304',
      resident: 'Lê Văn Cường',
      phone: '0934567890',
      category: 'security',
      priority: 'medium',
      status: 'completed',
      description: 'Khóa cửa bị kẹt, không mở được',
      createdDate: '2024-12-10',
      scheduledDate: '2024-12-12',
      completedDate: '2024-12-12',
      technician: 'Thợ Trần',
      cost: 200000,
      images: []
    }
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'blue';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'urgent': return 'Khẩn cấp';
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return priority;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'in_progress': return 'Đang xử lý';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'electrical': return 'Điện';
      case 'plumbing': return 'Nước';
      case 'security': return 'An ninh';
      case 'cleaning': return 'Vệ sinh';
      case 'furniture': return 'Nội thất';
      case 'other': return 'Khác';
      default: return category;
    }
  };

  const columns = [
    {
      title: 'Yêu cầu',
      key: 'requestInfo',
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: '14px' }}>{record.title}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            #{record.id} - {dayjs(record.createdDate).format('DD/MM/YYYY')}
          </Text>
        </div>
      ),
    },
    {
      title: 'Căn hộ',
      key: 'apartmentInfo',
      render: (_, record) => (
        <div>
          <Text strong>{record.apartment}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.resident}</Text>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue">{getCategoryText(category)}</Tag>
      ),
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {getPriorityText(priority)}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={getStatusColor(status)}
          icon={
            status === 'completed' ? <CheckCircleOutlined /> :
            status === 'in_progress' ? <ClockCircleOutlined /> :
            status === 'pending' ? <ExclamationCircleOutlined /> : null
          }
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thợ phụ trách',
      dataIndex: 'technician',
      key: 'technician',
      render: (technician) => technician || <Text type="secondary">Chưa phân công</Text>,
    },
    {
      title: 'Chi phí',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost) => cost ? `${cost.toLocaleString()} VNĐ` : <Text type="secondary">--</Text>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRequest(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    form.setFieldsValue({
      ...request,
      createdDate: dayjs(request.createdDate),
      scheduledDate: request.scheduledDate ? dayjs(request.scheduledDate) : null,
      completedDate: request.completedDate ? dayjs(request.completedDate) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    setMaintenanceRequests(maintenanceRequests.filter(req => req.id !== id));
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      setTimeout(() => {
        if (editingRequest) {
          setMaintenanceRequests(maintenanceRequests.map(req => 
            req.id === editingRequest.id 
              ? { 
                  ...req, 
                  ...values,
                  createdDate: values.createdDate.format('YYYY-MM-DD'),
                  scheduledDate: values.scheduledDate ? values.scheduledDate.format('YYYY-MM-DD') : null,
                  completedDate: values.completedDate ? values.completedDate.format('YYYY-MM-DD') : null,
                }
              : req
          ));
        } else {
          const newRequest = {
            id: Date.now().toString(),
            ...values,
            createdDate: values.createdDate.format('YYYY-MM-DD'),
            scheduledDate: values.scheduledDate ? values.scheduledDate.format('YYYY-MM-DD') : null,
            completedDate: values.completedDate ? values.completedDate.format('YYYY-MM-DD') : null,
          };
          setMaintenanceRequests([...maintenanceRequests, newRequest]);
        }
        
        setModalVisible(false);
        setLoading(false);
        form.resetFields();
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const filteredRequests = maintenanceRequests.filter(req =>
    req.title.toLowerCase().includes(searchText.toLowerCase()) ||
    req.apartment.toLowerCase().includes(searchText.toLowerCase()) ||
    req.resident.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalRequests = maintenanceRequests.length;
  const pendingRequests = maintenanceRequests.filter(req => req.status === 'pending').length;
  const inProgressRequests = maintenanceRequests.filter(req => req.status === 'in_progress').length;
  const completedRequests = maintenanceRequests.filter(req => req.status === 'completed').length;

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
            <ToolOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, background: 'linear-gradient(135deg, #1890ff, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Quản Lý Bảo Trì
            </Title>
            <Text type="secondary">Quản lý yêu cầu bảo trì và sửa chữa trong chung cư</Text>
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Tổng Yêu Cầu</span>}
              value={totalRequests}
              prefix={<ToolOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>yêu cầu</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Chờ Xử Lý</span>}
              value={pendingRequests}
              prefix={<ClockCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>yêu cầu</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Đang Xử Lý</span>}
              value={inProgressRequests}
              prefix={<ExclamationCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>yêu cầu</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Hoàn Thành</span>}
              value={completedRequests}
              prefix={<CheckCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>yêu cầu</span>}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng yêu cầu bảo trì */}
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
              <ToolOutlined style={{ color: 'white', fontSize: '16px' }} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
              Danh Sách Yêu Cầu Bảo Trì
            </span>
          </div>
        }
        extra={
          <Space>
            <Search
              placeholder="Tìm kiếm yêu cầu..."
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
              onClick={handleAdd}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
              }}
            >
              Thêm Yêu Cầu
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredRequests}
          rowKey="id"
          pagination={{
            total: filteredRequests.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} yêu cầu`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal thêm/sửa yêu cầu */}
      <Modal
        title={editingRequest ? '✏️ Sửa Yêu Cầu Bảo Trì' : '➕ Thêm Yêu Cầu Bảo Trì'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={800}
        confirmLoading={loading}
        okText={editingRequest ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            priority: 'medium',
            status: 'pending',
            createdDate: dayjs(),
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Tiêu đề yêu cầu"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
              >
                <Input placeholder="VD: Sửa chữa điều hòa" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="apartment"
                label="Căn hộ"
                rules={[{ required: true, message: 'Vui lòng nhập số căn hộ!' }]}
              >
                <Input placeholder="VD: A101" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="resident"
                label="Cư dân"
                rules={[{ required: true, message: 'Vui lòng nhập tên cư dân!' }]}
              >
                <Input placeholder="VD: Nguyễn Văn An" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input placeholder="VD: 0912345678" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Loại bảo trì"
                rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
              >
                <Select placeholder="Chọn loại">
                  <Option value="electrical">Điện</Option>
                  <Option value="plumbing">Nước</Option>
                  <Option value="security">An ninh</Option>
                  <Option value="cleaning">Vệ sinh</Option>
                  <Option value="furniture">Nội thất</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="Độ ưu tiên"
                rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}
              >
                <Select>
                  <Option value="urgent">Khẩn cấp</Option>
                  <Option value="high">Cao</Option>
                  <Option value="medium">Trung bình</Option>
                  <Option value="low">Thấp</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select>
                  <Option value="pending">Chờ xử lý</Option>
                  <Option value="in_progress">Đang xử lý</Option>
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="cancelled">Đã hủy</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả chi tiết"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Mô tả chi tiết về vấn đề cần bảo trì..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="createdDate"
                label="Ngày tạo"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="scheduledDate"
                label="Ngày hẹn"
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="completedDate"
                label="Ngày hoàn thành"
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="technician"
                label="Thợ phụ trách"
              >
                <Input placeholder="VD: Thợ Nguyễn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cost"
                label="Chi phí (VNĐ)"
              >
                <Input type="number" placeholder="VD: 150000" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default MaintenanceManagement;
