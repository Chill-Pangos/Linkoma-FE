import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Upload,
  Table,
  Tag,
  Space,
  Row,
  Col,
  Typography,
  Modal,
  message,
  Descriptions,
  Rate,
  Progress,
  Tooltip,
  DatePicker
} from 'antd';
import {
  ToolOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  StarOutlined,
  CalendarOutlined,
  UserOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ResidentMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form] = Form.useForm();

  // Mock data - thay thế bằng dữ liệu thực từ API
  const mockRequests = [
    {
      id: 'MT001',
      title: 'Sửa chữa ống nước bị rò',
      category: 'Điện nước',
      priority: 'Cao',
      status: 'Hoàn thành',
      description: 'Ống nước trong nhà bếp bị rò rỉ, cần sửa chữa gấp',
      apartment: 'A101',
      createdDate: '2024-01-15',
      assignedDate: '2024-01-16',
      completedDate: '2024-01-17',
      technician: {
        name: 'Nguyễn Văn Thành',
        phone: '0123456789',
        rating: 5
      },
      feedback: {
        rating: 5,
        comment: 'Kỹ thuật viên làm việc rất chuyên nghiệp và nhanh chóng'
      },
      images: ['image1.jpg', 'image2.jpg'],
      cost: 250000
    },
    {
      id: 'MT002',
      title: 'Thay bóng đèn hành lang',
      category: 'Điện',
      priority: 'Thấp',
      status: 'Đang xử lý',
      description: 'Bóng đèn hành lang bị cháy, cần thay mới',
      apartment: 'A101',
      createdDate: '2024-01-20',
      assignedDate: '2024-01-21',
      completedDate: null,
      technician: {
        name: 'Trần Văn Minh',
        phone: '0987654321',
        rating: null
      },
      feedback: null,
      images: ['image3.jpg'],
      cost: null
    },
    {
      id: 'MT003',
      title: 'Sửa chữa khóa cửa',
      category: 'Cơ khí',
      priority: 'Trung bình',
      status: 'Chờ xử lý',
      description: 'Khóa cửa chính bị kẹt, khó mở',
      apartment: 'A101',
      createdDate: '2024-01-25',
      assignedDate: null,
      completedDate: null,
      technician: null,
      feedback: null,
      images: [],
      cost: null
    }
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRequests(mockRequests);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (values) => {
    try {
      // API call to create maintenance request
      console.log('Creating request:', values);
      
      const newRequest = {
        id: `MT${String(requests.length + 1).padStart(3, '0')}`,
        title: values.title,
        category: values.category,
        priority: values.priority,
        status: 'Chờ xử lý',
        description: values.description,
        apartment: 'A101',
        createdDate: dayjs().format('YYYY-MM-DD'),
        assignedDate: null,
        completedDate: null,
        technician: null,
        feedback: null,
        images: values.images?.fileList?.map(file => file.name) || [],
        cost: null
      };

      setRequests([newRequest, ...requests]);
      setModalVisible(false);
      form.resetFields();
      message.success('Tạo yêu cầu bảo trì thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo yêu cầu!');
    }
  };

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setDetailModalVisible(true);
  };

  const handleRating = async (requestId, rating, comment) => {
    try {
      // API call to submit rating
      console.log('Submitting rating:', { requestId, rating, comment });
      
      setRequests(requests.map(request => 
        request.id === requestId 
          ? { ...request, feedback: { rating, comment } }
          : request
      ));
      
      message.success('Đánh giá thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi gửi đánh giá!');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Chờ xử lý':
        return { color: 'default', icon: <ClockCircleOutlined /> };
      case 'Đang xử lý':
        return { color: 'processing', icon: <SyncOutlined spin /> };
      case 'Hoàn thành':
        return { color: 'success', icon: <CheckCircleOutlined /> };
      default:
        return { color: 'default', icon: null };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Cao': return '#ff4d4f';
      case 'Trung bình': return '#faad14';
      case 'Thấp': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const columns = [
    {
      title: 'Mã yêu cầu',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {status}
          </Tag>
        );
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 100,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      width: 100,
      render: (_, record) => (
        record.feedback ? (
          <Rate disabled value={record.feedback.rating} style={{ fontSize: 14 }} />
        ) : record.status === 'Hoàn thành' ? (
          <Text type="secondary">Chưa đánh giá</Text>
        ) : (
          <Text type="secondary">-</Text>
        )
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const RatingModal = ({ visible, onCancel, onSubmit, request }) => {
    const [ratingForm] = Form.useForm();

    const handleSubmit = (values) => {
      onSubmit(request.id, values.rating, values.comment);
      onCancel();
      ratingForm.resetFields();
    };

    return (
      <Modal
        title="Đánh giá dịch vụ bảo trì"
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={500}
      >
        <Form form={ratingForm} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Đánh giá chất lượng"
            name="rating"
            rules={[{ required: true, message: 'Vui lòng chọn đánh giá!' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            label="Nhận xét"
            name="comment"
            rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
          >
            <TextArea rows={4} placeholder="Nhập nhận xét về chất lượng dịch vụ..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Gửi đánh giá
              </Button>
              <Button onClick={onCancel}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <div className="resident-maintenance">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <ToolOutlined style={{ marginRight: 8 }} />
          Yêu cầu bảo trì
        </Title>
        <Text type="secondary">Quản lý các yêu cầu sửa chữa và bảo trì</Text>
      </div>

      {/* Thống kê nhanh */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                {requests.length}
              </div>
              <div style={{ color: '#666' }}>Tổng yêu cầu</div>
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                {requests.filter(r => r.status !== 'Hoàn thành').length}
              </div>
              <div style={{ color: '#666' }}>Đang xử lý</div>
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {requests.filter(r => r.status === 'Hoàn thành').length}
              </div>
              <div style={{ color: '#666' }}>Hoàn thành</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Nút tạo yêu cầu mới */}
      <Card style={{ marginBottom: 24 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setModalVisible(true)}
        >
          Tạo yêu cầu bảo trì mới
        </Button>
      </Card>

      {/* Bảng yêu cầu */}
      <Card>
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="id"
          loading={loading}
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} yêu cầu`
          }}
        />
      </Card>

      {/* Modal tạo yêu cầu */}
      <Modal
        title="Tạo yêu cầu bảo trì mới"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateRequest}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Ví dụ: Sửa chữa ống nước bị rò" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Danh mục"
                name="category"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn danh mục">
                  <Option value="Điện">Điện</Option>
                  <Option value="Nước">Nước</Option>
                  <Option value="Điện nước">Điện nước</Option>
                  <Option value="Cơ khí">Cơ khí</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Độ ưu tiên"
                name="priority"
                rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}
              >
                <Select placeholder="Chọn độ ưu tiên">
                  <Option value="Cao">Cao</Option>
                  <Option value="Trung bình">Trung bình</Option>
                  <Option value="Thấp">Thấp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Mô tả chi tiết"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea
              rows={4}
              placeholder="Mô tả chi tiết vấn đề cần sửa chữa..."
            />
          </Form.Item>

          <Form.Item
            label="Hình ảnh đính kèm"
            name="images"
          >
            <Upload
              listType="picture-card"
              maxCount={5}
              accept="image/*"
              beforeUpload={() => false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Tạo yêu cầu
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết */}
      <Modal
        title={`Chi tiết yêu cầu ${selectedRequest?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          selectedRequest?.status === 'Hoàn thành' && !selectedRequest?.feedback && (
            <Button
              key="rating"
              type="primary"
              icon={<StarOutlined />}
              onClick={() => {
                setDetailModalVisible(false);
                // Show rating modal
                Modal.confirm({
                  title: 'Đánh giá dịch vụ',
                  content: <RatingModal
                    visible={true}
                    request={selectedRequest}
                    onSubmit={handleRating}
                    onCancel={() => {}}
                  />,
                  footer: null,
                  closable: true
                });
              }}
            >
              Đánh giá
            </Button>
          ),
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ].filter(Boolean)}
        width={700}
      >
        {selectedRequest && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã yêu cầu" span={2}>
                <Text strong>{selectedRequest.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tiêu đề" span={2}>
                {selectedRequest.title}
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                <Tag color="blue">{selectedRequest.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Độ ưu tiên">
                <Tag color={getPriorityColor(selectedRequest.priority)}>
                  {selectedRequest.priority}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {(() => {
                  const config = getStatusConfig(selectedRequest.status);
                  return (
                    <Tag color={config.color} icon={config.icon}>
                      {selectedRequest.status}
                    </Tag>
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Căn hộ">
                {selectedRequest.apartment}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {dayjs(selectedRequest.createdDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {selectedRequest.assignedDate ? dayjs(selectedRequest.assignedDate).format('DD/MM/YYYY') : 'Chưa bắt đầu'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hoàn thành">
                {selectedRequest.completedDate ? dayjs(selectedRequest.completedDate).format('DD/MM/YYYY') : 'Chưa hoàn thành'}
              </Descriptions.Item>
              <Descriptions.Item label="Chi phí">
                {selectedRequest.cost ? `${selectedRequest.cost.toLocaleString('vi-VN')} đ` : 'Chưa xác định'}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedRequest.description}
              </Descriptions.Item>
            </Descriptions>

            {selectedRequest.technician && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Thông tin kỹ thuật viên:</Title>
                <Card size="small" style={{ background: '#f6f6f6' }}>
                  <Space>
                    <UserOutlined />
                    <Text>{selectedRequest.technician.name}</Text>
                    <PhoneOutlined />
                    <Text>{selectedRequest.technician.phone}</Text>
                  </Space>
                </Card>
              </div>
            )}

            {selectedRequest.feedback && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Đánh giá của bạn:</Title>
                <Card size="small" style={{ background: '#f6f6f6' }}>
                  <Rate disabled value={selectedRequest.feedback.rating} style={{ marginBottom: 8 }} />
                  <br />
                  <Text>{selectedRequest.feedback.comment}</Text>
                </Card>
              </div>
            )}

            {selectedRequest.images && selectedRequest.images.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Hình ảnh đính kèm:</Title>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedRequest.images.map((image, index) => (
                    <div key={index} style={{ 
                      width: 100, 
                      height: 100, 
                      background: '#f0f0f0', 
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Text type="secondary">{image}</Text>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResidentMaintenance;
