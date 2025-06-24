import React, { useState } from 'react';
import {
  Layout, Card, Button, Table, Input, Select, Tag, Space, Modal,
  Form, DatePicker, Typography, Badge, Avatar, Tooltip, Row, Col,
  Statistic, Divider, message
} from 'antd';
import {
  CalendarOutlined, NotificationOutlined, PlusOutlined, SearchOutlined,
  EditOutlined, DeleteOutlined, EyeOutlined, BellOutlined, 
  UserOutlined, CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const EventNotificationManagement = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Mock data
  const mockData = [
    {
      key: '1',
      title: 'Thông báo bảo trì thang máy',
      type: 'notification',
      status: 'active',
      priority: 'urgent',
      targetAudience: 'all',
      publishDate: '2024-01-15',
      author: 'Admin',
      views: 245,
      description: 'Thang máy sẽ được bảo trì vào cuối tuần'
    },
    {
      key: '2',
      title: 'Sự kiện giao lưu cư dân',
      type: 'event',
      status: 'upcoming',
      priority: 'medium',
      targetAudience: 'residents',
      publishDate: '2024-01-20',
      author: 'Admin',
      views: 89,
      eventDate: '2024-02-10',
      description: 'Tổ chức giao lưu cư dân tại sảnh tầng 1'
    },
    {
      key: '3',
      title: 'Thông báo thay đổi giờ làm việc',
      type: 'notification',
      status: 'expired',
      priority: 'low',
      targetAudience: 'all',
      publishDate: '2024-01-05',
      author: 'Manager',
      views: 156,
      description: 'Điều chỉnh giờ làm việc của ban quản lý'
    }
  ];

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa "${record.title}"?`,
      onOk() {
        message.success('Đã xóa thành công!');
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        message.success('Cập nhật thành công!');
      } else {
        message.success('Thêm mới thành công!');
      }
      setIsModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      active: { color: 'green', text: 'Đang hoạt động' },
      upcoming: { color: 'blue', text: 'Sắp diễn ra' },
      expired: { color: 'red', text: 'Đã hết hạn' },
      draft: { color: 'orange', text: 'Bản nháp' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPriorityTag = (priority) => {
    const priorityConfig = {
      urgent: { color: 'red', text: 'Khẩn cấp' },
      medium: { color: 'orange', text: 'Trung bình' },
      low: { color: 'green', text: 'Thấp' }
    };
    const config = priorityConfig[priority] || priorityConfig.low;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTypeTag = (type) => {
    const typeConfig = {
      event: { color: 'purple', text: 'Sự kiện', icon: <CalendarOutlined /> },
      notification: { color: 'blue', text: 'Thông báo', icon: <NotificationOutlined /> }
    };
    const config = typeConfig[type] || typeConfig.notification;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => getTypeTag(type),
      filters: [
        { text: 'Sự kiện', value: 'event' },
        { text: 'Thông báo', value: 'notification' },
      ],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Đang hoạt động', value: 'active' },
        { text: 'Sắp diễn ra', value: 'upcoming' },
        { text: 'Đã hết hạn', value: 'expired' },
      ],
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      render: (priority) => getPriorityTag(priority),
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: 120,
      sorter: true,
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
      width: 100,
      render: (author) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{author}</Text>
        </div>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      render: (views) => (
        <Badge count={views} showZero style={{ backgroundColor: '#52c41a' }} />
      ),
      sorter: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Content style={{ margin: '16px' }}>
        <div style={{ padding: 24, minHeight: 360 }}>
          {/* Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
                  <BellOutlined style={{ marginRight: '12px', color: '#7c3aed' }} />
                  Sự kiện & Thông báo
                </Title>
                <Text type="secondary">Quản lý sự kiện và thông báo cho cư dân</Text>
              </Col>
              <Col>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => {
                    setEditingRecord(null);
                    form.resetFields();
                    setIsModalVisible(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    height: '40px'
                  }}
                >
                  Thêm mới
                </Button>
              </Col>
            </Row>
          </div>

          {/* Statistics */}
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Statistic
                  title="Tổng số"
                  value={mockData.length}
                  prefix={<BellOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Statistic
                  title="Đang hoạt động"
                  value={mockData.filter(item => item.status === 'active').length}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Statistic
                  title="Sắp diễn ra"
                  value={mockData.filter(item => item.status === 'upcoming').length}
                  prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Statistic
                  title="Khẩn cấp"
                  value={mockData.filter(item => item.priority === 'urgent').length}
                  prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Card style={{ 
            borderRadius: '12px', 
            marginBottom: '20px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8} md={6}>
                <Input
                  placeholder="Tìm kiếm tiêu đề, nội dung..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </Col>
              <Col xs={24} sm={8} md={4}>
                <Select
                  placeholder="Trạng thái"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="active">Đang hoạt động</Option>
                  <Option value="upcoming">Sắp diễn ra</Option>
                  <Option value="expired">Đã hết hạn</Option>
                </Select>
              </Col>
              <Col xs={24} sm={8} md={4}>
                <Select
                  placeholder="Loại"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="event">Sự kiện</Option>
                  <Option value="notification">Thông báo</Option>
                </Select>
              </Col>
              {selectedRowKeys.length > 0 && (
                <Col xs={24} sm={24} md={10}>
                  <Space>
                    <Text>Đã chọn {selectedRowKeys.length} mục</Text>
                    <Button size="small" onClick={() => setSelectedRowKeys([])}>
                      Bỏ chọn
                    </Button>
                    <Button size="small" danger>
                      Xóa đã chọn
                    </Button>
                  </Space>
                </Col>
              )}
            </Row>
          </Card>

          {/* Table */}
          <Card style={{ 
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Table
              columns={columns}
              dataSource={filteredData}
              rowSelection={rowSelection}
              pagination={{
                total: filteredData.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} của ${total} mục`,
              }}
              scroll={{ x: 1200 }}
              style={{ borderRadius: '8px' }}
            />
          </Card>
        </div>
      </Content>

      {/* Modal thêm/sửa */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa' : 'Thêm mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
        style={{ borderRadius: '12px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '20px' }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="type"
                label="Loại"
                rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
              >
                <Select placeholder="Chọn loại">
                  <Option value="event">Sự kiện</Option>
                  <Option value="notification">Thông báo</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="priority"
                label="Độ ưu tiên"
                rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}
              >
                <Select placeholder="Chọn độ ưu tiên">
                  <Option value="urgent">Khẩn cấp</Option>
                  <Option value="medium">Trung bình</Option>
                  <Option value="low">Thấp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="active">Đang hoạt động</Option>
                  <Option value="upcoming">Sắp diễn ra</Option>
                  <Option value="draft">Bản nháp</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="targetAudience"
                label="Đối tượng"
                rules={[{ required: true, message: 'Vui lòng chọn đối tượng!' }]}
              >
                <Select placeholder="Chọn đối tượng">
                  <Option value="all">Tất cả</Option>
                  <Option value="residents">Cư dân</Option>
                  <Option value="staff">Nhân viên</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                {editingRecord ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default EventNotificationManagement;
