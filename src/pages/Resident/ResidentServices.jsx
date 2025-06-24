import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  List,
  Tag,
  Space,
  Button,
  Modal,
  message,
  Input,
  Select,
  Descriptions,
  Rate,
  Tooltip,
  Empty,
  Badge
} from 'antd';
import {
  CustomerServiceOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  PhoneOutlined,
  SearchOutlined,
  EyeOutlined,
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const ResidentServices = () => {
  const [services, setServices] = useState([]);
  const [bookedServices, setBookedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock data - thay thế bằng dữ liệu thực từ API
  const mockServices = [
    {
      id: 'SV001',
      name: 'Dịch vụ vệ sinh nhà cửa',
      category: 'Vệ sinh',
      description: 'Dịch vụ vệ sinh tổng thể căn hộ bao gồm lau dọn sàn nhà, kính cửa sổ, nhà vệ sinh, bếp...',
      price: 200000,
      unit: 'lần',
      duration: '2-3 giờ',
      rating: 4.5,
      totalBookings: 156,
      provider: {
        name: 'Công ty TNHH Vệ sinh ABC',
        phone: '0123456789',
        rating: 4.8
      },
      available: true,
      tags: ['Phổ biến', 'Uy tín'],
      images: ['cleaning1.jpg', 'cleaning2.jpg']
    },
    {
      id: 'SV002',
      name: 'Dịch vụ sửa chữa điện nước',
      category: 'Sửa chữa',
      description: 'Sửa chữa các thiết bị điện, nước trong nhà: thay bóng đèn, sửa ổ cắm, vòi nước...',
      price: 150000,
      unit: 'lần',
      duration: '1-2 giờ',
      rating: 4.3,
      totalBookings: 89,
      provider: {
        name: 'Thợ điện Minh Tuấn',
        phone: '0987654321',
        rating: 4.5
      },
      available: true,
      tags: ['Nhanh chóng', '24/7'],
      images: ['repair1.jpg']
    },
    {
      id: 'SV003',
      name: 'Dịch vụ giặt ủi',
      category: 'Giặt ủi',
      description: 'Dịch vụ giặt ủi quần áo, rèm cửa, chăn ga gối đệm tại nhà hoặc mang đi',
      price: 50000,
      unit: 'kg',
      duration: '1-2 ngày',
      rating: 4.7,
      totalBookings: 234,
      provider: {
        name: 'Tiệm giặt ủi Hoa Mai',
        phone: '0369852147',
        rating: 4.9
      },
      available: true,
      tags: ['Chất lượng cao', 'Giao nhận tận nơi'],
      images: ['laundry1.jpg', 'laundry2.jpg']
    },
    {
      id: 'SV004',
      name: 'Dịch vụ chăm sóc thú cưng',
      category: 'Thú cưng',
      description: 'Dịch vụ tắm, cắt tỉa lông, chăm sóc sức khỏe cho chó mèo',
      price: 300000,
      unit: 'lần',
      duration: '2-4 giờ',
      rating: 4.6,
      totalBookings: 67,
      provider: {
        name: 'Pet Spa Cute',
        phone: '0258741369',
        rating: 4.7
      },
      available: false,
      tags: ['Yêu thương', 'Chuyên nghiệp'],
      images: ['pet1.jpg', 'pet2.jpg']
    },
    {
      id: 'SV005',
      name: 'Dịch vụ giao đồ ăn',
      category: 'Giao hàng',
      description: 'Dịch vụ giao đồ ăn từ các nhà hàng, quán ăn đến tận cửa',
      price: 25000,
      unit: 'đơn',
      duration: '30-60 phút',
      rating: 4.2,
      totalBookings: 445,
      provider: {
        name: 'Linkoma Delivery',
        phone: '1900123456',
        rating: 4.4
      },
      available: true,
      tags: ['Nhanh chóng', 'Tiện lợi'],
      images: ['food1.jpg']
    }
  ];

  const mockBookedServices = [
    {
      id: 'BK001',
      serviceId: 'SV001',
      serviceName: 'Dịch vụ vệ sinh nhà cửa',
      bookingDate: '2024-01-25',
      serviceDate: '2024-01-28',
      serviceTime: '09:00',
      status: 'Hoàn thành',
      apartment: 'A101',
      quantity: 1,
      totalPrice: 200000,
      notes: 'Vệ sinh tổng thể, tập trung vào nhà bếp và phòng tắm',
      provider: {
        name: 'Công ty TNHH Vệ sinh ABC',
        phone: '0123456789'
      },
      rating: 5,
      feedback: 'Dịch vụ rất tốt, nhân viên chuyên nghiệp'
    },
    {
      id: 'BK002',
      serviceId: 'SV002',
      serviceName: 'Dịch vụ sửa chữa điện nước',
      bookingDate: '2024-01-26',
      serviceDate: '2024-01-27',
      serviceTime: '14:00',
      status: 'Đang thực hiện',
      apartment: 'A101',
      quantity: 1,
      totalPrice: 150000,
      notes: 'Sửa vòi nước bị rò ở nhà bếp',
      provider: {
        name: 'Thợ điện Minh Tuấn',
        phone: '0987654321'
      },
      rating: null,
      feedback: null
    },
    {
      id: 'BK003',
      serviceId: 'SV003',
      serviceName: 'Dịch vụ giặt ủi',
      bookingDate: '2024-01-20',
      serviceDate: '2024-01-22',
      serviceTime: '10:00',
      status: 'Đã hủy',
      apartment: 'A101',
      quantity: 5,
      totalPrice: 250000,
      notes: 'Giặt chăn ga gối đệm',
      provider: {
        name: 'Tiệm giặt ủi Hoa Mai',
        phone: '0369852147'
      },
      rating: null,
      feedback: null
    }
  ];

  useEffect(() => {
    fetchServices();
    fetchBookedServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setServices(mockServices);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải danh sách dịch vụ!');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedServices = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setBookedServices(mockBookedServices);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải lịch sử đặt dịch vụ!');
    }
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setBookingModalVisible(true);
  };

  const handleConfirmBooking = async () => {
    try {
      // API call to book service
      const newBooking = {
        id: `BK${String(bookedServices.length + 1).padStart(3, '0')}`,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        bookingDate: dayjs().format('YYYY-MM-DD'),
        serviceDate: dayjs().add(2, 'days').format('YYYY-MM-DD'),
        serviceTime: '09:00',
        status: 'Đã đặt',
        apartment: 'A101',
        quantity: 1,
        totalPrice: selectedService.price,
        notes: '',
        provider: selectedService.provider,
        rating: null,
        feedback: null
      };

      setBookedServices([newBooking, ...bookedServices]);
      setBookingModalVisible(false);
      message.success('Đặt dịch vụ thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi đặt dịch vụ!');
    }
  };

  const handleViewBookingDetail = (booking) => {
    setSelectedBooking(booking);
    setDetailModalVisible(true);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Đã đặt':
        return { color: 'blue', icon: <ClockCircleOutlined /> };
      case 'Đang thực hiện':
        return { color: 'processing', icon: <ClockCircleOutlined /> };
      case 'Hoàn thành':
        return { color: 'success', icon: <CheckCircleOutlined /> };
      case 'Đã hủy':
        return { color: 'error', icon: <ClockCircleOutlined /> };
      default:
        return { color: 'default', icon: null };
    }
  };

  const filteredServices = services.filter(service => {
    const matchKeyword = !searchKeyword || 
      service.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      service.description.toLowerCase().includes(searchKeyword.toLowerCase());
    
    const matchCategory = categoryFilter === 'all' || service.category === categoryFilter;
    
    return matchKeyword && matchCategory;
  });

  const categories = [...new Set(services.map(service => service.category))];

  return (
    <div className="resident-services">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <CustomerServiceOutlined style={{ marginRight: 8 }} />
          Dịch vụ cư dân
        </Title>
        <Text type="secondary">Đặt và quản lý các dịch vụ tiện ích</Text>
      </div>

      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                {services.length}
              </div>
              <div style={{ color: '#666' }}>Dịch vụ</div>
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {bookedServices.filter(b => b.status === 'Hoàn thành').length}
              </div>
              <div style={{ color: '#666' }}>Đã sử dụng</div>
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                {bookedServices.filter(b => b.status !== 'Hoàn thành' && b.status !== 'Đã hủy').length}
              </div>
              <div style={{ color: '#666' }}>Đang xử lý</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm dịch vụ..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: '100%' }}
              placeholder="Chọn danh mục"
            >
              <Option value="all">Tất cả danh mục</Option>
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Danh sách dịch vụ */}
      <Card title="Danh sách dịch vụ" style={{ marginBottom: 24 }}>
        {filteredServices.length === 0 ? (
          <Empty description="Không tìm thấy dịch vụ nào" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredServices.map(service => (
              <Col xs={24} sm={12} lg={8} key={service.id}>
                <Card
                  size="small"
                  hoverable
                  cover={
                    <div style={{ 
                      height: 150, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 48
                    }}>
                      <CustomerServiceOutlined />
                    </div>
                  }
                  actions={[
                    <Button
                      type="primary"
                      size="small"
                      disabled={!service.available}
                      onClick={() => handleBookService(service)}
                    >
                      {service.available ? 'Đặt dịch vụ' : 'Không khả dụng'}
                    </Button>
                  ]}
                >
                  <div style={{ marginBottom: 8 }}>
                    <Text strong ellipsis>{service.name}</Text>
                    <br />
                    <Tag color="blue">{service.category}</Tag>
                    {!service.available && (
                      <Tag color="red">Tạm ngưng</Tag>
                    )}
                  </div>
                  
                  <Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: 12, marginBottom: 8 }}>
                    {service.description}
                  </Paragraph>
                  
                  <div style={{ marginBottom: 8 }}>
                    <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                      {service.price.toLocaleString('vi-VN')}đ/{service.unit}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Thời gian: {service.duration}
                    </Text>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <Rate disabled value={service.rating} style={{ fontSize: 12 }} />
                      <Text style={{ fontSize: 12 }}>({service.totalBookings})</Text>
                    </Space>
                  </div>
                  
                  {service.tags && (
                    <div style={{ marginTop: 8 }}>
                      {service.tags.map(tag => (
                        <Tag key={tag} size="small" color="green">{tag}</Tag>
                      ))}
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* Lịch sử đặt dịch vụ */}
      <Card title="Lịch sử đặt dịch vụ">
        {bookedServices.length === 0 ? (
          <Empty description="Chưa có dịch vụ nào được đặt" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={bookedServices}
            pagination={{
              pageSize: 5,
              showSizeChanger: false
            }}
            renderItem={booking => {
              const statusConfig = getStatusConfig(booking.status);
              return (
                <List.Item
                  actions={[
                    <Tooltip title="Xem chi tiết">
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewBookingDetail(booking)}
                      />
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<CustomerServiceOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text strong>{booking.serviceName}</Text>
                        <Tag color={statusConfig.color} icon={statusConfig.icon}>
                          {booking.status}
                        </Tag>
                      </div>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <Text type="secondary">
                          <CalendarOutlined /> Ngày đặt: {dayjs(booking.bookingDate).format('DD/MM/YYYY')}
                        </Text>
                        <Text type="secondary">
                          <ClockCircleOutlined /> Ngày thực hiện: {dayjs(booking.serviceDate).format('DD/MM/YYYY')} {booking.serviceTime}
                        </Text>
                        <Text type="secondary">
                          <DollarOutlined /> Giá: {booking.totalPrice.toLocaleString('vi-VN')}đ
                        </Text>
                        {booking.rating && (
                          <div>
                            <Rate disabled value={booking.rating} style={{ fontSize: 12 }} />
                          </div>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>

      {/* Modal đặt dịch vụ */}
      <Modal
        title="Xác nhận đặt dịch vụ"
        open={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        onOk={handleConfirmBooking}
        width={600}
      >
        {selectedService && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Tên dịch vụ" span={2}>
                <Text strong>{selectedService.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                <Tag color="blue">{selectedService.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Giá">
                <Text strong style={{ color: '#1890ff' }}>
                  {selectedService.price.toLocaleString('vi-VN')}đ/{selectedService.unit}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian thực hiện">
                {selectedService.duration}
              </Descriptions.Item>
              <Descriptions.Item label="Nhà cung cấp">
                <Space>
                  <TeamOutlined />
                  {selectedService.provider.name}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <Space>
                  <PhoneOutlined />
                  {selectedService.provider.phone}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Đánh giá">
                <Rate disabled value={selectedService.provider.rating} style={{ fontSize: 14 }} />
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <Text strong>Mô tả dịch vụ:</Text>
              <Paragraph style={{ marginTop: 8, background: '#f6f6f6', padding: 12, borderRadius: 4 }}>
                {selectedService.description}
              </Paragraph>
            </div>

            <div style={{ 
              marginTop: 16, 
              padding: 16, 
              background: '#e6f7ff', 
              borderRadius: 4,
              border: '1px solid #91d5ff'
            }}>
              <Text strong>Lưu ý:</Text>
              <ul style={{ marginTop: 8, marginBottom: 0 }}>
                <li>Dịch vụ sẽ được thực hiện trong vòng 2-3 ngày kể từ khi đặt</li>
                <li>Vui lòng có mặt tại nhà trong giờ hẹn</li>
                <li>Có thể hủy dịch vụ trước 24h</li>
                <li>Thanh toán sau khi hoàn thành dịch vụ</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal chi tiết booking */}
      <Modal
        title={`Chi tiết đặt dịch vụ ${selectedBooking?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedBooking && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã đặt dịch vụ" span={2}>
                <Text strong>{selectedBooking.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tên dịch vụ" span={2}>
                {selectedBooking.serviceName}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {(() => {
                  const config = getStatusConfig(selectedBooking.status);
                  return (
                    <Tag color={config.color} icon={config.icon}>
                      {selectedBooking.status}
                    </Tag>
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Căn hộ">
                {selectedBooking.apartment}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {dayjs(selectedBooking.bookingDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày thực hiện">
                {dayjs(selectedBooking.serviceDate).format('DD/MM/YYYY')} {selectedBooking.serviceTime}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng">
                {selectedBooking.quantity}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Text strong style={{ color: '#1890ff' }}>
                  {selectedBooking.totalPrice.toLocaleString('vi-VN')}đ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Nhà cung cấp">
                {selectedBooking.provider.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedBooking.provider.phone}
              </Descriptions.Item>
              {selectedBooking.notes && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  {selectedBooking.notes}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedBooking.rating && (
              <div style={{ marginTop: 16 }}>
                <Text strong>Đánh giá của bạn:</Text>
                <div style={{ 
                  marginTop: 8, 
                  padding: 12, 
                  background: '#f6f6f6', 
                  borderRadius: 4 
                }}>
                  <Rate disabled value={selectedBooking.rating} />
                  <br />
                  <Text style={{ marginTop: 8 }}>{selectedBooking.feedback}</Text>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResidentServices;
