import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
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
  Typography,
  Badge,
  Tooltip,
  Popconfirm,
  message,
  Avatar,
  Divider,
  Empty,
} from 'antd';
import {
  ToolOutlined,
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CommentOutlined,
  CalendarOutlined,
  PlusOutlined,
  ReloadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { maintenanceService } from "../../../services";
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Search, TextArea } = Input;
const { Option } = Select;

const MaintenanceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [replyingRequest, setReplyingRequest] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [form] = Form.useForm();
  const [replyForm] = Form.useForm();
  const [createForm] = Form.useForm();

  // State cho dữ liệu API
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });

  // Load dữ liệu ban đầu
  useEffect(() => {
    const initData = async () => {
      await Promise.all([
        loadMaintenanceRequests(),
        loadStats(),
      ]);
    };
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load lại dữ liệu khi filter thay đổi
  useEffect(() => {
    loadMaintenanceRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, pagination.page]);

  /**
   * Load danh sách maintenance requests từ API
   */
  const loadMaintenanceRequests = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Thêm filter nếu có
      if (statusFilter) params.status = statusFilter;

      console.log("Loading maintenance requests with params:", params);
      const response = await maintenanceService.getAllMaintenanceRequests(params);

      setMaintenanceRequests(response.maintenanceRequests || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalResults: response.totalResults || 0,
      }));
    } catch (error) {
      console.error("Error loading maintenance requests:", error);
      message.error("Lỗi khi tải danh sách yêu cầu bảo trì: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load thống kê maintenance requests từ API
   */
  const loadStats = async () => {
    try {
      const response = await maintenanceService.getMaintenanceStats();
      setStats(response);
    } catch (error) {
      console.error("Error loading maintenance stats:", error);
      message.error("Lỗi khi tải thống kê bảo trì: " + (error.response?.data?.message || error.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'orange';
      case 'In Progress': return 'blue';
      case 'Resolved': return 'green';
      case 'Rejected': return 'red';
      case 'Cancelled': return 'gray';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return 'Chờ xử lý';
      case 'In Progress': return 'Đang xử lý';
      case 'Resolved': return 'Đã hoàn thành';
      case 'Rejected': return 'Từ chối';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <ClockCircleOutlined />;
      case 'In Progress': return <ExclamationCircleOutlined />;
      case 'Resolved': return <CheckCircleOutlined />;
      case 'Rejected': return <DeleteOutlined />;
      case 'Cancelled': return <DeleteOutlined />;
      default: return <ToolOutlined />;
    }
  };

  // Xem chi tiết maintenance request
  const handleViewRequest = async (request) => {
    try {
      const detailResponse = await maintenanceService.getMaintenanceRequestById(request.feedbackId);
      setViewingRequest(detailResponse);
      setViewModalVisible(true);
    } catch (error) {
      console.error("Error loading maintenance request detail:", error);
      message.error("Lỗi khi tải chi tiết yêu cầu bảo trì");
    }
  };

  // Trả lời maintenance request
  const handleReplyRequest = (request) => {
    setReplyingRequest(request);
    setReplyModalVisible(true);
  };

  // Submit phản hồi
  const handleReplySubmit = async () => {
    try {
      const values = await replyForm.validateFields();
      setLoading(true);

      await maintenanceService.updateMaintenanceResponse(replyingRequest.feedbackId, {
        status: values.status,
        response: values.response,
      });

      message.success('Phản hồi thành công!');
      setReplyModalVisible(false);
      replyForm.resetFields();
      setReplyingRequest(null);
      
      // Reload dữ liệu
      await Promise.all([loadMaintenanceRequests(), loadStats()]);
    } catch (error) {
      console.error("Error replying maintenance request:", error);
      message.error("Lỗi khi phản hồi: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Sửa maintenance request
  const handleEditRequest = (request) => {
    setEditingRequest(request);
    form.setFieldsValue({
      description: request.description,
    });
    setEditModalVisible(true);
  };

  // Submit sửa maintenance request
  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await maintenanceService.updateMaintenanceRequest(editingRequest.feedbackId, {
        category: "Maintenance", // Luôn là Maintenance
        description: values.description,
      });

      message.success('Cập nhật yêu cầu bảo trì thành công!');
      setEditModalVisible(false);
      form.resetFields();
      setEditingRequest(null);
      
      // Reload dữ liệu
      await loadMaintenanceRequests();
    } catch (error) {
      console.error("Error updating maintenance request:", error);
      message.error("Lỗi khi cập nhật: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Xóa maintenance request
  const handleDeleteRequest = async (feedbackId) => {
    try {
      setLoading(true);
      await maintenanceService.deleteMaintenanceRequest(feedbackId);
      message.success('Xóa yêu cầu bảo trì thành công!');
      
      // Reload dữ liệu
      await Promise.all([loadMaintenanceRequests(), loadStats()]);
    } catch (error) {
      console.error("Error deleting maintenance request:", error);
      message.error("Lỗi khi xóa: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Tạo maintenance request mới
  const handleCreateRequest = () => {
    setCreateModalVisible(true);
  };

  // Submit tạo maintenance request
  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      setLoading(true);

      await maintenanceService.createMaintenanceRequest(values);

      message.success('Tạo yêu cầu bảo trì thành công!');
      setCreateModalVisible(false);
      createForm.resetFields();
      
      // Reload dữ liệu
      await Promise.all([loadMaintenanceRequests(), loadStats()]);
    } catch (error) {
      console.error("Error creating maintenance request:", error);
      message.error("Lỗi khi tạo yêu cầu bảo trì: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'feedbackId',
      key: 'feedbackId',
      width: 80,
      render: (text) => <Text strong>#{text}</Text>,
    },
    {
      title: 'Mô tả yêu cầu bảo trì',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <div>
          <Text strong style={{ fontSize: '14px' }}>{text}</Text>
          <br />
          <Tag color="orange" icon={<ToolOutlined />}>
            Bảo trì
          </Tag>
        </div>
      ),
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
      render: (userId) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size={32} icon={<UserOutlined />} style={{ marginRight: '8px' }} />
          <div>
            <Text strong>ID: {userId}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Chờ xử lý', value: 'Pending' },
        { text: 'Đang xử lý', value: 'In Progress' },
        { text: 'Đã hoàn thành', value: 'Resolved' },
        { text: 'Từ chối', value: 'Rejected' },
        { text: 'Đã hủy', value: 'Cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Phản hồi',
      dataIndex: 'response',
      key: 'response',
      render: (response) => (
        response ? (
          <Text type="success">Đã phản hồi</Text>
        ) : (
          <Text type="secondary">Chưa phản hồi</Text>
        )
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => (
        <div>
          <CalendarOutlined style={{ marginRight: '4px', color: '#666' }} />
          <Text style={{ fontSize: '12px' }}>
            {dayjs(date).format('DD/MM/YYYY')}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {dayjs(date).format('HH:mm')}
          </Text>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewRequest(record)} />
          </Tooltip>
          <Tooltip title="Trả lời">
            <Button type="link" icon={<CommentOutlined />} onClick={() => handleReplyRequest(record)} />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditRequest(record)} />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa yêu cầu bảo trì này?"
            onConfirm={() => handleDeleteRequest(record.feedbackId)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Lọc dữ liệu theo search text
  const filteredRequests = maintenanceRequests.filter(request =>
    request.description.toLowerCase().includes(searchText.toLowerCase()) ||
    request.feedbackId.toString().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Statistic
                  title="Tổng số"
                  value={stats.total}
                  prefix={<ToolOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Statistic
                  title="Chờ xử lý"
                  value={stats.pending}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Statistic
                  title="Đang xử lý"
                  value={stats.inProgress}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Statistic
                  title="Đã hoàn thành"
                  value={stats.resolved}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={4}>
                <Statistic
                  title="Từ chối"
                  value={stats.rejected}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Title level={4} style={{ margin: 0 }}>
              <ToolOutlined style={{ marginRight: '8px' }} />
              Quản lý Bảo trì
            </Title>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRequest}>
                Tạo Yêu cầu Bảo trì
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => Promise.all([loadMaintenanceRequests(), loadStats()])}>
                Làm mới
              </Button>
            </Space>
          </div>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Tìm kiếm yêu cầu bảo trì..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="Pending">Chờ xử lý</Option>
              <Option value="In Progress">Đang xử lý</Option>
              <Option value="Resolved">Đã hoàn thành</Option>
              <Option value="Rejected">Từ chối</Option>
              <Option value="Cancelled">Đã hủy</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredRequests}
          rowKey="feedbackId"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalResults,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu bảo trì`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, page, limit: pageSize }));
            },
          }}
          locale={{
            emptyText: <Empty description="Không có dữ liệu" />
          }}
        />
      </Card>

      {/* Modal xem chi tiết */}
      <Modal
        title="🔧 Chi tiết Yêu cầu Bảo trì"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingRequest && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={4}>#{viewingRequest.feedbackId}</Title>
                <Space>
                  <Tag color={getStatusColor(viewingRequest.status)}>
                    {getStatusText(viewingRequest.status)}
                  </Tag>
                  <Tag color="orange" icon={<ToolOutlined />}>
                    Bảo trì
                  </Tag>
                </Space>
              </div>
              
              <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Text strong>ID Yêu cầu: #{viewingRequest.feedbackId}</Text>
                    <Text strong>User ID: {viewingRequest.userId}</Text>
                    <Text>Loại: <Tag color="orange" icon={<ToolOutlined />}>Bảo trì</Tag></Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Text><CalendarOutlined /> Ngày tạo: {dayjs(viewingRequest.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                    <Text><CalendarOutlined /> Cập nhật: {dayjs(viewingRequest.updatedAt).format('DD/MM/YYYY HH:mm')}</Text>
                    {viewingRequest.responseDate && (
                      <Text><CalendarOutlined /> Ngày phản hồi: {dayjs(viewingRequest.responseDate).format('DD/MM/YYYY HH:mm')}</Text>
                    )}
                  </Space>
                </Col>
              </Row>

              <Divider />
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Mô tả yêu cầu bảo trì:</Text>
                <Paragraph style={{ marginTop: '8px', padding: '12px', backgroundColor: '#fff7e6', borderRadius: '8px', borderLeft: '4px solid #fa8c16' }}>
                  {viewingRequest.description}
                </Paragraph>
              </div>

              {viewingRequest.response && (
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Phản hồi từ Admin:</Text>
                  <Paragraph style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f0f8ff', borderRadius: '8px', borderLeft: '4px solid #1890ff' }}>
                    {viewingRequest.response}
                  </Paragraph>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal trả lời */}
      <Modal
        title="💬 Trả lời Yêu cầu Bảo trì"
        open={replyModalVisible}
        onOk={handleReplySubmit}
        onCancel={() => {
          setReplyModalVisible(false);
          replyForm.resetFields();
        }}
        width={600}
        confirmLoading={loading}
      >
        {replyingRequest && (
          <Form form={replyForm} layout="vertical">
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fff7e6', borderRadius: '8px' }}>
              <Text strong>Yêu cầu bảo trì #{replyingRequest.feedbackId}</Text>
              <br />
              <Text>{replyingRequest.description}</Text>
            </div>
            
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="Pending">Chờ xử lý</Option>
                <Option value="In Progress">Đang xử lý</Option>
                <Option value="Resolved">Đã hoàn thành</Option>
                <Option value="Rejected">Từ chối</Option>
                <Option value="Cancelled">Đã hủy</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="response"
              label="Phản hồi"
              rules={[{ required: true, message: 'Vui lòng nhập phản hồi!' }]}
            >
              <TextArea rows={4} placeholder="Nhập phản hồi về tiến độ bảo trì..." />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Modal sửa yêu cầu bảo trì */}
      <Modal
        title="✏️ Sửa Yêu cầu Bảo trì"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        width={600}
        confirmLoading={loading}
      >
        {editingRequest && (
          <Form form={form} layout="vertical">
            <Form.Item
              name="description"
              label="Mô tả yêu cầu bảo trì"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <TextArea rows={4} placeholder="Nhập mô tả yêu cầu bảo trì..." />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Modal tạo yêu cầu bảo trì */}
      <Modal
        title="➕ Tạo Yêu cầu Bảo trì Mới"
        open={createModalVisible}
        onOk={handleCreateSubmit}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        width={600}
        confirmLoading={loading}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="userId"
            label="User ID"
            rules={[{ required: true, message: 'Vui lòng nhập User ID!' }]}
          >
            <Input type="number" placeholder="Nhập User ID" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả yêu cầu bảo trì"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả yêu cầu bảo trì..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaintenanceManagement;
