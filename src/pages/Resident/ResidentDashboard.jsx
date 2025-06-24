import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Button,
  List,
  Avatar,
  Badge,
  Progress,
  Tag,
  Divider,
  Alert,
  Calendar,
  Timeline,
} from 'antd';
import {
  HomeOutlined,
  DollarCircleOutlined,
  NotificationOutlined,
  ToolOutlined,
  UserOutlined,
  BellOutlined,
  CalendarOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ResidentDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Mock data for resident info
  const residentInfo = {
    name: 'Nguyễn Văn An',
    apartment: 'A-1205',
    building: 'Tòa A',
    phone: '0987654321',
    email: 'nguyenvanan@email.com',
    memberSince: '2023-01-15',
    family: 4,
  };

  // Mock data for statistics
  const statsData = [
    {
      title: 'Hóa đơn tháng này',
      value: 2850000,
      suffix: 'VNĐ',
      valueStyle: { color: '#fa8c16' },
      prefix: <DollarCircleOutlined />,
      status: 'pending'
    },
    {
      title: 'Yêu cầu bảo trì',
      value: 2,
      suffix: 'yêu cầu',
      valueStyle: { color: '#1890ff' },
      prefix: <ToolOutlined />,
      status: 'active'
    },
    {
      title: 'Thông báo mới',
      value: 5,
      suffix: 'thông báo',
      valueStyle: { color: '#52c41a' },
      prefix: <NotificationOutlined />,
      status: 'new'
    },
    {
      title: 'Điểm cư dân',
      value: 95,
      suffix: 'điểm',
      valueStyle: { color: '#722ed1' },
      prefix: <SafetyCertificateOutlined />,
      status: 'excellent'
    },
  ];

  // Mock data for recent bills
  const recentBills = [
    {
      id: 1,
      type: 'Điện',
      amount: 850000,
      month: 'Tháng 12/2024',
      status: 'paid',
      dueDate: '2024-12-15',
      icon: <ThunderboltOutlined style={{ color: '#faad14' }} />
    },
    {
      id: 2,
      type: 'Nước',
      amount: 450000,
      month: 'Tháng 12/2024',
      status: 'paid',
      dueDate: '2024-12-15',
      icon: <GlobalOutlined style={{ color: '#1890ff' }} />
    },
    {
      id: 3,
      type: 'Gửi xe',
      amount: 300000,
      month: 'Tháng 12/2024',
      status: 'pending',
      dueDate: '2025-01-15',
      icon: <CarOutlined style={{ color: '#52c41a' }} />
    },
    {
      id: 4,
      type: 'Phí quản lý',
      amount: 1250000,
      month: 'Tháng 1/2025',
      status: 'pending',
      dueDate: '2025-01-15',
      icon: <HomeOutlined style={{ color: '#722ed1' }} />
    },
  ];

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      title: 'Thông báo bảo trì thang máy',
      content: 'Thang máy tòa A sẽ được bảo trì vào ngày 15/01/2025',
      time: '2 giờ trước',
      type: 'maintenance',
      unread: true
    },
    {
      id: 2,
      title: 'Hóa đơn tháng 1 đã có',
      content: 'Hóa đơn dịch vụ tháng 1/2025 đã được cập nhật',
      time: '1 ngày trước',
      type: 'bill',
      unread: true
    },
    {
      id: 3,
      title: 'Sự kiện Tết Nguyên Đán',
      content: 'Chương trình giao lưu Tết Nguyên Đán 2025',
      time: '2 ngày trước',
      type: 'event',
      unread: false
    },
  ];

  // Mock data for maintenance requests
  const maintenanceRequests = [
    {
      id: 1,
      title: 'Sửa vòi nước bồn rửa',
      status: 'completed',
      date: '2024-12-28',
      technician: 'Nguyễn Văn B'
    },
    {
      id: 2,
      title: 'Thay bóng đèn phòng khách',
      status: 'in-progress',
      date: '2025-01-02',
      technician: 'Trần Văn C'
    },
  ];

  const getBillStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'orange';
      case 'overdue': return 'red';
      default: return 'default';
    }
  };

  const getBillStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'overdue': return 'Quá hạn';
      default: return 'Không xác định';
    }
  };

  const getMaintenanceStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'in-progress': return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      case 'pending': return <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />;
      default: return <ClockCircleOutlined />;
    }
  };

  return (
    <div style={{ padding: '24px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: 'calc(100vh - 64px)' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ 
          margin: 0, 
          background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent' 
        }}>
          <HomeOutlined style={{ marginRight: '12px', color: '#52c41a' }} />
          Chào mừng trở lại, {residentInfo.name}!
        </Title>
        <Text type="secondary">Căn hộ {residentInfo.apartment} - {residentInfo.building}</Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: stat.status === 'pending' ? '2px solid #fa8c16' : '1px solid #f0f0f0'
            }}>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={stat.valueStyle}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
              {stat.status === 'pending' && (
                <div style={{ marginTop: '8px' }}>
                  <Tag color="orange">Cần xử lý</Tag>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        {/* Left Column */}
        <Col xs={24} lg={16}>
          {/* Urgent Notifications */}
          <Alert
            message="Thông báo quan trọng"
            description="Hóa đơn tháng 1/2025 sẽ đến hạn thanh toán vào ngày 15/01. Vui lòng thanh toán đúng hạn để tránh phát sinh phí."
            type="warning"
            showIcon
            style={{ marginBottom: '24px', borderRadius: '8px' }}
            action={
              <Button size="small" type="primary">
                Xem chi tiết
              </Button>
            }
          />

          {/* Recent Bills */}
          <Card
            title={
              <Space>
                <DollarCircleOutlined style={{ color: '#fa8c16' }} />
                <Text strong>Hóa đơn gần đây</Text>
              </Space>
            }
            style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '24px' }}
            extra={
              <Button type="primary" style={{
                background: 'linear-gradient(135deg, #fa8c16 0%, #fa541c 100%)',
                border: 'none'
              }}>
                Xem tất cả
              </Button>
            }
          >
            <List
              dataSource={recentBills}
              renderItem={(bill) => (
                <List.Item
                  actions={[
                    <Tag color={getBillStatusColor(bill.status)}>
                      {getBillStatusText(bill.status)}
                    </Tag>
                  ]}
                >
                  <List.Item.Meta
                    avatar={bill.icon}
                    title={
                      <Space>
                        <Text strong>{bill.type}</Text>
                        <Text type="secondary">- {bill.month}</Text>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text strong style={{ color: '#fa8c16' }}>
                          {bill.amount.toLocaleString()} VNĐ
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Hạn thanh toán: {bill.dueDate}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Maintenance Requests */}
          <Card
            title={
              <Space>
                <ToolOutlined style={{ color: '#1890ff' }} />
                <Text strong>Yêu cầu bảo trì</Text>
              </Space>
            }
            style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            extra={
              <Button type="primary" style={{
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none'
              }}>
                Tạo yêu cầu mới
              </Button>
            }
          >
            <Timeline>
              {maintenanceRequests.map((request) => (
                <Timeline.Item
                  key={request.id}
                  dot={getMaintenanceStatusIcon(request.status)}
                >
                  <div>
                    <Text strong>{request.title}</Text>
                    <br />
                    <Text type="secondary">Kỹ thuật viên: {request.technician}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {request.date}
                    </Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          {/* Resident Profile */}
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: '#722ed1' }} />
                <Text strong>Thông tin cư dân</Text>
              </Space>
            }
            style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '24px' }}
            extra={
              <Button type="link">Chỉnh sửa</Button>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Avatar size={64} icon={<UserOutlined />} style={{ 
                  background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)' 
                }} />
                <Title level={4} style={{ margin: '8px 0 0 0' }}>{residentInfo.name}</Title>
                <Text type="secondary">{residentInfo.apartment}</Text>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div>
                <Text type="secondary">Số điện thoại:</Text>
                <br />
                <Text strong>{residentInfo.phone}</Text>
              </div>
              
              <div>
                <Text type="secondary">Email:</Text>
                <br />
                <Text strong>{residentInfo.email}</Text>
              </div>
              
              <div>
                <Text type="secondary">Số thành viên:</Text>
                <br />
                <Text strong>{residentInfo.family} người</Text>
              </div>
              
              <div>
                <Text type="secondary">Thành viên từ:</Text>
                <br />
                <Text strong>{residentInfo.memberSince}</Text>
              </div>
            </Space>
          </Card>

          {/* Recent Notifications */}
          <Card
            title={
              <Space>
                <BellOutlined style={{ color: '#52c41a' }} />
                <Text strong>Thông báo mới</Text>
                <Badge count={notifications.filter(n => n.unread).length} />
              </Space>
            }
            style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '24px' }}
            extra={
              <Button type="link">Xem tất cả</Button>
            }
          >
            <List
              dataSource={notifications.slice(0, 3)}
              renderItem={(notification) => (
                <List.Item style={{ 
                  padding: '12px 0',
                  background: notification.unread ? 'rgba(82, 196, 26, 0.05)' : 'transparent',
                  borderRadius: '6px',
                  margin: '4px 0'
                }}>
                  <List.Item.Meta
                    avatar={
                      <Badge dot={notification.unread}>
                        <Avatar 
                          size="small" 
                          icon={<NotificationOutlined />}
                          style={{ background: '#52c41a' }}
                        />
                      </Badge>
                    }
                    title={
                      <Text strong={notification.unread} style={{ fontSize: '13px' }}>
                        {notification.title}
                      </Text>
                    }
                    description={
                      <div>
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{ fontSize: '12px', margin: 0, color: '#666' }}
                        >
                          {notification.content}
                        </Paragraph>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          {notification.time}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Quick Actions */}
          <Card
            title={
              <Space>
                <PhoneOutlined style={{ color: '#fa8c16' }} />
                <Text strong>Liên hệ nhanh</Text>
              </Space>
            }
            style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button 
                block 
                icon={<PhoneOutlined />}
                style={{ 
                  background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                  border: 'none',
                  color: 'white',
                  height: '40px'
                }}
              >
                Ban quản lý: 0246 666 8888
              </Button>
              
              <Button 
                block 
                icon={<SafetyCertificateOutlined />}
                style={{ 
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  border: 'none',
                  color: 'white',
                  height: '40px'
                }}
              >
                Bảo vệ: 0246 666 9999
              </Button>
              
              <Button 
                block 
                icon={<ToolOutlined />}
                style={{ 
                  background: 'linear-gradient(135deg, #fa8c16 0%, #fa541c 100%)',
                  border: 'none',
                  color: 'white',
                  height: '40px'
                }}
              >
                Kỹ thuật: 0246 666 7777
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ResidentDashboard;
