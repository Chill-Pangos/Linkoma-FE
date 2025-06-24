import React, { useState } from 'react';
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
  Rate,
  Badge,
  Tooltip,
  Popconfirm,
  message,
  Avatar,
  Divider,
  Timeline,
} from 'antd';
import {
  MessageOutlined,
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  CommentOutlined,
  SmileOutlined,
  FrownOutlined,
  HomeOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Search, TextArea } = Input;
const { Option } = Select;

const FeedbackManagement = () => {
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [replyingFeedback, setReplyingFeedback] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form] = Form.useForm();

  // Dữ liệu mẫu phản hồi
  const [feedbacks, setFeedbacks] = useState([
    {
      id: '1',
      ticketNumber: 'FB001',
      title: 'Vấn đề về hệ thống thang máy',
      category: 'maintenance',
      priority: 'high',
      status: 'pending',
      rating: 2,
      resident: {
        name: 'Nguyễn Văn An',
        apartment: 'A101',
        phone: '0912345678',
        email: 'nguyenvanan@email.com',
      },
      content: 'Thang máy số 1 trong tòa A bị hỏng từ sáng nay, cư dân phải đi bộ lên xuống rất bất tiện. Mong Ban quản lý sớm khắc phục.',
      attachments: [],
      createdAt: '2024-06-20 08:30:00',
      updatedAt: '2024-06-20 08:30:00',
      adminReplies: [],
    },
    {
      id: '2',
      ticketNumber: 'FB002',
      title: 'Đánh giá dịch vụ vệ sinh',
      category: 'service',
      priority: 'medium',
      status: 'resolved',
      rating: 5,
      resident: {
        name: 'Trần Thị Bình',
        apartment: 'B205',
        phone: '0923456789',
        email: 'tranthib@email.com',
      },
      content: 'Dịch vụ vệ sinh chung cư rất tốt, nhân viên làm việc chuyên nghiệp và chu đáo. Tôi rất hài lòng với chất lượng dịch vụ.',
      attachments: [],
      createdAt: '2024-06-19 14:20:00',
      updatedAt: '2024-06-20 09:15:00',
      adminReplies: [
        {
          id: '1',
          admin: 'Admin',
          content: 'Cảm ơn bạn đã đánh giá! Chúng tôi sẽ tiếp tục duy trì chất lượng dịch vụ.',
          createdAt: '2024-06-20 09:15:00',
        }
      ],
    },
    {
      id: '3',
      ticketNumber: 'FB003',
      title: 'Khiếu nại về tiếng ồn',
      category: 'complaint',
      priority: 'high',
      status: 'in_progress',
      rating: 1,
      resident: {
        name: 'Lê Văn Cường',
        apartment: 'C304',
        phone: '0934567890',
        email: 'levanc@email.com',
      },
      content: 'Căn hộ C305 bên cạnh thường xuyên gây tiếng ồn vào ban đêm, ảnh hưởng đến giấc ngủ của gia đình tôi. Đề nghị xử lý.',
      attachments: ['audio_complaint.mp3'],
      createdAt: '2024-06-18 22:45:00',
      updatedAt: '2024-06-19 10:30:00',
      adminReplies: [
        {
          id: '1',
          admin: 'Admin',
          content: 'Chúng tôi đã ghi nhận khiếu nại và sẽ liên hệ với cư dân C305 để giải quyết vấn đề.',
          createdAt: '2024-06-19 10:30:00',
        }
      ],
    },
    {
      id: '4',
      ticketNumber: 'FB004',
      title: 'Góp ý cải thiện khu vực tập thể dục',
      category: 'suggestion',
      priority: 'low',
      status: 'pending',
      rating: 4,
      resident: {
        name: 'Phạm Thị Dung',
        apartment: 'A203',
        phone: '0945678901',
        email: 'phamthid@email.com',
      },
      content: 'Khu vực tập thể dục cần thêm một số thiết bị mới như máy chạy bộ và xe đạp tập. Hiện tại thiết bị khá ít so với nhu cầu cư dân.',
      attachments: [],
      createdAt: '2024-06-17 16:00:00',
      updatedAt: '2024-06-17 16:00:00',
      adminReplies: [],
    },
    {
      id: '5',
      ticketNumber: 'FB005',
      title: 'Yêu cầu sửa chữa hệ thống nước',
      category: 'maintenance',
      priority: 'high',
      status: 'resolved',
      rating: 4,
      resident: {
        name: 'Hoàng Văn Em',
        apartment: 'B102',
        phone: '0956789012',
        email: 'hoangvane@email.com',
      },
      content: 'Áp lực nước tại căn hộ B102 rất yếu, đặc biệt vào giờ cao điểm buổi sáng và tối. Mong được kiểm tra và sửa chữa.',
      attachments: ['water_pressure_video.mp4'],
      createdAt: '2024-06-16 07:30:00',
      updatedAt: '2024-06-19 15:20:00',
      adminReplies: [
        {
          id: '1',
          admin: 'Admin',
          content: 'Chúng tôi đã cử kỹ thuật viên kiểm tra và khắc phục vấn đề. Áp lực nước đã trở lại bình thường.',
          createdAt: '2024-06-19 15:20:00',
        }
      ],
    },
  ]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'maintenance': return 'orange';
      case 'service': return 'blue';
      case 'complaint': return 'red';
      case 'suggestion': return 'green';
      default: return 'default';
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'maintenance': return 'Bảo trì';
      case 'service': return 'Dịch vụ';
      case 'complaint': return 'Khiếu nại';
      case 'suggestion': return 'Góp ý';
      default: return 'Khác';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'in_progress': return 'blue';
      case 'resolved': return 'green';
      case 'closed': return 'gray';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'in_progress': return 'Đang xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'closed': return 'Đã đóng';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockCircleOutlined />;
      case 'in_progress': return <ExclamationCircleOutlined />;
      case 'resolved': return <CheckCircleOutlined />;
      case 'closed': return <CheckCircleOutlined />;
      default: return <MessageOutlined />;
    }
  };

  const columns = [
    {
      title: 'Mã phiếu',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      width: 100,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '14px' }}>{text}</Text>
          <br />
          <Space size="small" style={{ marginTop: '4px' }}>
            <Tag color={getCategoryColor(record.category)}>
              {getCategoryText(record.category)}
            </Tag>
            <Tag color={getPriorityColor(record.priority)}>
              {getPriorityText(record.priority)}
            </Tag>
          </Space>
        </div>
      ),
    },
    {
      title: 'Cư dân',
      key: 'resident',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size={32} icon={<UserOutlined />} style={{ marginRight: '8px' }} />
          <div>
            <Text strong>{record.resident.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.resident.apartment}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      align: 'center',
      width: 120,
      render: (rating) => (
        <div>
          <Rate disabled value={rating} style={{ fontSize: '14px' }} />
          <br />
          <Text style={{ fontSize: '12px' }}>
            {rating === 5 ? 'Rất hài lòng' :
             rating === 4 ? 'Hài lòng' :
             rating === 3 ? 'Bình thường' :
             rating === 2 ? 'Không hài lòng' : 'Rất không hài lòng'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Chờ xử lý', value: 'pending' },
        { text: 'Đang xử lý', value: 'in_progress' },
        { text: 'Đã giải quyết', value: 'resolved' },
        { text: 'Đã đóng', value: 'closed' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {getStatusText(status)}
        </Tag>
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
      width: 150,
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Space size="small">
            <Tooltip title="Xem chi tiết">
              <Button
                type="primary"
                ghost
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewFeedback(record)}
              />
            </Tooltip>
            <Tooltip title="Trả lời">
              <Button
                type="default"
                size="small"
                icon={<CommentOutlined />}
                onClick={() => handleReplyFeedback(record)}
              />
            </Tooltip>
          </Space>
          <Space size="small">
            <Tooltip title="Cập nhật trạng thái">
              <Button
                type="default"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleUpdateStatus(record)}
              />
            </Tooltip>
            <Popconfirm
              title="Bạn có chắc muốn xóa phản hồi này?"
              onConfirm={() => handleDeleteFeedback(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Tooltip title="Xóa">
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        </Space>
      ),
    },
  ];

  const handleViewFeedback = (feedback) => {
    setViewingFeedback(feedback);
    setViewModalVisible(true);
  };

  const handleReplyFeedback = (feedback) => {
    setReplyingFeedback(feedback);
    form.resetFields();
    setReplyModalVisible(true);
  };

  const handleUpdateStatus = (feedback) => {
    Modal.confirm({
      title: 'Cập nhật trạng thái',
      content: (
        <Select
          defaultValue={feedback.status}
          style={{ width: '100%', marginTop: '16px' }}
          onChange={(value) => {
            setFeedbacks(feedbacks.map(f => 
              f.id === feedback.id ? { ...f, status: value, updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') } : f
            ));
            message.success('Đã cập nhật trạng thái!');
          }}
        >
          <Option value="pending">Chờ xử lý</Option>
          <Option value="in_progress">Đang xử lý</Option>
          <Option value="resolved">Đã giải quyết</Option>
          <Option value="closed">Đã đóng</Option>
        </Select>
      ),
      okText: 'Cập nhật',
      cancelText: 'Hủy',
    });
  };

  const handleDeleteFeedback = (id) => {
    setFeedbacks(feedbacks.filter(f => f.id !== id));
    message.success('Đã xóa phản hồi thành công!');
  };

  const handleReplySubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      setTimeout(() => {
        const newReply = {
          id: Date.now().toString(),
          admin: 'Admin',
          content: values.reply,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        
        setFeedbacks(feedbacks.map(f => 
          f.id === replyingFeedback.id 
            ? { 
                ...f, 
                adminReplies: [...f.adminReplies, newReply],
                status: 'in_progress',
                updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
              }
            : f
        ));
        
        message.success('Đã gửi phản hồi thành công!');
        setReplyModalVisible(false);
        setLoading(false);
        form.resetFields();
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.title.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback.resident.name.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback.resident.apartment.toLowerCase().includes(searchText.toLowerCase()) ||
      feedback.ticketNumber.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalFeedbacks = feedbacks.length;
  const pendingFeedbacks = feedbacks.filter(f => f.status === 'pending').length;
  const inProgressFeedbacks = feedbacks.filter(f => f.status === 'in_progress').length;
  const resolvedFeedbacks = feedbacks.filter(f => f.status === 'resolved').length;
  const averageRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;

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
            <MessageOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, background: 'linear-gradient(135deg, #1890ff, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Phản Hồi Cư Dân
            </Title>
            <Text type="secondary">Quản lý phản hồi, góp ý và khiếu nại từ cư dân</Text>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Tổng Phản Hồi</span>}
              value={totalFeedbacks}
              prefix={<MessageOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>phản hồi</span>}
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Chờ Xử Lý</span>}
              value={pendingFeedbacks}
              prefix={<ClockCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>phản hồi</span>}
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Đã Giải Quyết</span>}
              value={resolvedFeedbacks}
              prefix={<CheckCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>phản hồi</span>}
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
              title={<span style={{ color: 'rgba(100,100,100,0.8)' }}>Đánh Giá Trung Bình</span>}
              value={averageRating.toFixed(1)}
              prefix={<StarOutlined style={{ color: '#666' }} />}
              valueStyle={{ color: '#666', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(100,100,100,0.8)', fontSize: '16px' }}>/5 sao</span>}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng phản hồi */}
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
              <MessageOutlined style={{ color: 'white', fontSize: '16px' }} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
              Danh Sách Phản Hồi
            </span>
          </div>
        }
        extra={
          <Space>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ minWidth: '150px' }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="pending">Chờ xử lý</Option>
              <Option value="in_progress">Đang xử lý</Option>
              <Option value="resolved">Đã giải quyết</Option>
              <Option value="closed">Đã đóng</Option>
            </Select>
            <Search
              placeholder="Tìm kiếm phản hồi..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ minWidth: '300px' }}
            />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredFeedbacks}
          rowKey="id"
          pagination={{
            total: filteredFeedbacks.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} phản hồi`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal xem chi tiết phản hồi */}
      <Modal
        title="👁️ Chi Tiết Phản Hồi"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="reply" 
            type="primary" 
            icon={<CommentOutlined />}
            onClick={() => {
              setViewModalVisible(false);
              handleReplyFeedback(viewingFeedback);
            }}
          >
            Trả lời
          </Button>,
        ]}
        width={800}
      >
        {viewingFeedback && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={4}>{viewingFeedback.title}</Title>
                <Space>
                  <Tag color={getStatusColor(viewingFeedback.status)}>
                    {getStatusText(viewingFeedback.status)}
                  </Tag>
                  <Tag color={getPriorityColor(viewingFeedback.priority)}>
                    {getPriorityText(viewingFeedback.priority)}
                  </Tag>
                </Space>
              </div>
              
              <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Text strong>Mã phiếu: {viewingFeedback.ticketNumber}</Text>
                    <Text>Loại: <Tag color={getCategoryColor(viewingFeedback.category)}>{getCategoryText(viewingFeedback.category)}</Tag></Text>
                    <Text>Đánh giá: <Rate disabled value={viewingFeedback.rating} style={{ fontSize: '16px' }} /></Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Text><HomeOutlined /> Căn hộ: {viewingFeedback.resident.apartment}</Text>
                    <Text><UserOutlined /> Cư dân: {viewingFeedback.resident.name}</Text>
                    <Text><PhoneOutlined /> SĐT: {viewingFeedback.resident.phone}</Text>
                  </Space>
                </Col>
              </Row>

              <Divider />
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Nội dung phản hồi:</Text>
                <Paragraph style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                  {viewingFeedback.content}
                </Paragraph>
              </div>

              {viewingFeedback.attachments && viewingFeedback.attachments.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Tệp đính kèm:</Text>
                  <div style={{ marginTop: '8px' }}>
                    {viewingFeedback.attachments.map((file, index) => (
                      <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                        {file}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary">Tạo lúc: {dayjs(viewingFeedback.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Cập nhật: {dayjs(viewingFeedback.updatedAt).format('DD/MM/YYYY HH:mm')}</Text>
                </Col>
              </Row>
            </div>

            {viewingFeedback.adminReplies && viewingFeedback.adminReplies.length > 0 && (
              <div>
                <Divider />
                <Title level={5}>Phản hồi từ quản lý:</Title>
                <Timeline>
                  {viewingFeedback.adminReplies.map((reply) => (
                    <Timeline.Item key={reply.id} color="blue">
                      <div>
                        <Text strong>{reply.admin}</Text>
                        <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
                          {dayjs(reply.createdAt).format('DD/MM/YYYY HH:mm')}
                        </Text>
                      </div>
                      <Paragraph style={{ marginTop: '4px' }}>
                        {reply.content}
                      </Paragraph>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal trả lời */}
      <Modal
        title="💬 Trả Lời Phản Hồi"
        open={replyModalVisible}
        onOk={handleReplySubmit}
        onCancel={() => {
          setReplyModalVisible(false);
          form.resetFields();
        }}
        width={600}
        confirmLoading={loading}
        okText="Gửi phản hồi"
        cancelText="Hủy"
      >
        {replyingFeedback && (
          <div>
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <Text strong>Phản hồi gốc:</Text>
              <div style={{ marginTop: '8px' }}>
                <Text>{replyingFeedback.title}</Text>
                <br />
                <Text type="secondary">Từ: {replyingFeedback.resident.name} ({replyingFeedback.resident.apartment})</Text>
              </div>
            </div>
            
            <Form form={form} layout="vertical">
              <Form.Item
                name="reply"
                label="Nội dung phản hồi:"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi!' }]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder="Nhập nội dung phản hồi cho cư dân..."
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackManagement;
